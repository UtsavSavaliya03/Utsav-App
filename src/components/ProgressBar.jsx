import React from 'react'

const STEPS = [
  { label: 'Personal',   sub: 'Identity & contact',     icon: '👤' },
  { label: 'Education',  sub: 'Qualifications & work',   icon: '🎓' },
  { label: 'Skills',     sub: 'Expertise & statement',   icon: '⚡' },
  { label: 'Documents',  sub: 'Upload & review',          icon: '📎' },
]

export function ProgressBar({ currentStep, completedSteps }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {/* Step row */}
      <div className='md:flex items-start'>
        {STEPS.map((step, i) => {
          const isDone    = completedSteps.includes(i)
          const isActive  = currentStep === i

          return (
            <React.Fragment key={i}>
              {/* Step node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div className='mt-4 md:mt-0'
                 style={{
                  width: 38, height: 38, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isDone ? 15 : 13,
                  fontWeight: 600,
                  transition: 'all .35s',
                  background: isDone
                    ? 'linear-gradient(135deg,#10B981,#059669)'
                    : isActive
                    ? 'linear-gradient(135deg,#3B82F6,#2563EB)'
                    : '#F1F5F9',
                  color: isDone || isActive ? '#fff' : '#94A3B8',
                  border: isActive ? '3px solid #BFDBFE' : isDone ? '3px solid #A7F3D0' : '2px solid #E2E8F0',
                  boxShadow: isActive
                    ? '0 4px 14px rgba(59,130,246,.35)'
                    : isDone
                    ? '0 2px 8px rgba(16,185,129,.25)'
                    : 'none',
                }}>
                  {isDone ? '✓' : i + 1}
                </div>
                {/* Labels */}
                <div style={{ marginTop: 8, textAlign: 'center', minWidth: 80 }}>
                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: isActive ? '#2563EB' : isDone ? '#059669' : '#94A3B8',
                    transition: 'color .3s',
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 14, color: '#a9aaaf', marginTop: 1 }}>{step.sub}</div>
                </div>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className='hidden md:block' style={{
                  flex: 1, height: 3, margin: '17px 8px 0',
                  background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 99,
                    background: 'linear-gradient(90deg,#10B981,#34D399)',
                    width: isDone ? '100%' : '0%',
                    transition: 'width .6s cubic-bezier(.4,0,.2,1)',
                  }} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Overall progress bar */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>Application progress</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#3B82F6' }}>
            {Math.round(((completedSteps.length) / STEPS.length) * 100)}% complete
          </span>
        </div>
        <div style={{ height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(completedSteps.length / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg,#3B82F6,#06B6D4)',
            borderRadius: 99,
            transition: 'width .6s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
      </div>
    </div>
  )
}
