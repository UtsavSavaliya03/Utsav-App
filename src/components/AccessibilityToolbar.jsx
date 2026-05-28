import React from 'react'

export function AccessibilityToolbar({
  visible, panelOpen, onOpenPanel,
  settings, zoomIn, zoomOut, toggleVoice, toggleMagnifier,
}) {
  if (!visible || panelOpen) return null

  const activeCount = [
    settings.voiceEnabled,
    settings.dyslexiaFont,
    settings.magnifierActive,
    settings.zoomLevel !== 100,
  ].filter(Boolean).length

  return (
    <div style={{
      position:      'fixed',
      right:         0,
      top:           '50%',
      transform:     'translateY(-50%)',
      zIndex:        8999,
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'flex-end',
      gap:           5,
      animation:     'toolbarSlideIn .35s cubic-bezier(.16,1,.3,1)',
    }}>

      {/* Quick: zoom out */}
      <QuickBtn title="Zoom out"    onClick={zoomOut}         disabled={settings.zoomLevel <= 75}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </QuickBtn>

      {/* Quick: zoom in */}
      <QuickBtn title="Zoom in"     onClick={zoomIn}          disabled={settings.zoomLevel >= 150}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </QuickBtn>

      {/* Quick: voice */}
      <QuickBtn title={settings.voiceEnabled ? 'Voice on — click off' : 'Voice off — click on'}
        onClick={toggleVoice} active={settings.voiceEnabled}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
        </svg>
      </QuickBtn>

      {/* Main panel button — eye icon */}
      <button onClick={onOpenPanel} title="Open accessibility panel" style={{
        width:          52,
        height:         52,
        borderRadius:   '14px 0 0 14px',
        background:     '#111',
        border:         '1.5px solid #333',
        borderRight:    'none',
        cursor:         'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        boxShadow:      '-3px 3px 16px rgba(0,0,0,0.25)',
        position:       'relative',
        transition:     'background .15s',
        flexShrink:     0,
      }}>
        {/* Eye SVG icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M2 12C2 12 5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12z"/>
        </svg>

        {/* Active count badge */}
        {activeCount > 0 && (
          <span style={{
            position:      'absolute',
            top:           -6,
            left:          -6,
            width:         20,
            height:        20,
            borderRadius:  '50%',
            background:    '#fff',
            border:        '2px solid #111',
            fontSize:      11,
            fontWeight:    700,
            color:         '#111',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            fontFamily:    'DM Sans, system-ui, sans-serif',
          }}>
            {activeCount}
          </span>
        )}
      </button>

      <style>{`
        @keyframes toolbarSlideIn {
          from { opacity: 0; transform: translateY(-50%) translateX(24px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  )
}

function QuickBtn({ onClick, disabled = false, active = false, title, children }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      width:          44,
      height:         44,
      borderRadius:   '10px 0 0 10px',
      background:     active ? '#222' : '#fff',
      border:         `1.5px solid ${active ? '#333' : '#E2E8F0'}`,
      borderRight:    'none',
      cursor:         disabled ? 'not-allowed' : 'pointer',
      color:          disabled ? '#CBD5E1' : active ? '#fff' : '#555',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      boxShadow:      '-2px 2px 10px rgba(0,0,0,0.08)',
      transition:     'all .15s',
      flexShrink:     0,
    }}>
      {children}
    </button>
  )
}
