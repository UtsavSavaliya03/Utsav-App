import { useState, useEffect, useCallback, useRef } from 'react'

function injectDyslexiaFont() {
  if (document.getElementById('lexend-font')) return
  const link  = document.createElement('link')
  link.id     = 'lexend-font'
  link.rel    = 'stylesheet'
  link.href   = 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap'
  document.head.appendChild(link)
}

const ZOOM_STEPS = [75, 85, 100, 115, 130, 150]
const DEFAULTS   = { zoomLevel: 100, dyslexiaFont: false, voiceEnabled: false, magnifierActive: false }

const ZOOM_TARGET_ID = 'form-zoom-target'

function getZoomTarget() {
  return document.getElementById(ZOOM_TARGET_ID) || document.body
}

function applyZoomToTarget(level) {
  const el = getZoomTarget()
  if (level === 100) {
    el.style.transform       = ''
    el.style.transformOrigin = ''
    el.style.width           = ''
  } else {
    const scale              = level / 100
    el.style.transform       = `scale(${scale})`
    el.style.transformOrigin = 'top center'
    el.style.width           = `${(1 / scale) * 100}%`
  }
}

export function useAccessibility() {
  const [settings, setSettings] = useState(DEFAULTS)

  const synthRef      = useRef(window.speechSynthesis || null)
  const lastSpokenRef = useRef('')
  const rafRef        = useRef(null)
  const mousePos      = useRef({ x: 0, y: 0 })
  const lensRef       = useRef(null)  // outer circle
  const sceneRef      = useRef(null)  // scaled page clone container

  // ── ZOOM ──────────────────────────────────────────────────────────────────
  const zoomIn = useCallback(() => {
    setSettings(s => {
      const idx  = ZOOM_STEPS.indexOf(s.zoomLevel)
      const next = ZOOM_STEPS[Math.min(idx + 1, ZOOM_STEPS.length - 1)]
      applyZoomToTarget(next)
      return { ...s, zoomLevel: next }
    })
  }, [])

  const zoomOut = useCallback(() => {
    setSettings(s => {
      const idx  = ZOOM_STEPS.indexOf(s.zoomLevel)
      const next = ZOOM_STEPS[Math.max(idx - 1, 0)]
      applyZoomToTarget(next)
      return { ...s, zoomLevel: next }
    })
  }, [])

  const resetZoom = useCallback(() => {
    applyZoomToTarget(100)
    setSettings(s => ({ ...s, zoomLevel: 100 }))
  }, [])

  // ── DYSLEXIA FONT ─────────────────────────────────────────────────────────
  const toggleDyslexiaFont = useCallback(() => {
    setSettings(s => {
      const next = !s.dyslexiaFont
      if (next) { injectDyslexiaFont(); document.documentElement.setAttribute('data-dyslexia', 'true') }
      else        document.documentElement.removeAttribute('data-dyslexia')
      return { ...s, dyslexiaFont: next }
    })
  }, [])

  // ── VOICE ─────────────────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!synthRef.current || !text || text === lastSpokenRef.current) return
    lastSpokenRef.current = text
    synthRef.current.cancel()
    const utt  = new SpeechSynthesisUtterance(text)
    utt.rate   = 0.9
    utt.volume = 1
    synthRef.current.speak(utt)
  }, [])

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel()
    lastSpokenRef.current = ''
  }, [])

  const toggleVoice = useCallback(() => {
    setSettings(s => {
      const next = !s.voiceEnabled
      if (!next) { synthRef.current?.cancel(); lastSpokenRef.current = '' }
      else        speak('Voice assistance enabled.')
      return { ...s, voiceEnabled: next }
    })
  }, [speak])

  useEffect(() => {
    if (!settings.voiceEnabled) return

    const getReadableText = (el) => {
      if (!el || el === document.body) return ''
      const dv = el.closest?.('[data-voice]')?.getAttribute('data-voice')
      if (dv) return dv
      const lbl = el.closest?.('label')
      if (lbl) return lbl.innerText?.trim()
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
        return el.getAttribute('placeholder') || el.getAttribute('aria-label') || ''
      const btn = el.closest?.('button, a')
      if (btn) return btn.innerText?.trim()
      const t = (el.innerText || el.textContent || '').trim()
      return t.length > 0 && t.length < 160 ? t : ''
    }

    let timer = null
    const handler = (e) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const text = getReadableText(e.target)
        if (text) speak(text)
      }, 150)
    }

    document.addEventListener('mouseover', handler)
    return () => { document.removeEventListener('mouseover', handler); clearTimeout(timer) }
  }, [settings.voiceEnabled, speak])

  // ── MAGNIFIER ─────────────────────────────────────────────────────────────
  //
  // How it works (Windows-magnifier style):
  //
  // 1. Create a fixed circular overlay (the "lens") — overflow:hidden, pointer-events:none
  // 2. Inside the lens, inject a <style> that sets the REAL document.body to
  //    transform:scale(SCALE) with a CSS custom property controlling the translate offset
  // 3. On every mousemove (via rAF), update --mag-x and --mag-y so the area
  //    under the cursor appears centred in the lens
  //
  // This works because we are transforming the ACTUAL DOM, not a copy.
  // The lens clips the transformed body to show only the region we want.
  // A second fixed overlay (the "cutout") covers the rest of the viewport
  // so the scaled body is invisible outside the lens circle.
  //
  // Pointer events go to the REAL body (z-index lower), not the overlay,
  // so the form stays fully interactive while the lens is active.

  const toggleMagnifier = useCallback(() => {
    setSettings(s => ({ ...s, magnifierActive: !s.magnifierActive }))
  }, [])

  // ── Global dyslexia styles ─────────────────────────────────────────────────
  useEffect(() => {
    const s = document.getElementById('__a11y_styles__') || (() => {
      const el = document.createElement('style')
      el.id    = '__a11y_styles__'
      document.head.appendChild(el)
      return el
    })()
    s.textContent = `
      [data-dyslexia="true"] *:not(code):not(pre) {
        font-family: 'Lexend', sans-serif !important;
        letter-spacing: 0.04em !important;
        word-spacing:   0.1em  !important;
        line-height:    1.8    !important;
      }
    `
  }, [])

  // ── Reset all ─────────────────────────────────────────────────────────────
  const resetAll = useCallback(() => {
    applyZoomToTarget(100)
    document.documentElement.removeAttribute('data-dyslexia')
    synthRef.current?.cancel()
    lastSpokenRef.current = ''
    setSettings(DEFAULTS)
  }, [])

  return {
    settings,
    zoomIn, zoomOut, resetZoom,
    toggleDyslexiaFont,
    toggleVoice, speak, stopSpeaking,
    toggleMagnifier,
    resetAll,
  }
}
