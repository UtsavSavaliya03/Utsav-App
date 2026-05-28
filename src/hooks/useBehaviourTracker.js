import { useRef, useState, useEffect, useCallback } from 'react'

const INITIAL_METRICS = {
  timeOnStep: 0,
  backspaceCount: 0,
  idleSeconds: 0,
  navLoops: 0,
  failedValidations: 0,
  fieldRevisits: 0,
  totalKeystrokes: 0,
  inputCorrections: 0,
  cursorHesitations: 0,
  rapidClicks: 0,
  sessionDuration: 0,
}

export function useBehaviourTracker() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS)
  const [events, setEvents] = useState([])
  const metricsRef = useRef(INITIAL_METRICS)
  const stepStartRef = useRef(Date.now())
  const sessionStartRef = useRef(Date.now())
  const lastActivityRef = useRef(Date.now())
  const focusedFieldsRef = useRef({})
  const stepHistoryRef = useRef([0])
  const lastClickTimeRef = useRef(0)
  const inactivityTimerRef = useRef(null)
  const clockTimerRef = useRef(null)

  const addEvent = useCallback((msg, level = 'info') => {
    const entry = {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      msg,
      level,
    }
    setEvents(prev => [...prev.slice(-49), entry])
  }, [])

  const updateMetrics = useCallback((updates) => {
    metricsRef.current = { ...metricsRef.current, ...updates }
    setMetrics({ ...metricsRef.current })
  }, [])

  // Clocks
  useEffect(() => {
    clockTimerRef.current = setInterval(() => {
      const now = Date.now()
      const timeOnStep = Math.round((now - stepStartRef.current) / 1000)
      const sessionDuration = Math.round((now - sessionStartRef.current) / 1000)
      const idleSeconds = Math.round((now - lastActivityRef.current) / 1000)

      if (idleSeconds === 8 && metricsRef.current.idleSeconds < 8) {
        addEvent(`Cursor idle for ${idleSeconds}s`, 'warn')
      }
      if (idleSeconds === 15 && metricsRef.current.idleSeconds < 15) {
        addEvent(`Extended inactivity detected — ${idleSeconds}s`, 'danger')
        metricsRef.current.cursorHesitations += 1
      }

      updateMetrics({ timeOnStep, sessionDuration, idleSeconds })
    }, 1000)

    return () => clearInterval(clockTimerRef.current)
  }, [addEvent, updateMetrics])

  const onKeyDown = useCallback((e, fieldId) => {
    lastActivityRef.current = Date.now()
    const m = metricsRef.current

    if (e.key === 'Backspace') {
      const next = m.backspaceCount + 1
      updateMetrics({ backspaceCount: next })
      if (next % 5 === 0) addEvent(`Backspace count: ${next}`, next > 10 ? 'danger' : 'warn')
    }

    updateMetrics({
      totalKeystrokes: m.totalKeystrokes + 1,
      idleSeconds: 0,
    })
  }, [addEvent, updateMetrics])

  const onInputChange = useCallback((fieldId) => {
    lastActivityRef.current = Date.now()
    updateMetrics({ idleSeconds: 0 })
  }, [updateMetrics])

  const onFieldFocus = useCallback((fieldId) => {
    lastActivityRef.current = Date.now()
    if (focusedFieldsRef.current[fieldId]) {
      const next = metricsRef.current.fieldRevisits + 1
      updateMetrics({ fieldRevisits: next })
      addEvent(`Re-visited field: ${fieldId}`, 'warn')
    }
    focusedFieldsRef.current[fieldId] = true
    updateMetrics({ idleSeconds: 0 })
  }, [addEvent, updateMetrics])

  const onNavigate = useCallback((fromStep, toStep) => {
    stepHistoryRef.current.push(toStep)
    const hist = stepHistoryRef.current
    if (hist.length > 2 && hist[hist.length - 2] !== fromStep) {
      const next = metricsRef.current.navLoops + 1
      updateMetrics({ navLoops: next })
      addEvent(`Navigation loop #${next}: step ${fromStep + 1} → ${toStep + 1}`, 'warn')
    }
    stepStartRef.current = Date.now()
    focusedFieldsRef.current = {}
    updateMetrics({ timeOnStep: 0, idleSeconds: 0 })
    addEvent(`Navigated to step ${toStep + 1}`)
  }, [addEvent, updateMetrics])

  const onValidationFail = useCallback((stepIdx, failedFields) => {
    const next = metricsRef.current.failedValidations + 1
    updateMetrics({ failedValidations: next })
    addEvent(`Validation failed — step ${stepIdx + 1}: ${failedFields.join(', ')}`, 'danger')
  }, [addEvent, updateMetrics])

  const onInputCorrection = useCallback(() => {
    const next = metricsRef.current.inputCorrections + 1
    updateMetrics({ inputCorrections: next })
  }, [updateMetrics])

  const onClick = useCallback(() => {
    lastActivityRef.current = Date.now()
    const now = Date.now()
    if (now - lastClickTimeRef.current < 400) {
      const next = metricsRef.current.rapidClicks + 1
      updateMetrics({ rapidClicks: next })
      if (next % 3 === 0) addEvent(`Rapid click pattern detected (#${next})`, 'warn')
    }
    lastClickTimeRef.current = now
    updateMetrics({ idleSeconds: 0 })
  }, [addEvent, updateMetrics])

  const resetStep = useCallback(() => {
    stepStartRef.current = Date.now()
    focusedFieldsRef.current = {}
    updateMetrics({ timeOnStep: 0, idleSeconds: 0, backspaceCount: 0 })
  }, [updateMetrics])

  const getSnapshot = useCallback(() => {
    return { ...metricsRef.current }
  }, [])

  return {
    metrics,
    events,
    addEvent,
    onKeyDown,
    onInputChange,
    onFieldFocus,
    onNavigate,
    onValidationFail,
    onInputCorrection,
    onClick,
    resetStep,
    getSnapshot,
  }
}
