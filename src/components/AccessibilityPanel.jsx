import React, { useState } from 'react'

export function AccessibilityPanel({
  open, onClose, settings,
  zoomIn, zoomOut, resetZoom,
  toggleVoice, toggleDyslexia,
  toggleMagnifier, resetAll,
}) {
  const [activeTab, setActiveTab] = useState('tools')
  if (!open) return null

  const { zoomLevel, voiceEnabled, dyslexiaFont, magnifierActive } = settings
  const ZOOM_STEPS = [75, 85, 100, 115, 125]

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)',
      }} />

      {/* Panel — wider + taller */}
      <div style={{
        position:     'fixed',
        top:          '50%',
        right:        0,
        transform:    'translateY(-50%)',
        zIndex:       9001,
        width:        420,
        background:   '#fff',
        borderRadius: '20px 0 0 20px',
        boxShadow:    '-6px 0 40px rgba(0,0,0,0.18)',
        border:       '1.5px solid #E2E8F0',
        borderRight:  'none',
        overflow:     'hidden',
        animation:    'slideInRight .3s cubic-bezier(.16,1,.3,1)',
        fontFamily:   'DM Sans, system-ui, sans-serif',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding:        '18px 20px 14px',
          borderBottom:   '1px solid #F1F5F9',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          background:     '#FAFAFA',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* New icon: eye/vision SVG instead of wheelchair */}
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: '#111', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M2 12C2 12 5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Accessibility</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>Global support tools</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: '#F1F5F9', border: 'none', cursor: 'pointer',
            color: '#64748B', fontSize: 16, width: 32, height: 32,
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
          {[['tools','🛠  Tools'], ['info','ℹ  About']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              flex: 1, padding: '11px 0', border: 'none', cursor: 'pointer',
              background: 'none', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600,
              color: activeTab === key ? '#111' : '#94A3B8',
              borderBottom: `2.5px solid ${activeTab === key ? '#111' : 'transparent'}`,
              transition: 'all .15s',
            }}>{label}</button>
          ))}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '16px 18px', maxHeight: 520, overflowY: 'auto' }}>

          {activeTab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* 1. ZOOM */}
              <ToolCard icon={<ZoomIcon />} title="Zoom" desc="Scale the entire interface up or down">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <RoundBtn onClick={zoomOut} disabled={zoomLevel <= ZOOM_STEPS[0]} title="Zoom out">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </RoundBtn>
                  <div style={{
                    flex: 1, textAlign: 'center',
                    fontSize: 18, fontWeight: 700, color: '#111',
                    background: '#F8FAFC', borderRadius: 10, padding: '6px 0',
                    border: '1.5px solid #E2E8F0',
                  }}>
                    {zoomLevel}%
                  </div>
                  <RoundBtn onClick={zoomIn} disabled={zoomLevel >= ZOOM_STEPS[ZOOM_STEPS.length-1]} title="Zoom in">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </RoundBtn>
                  <button onClick={resetZoom} style={{
                    padding: '7px 14px', borderRadius: 9, border: '1.5px solid #E2E8F0',
                    background: zoomLevel !== 100 ? '#111' : '#F8FAFC',
                    color: zoomLevel !== 100 ? '#fff' : '#64748B',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all .15s',
                  }}>Reset</button>
                </div>

                {/* Step indicators */}
                <div style={{ display: 'flex', gap: 4, marginTop: 10, alignItems: 'center' }}>
                  {ZOOM_STEPS.map(step => (
                    <div key={step} style={{
                      flex: 1, height: 6, borderRadius: 99,
                      background: step === zoomLevel ? '#111' : step < zoomLevel ? '#CBD5E1' : '#F1F5F9',
                      transition: 'background .2s',
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: '#CBD5E1' }}>75%</span>
                  <span style={{ fontSize: 10, color: '#CBD5E1' }}>125%</span>
                </div>
              </ToolCard>

              {/* 2. VOICE */}
              <ToolCard
                icon={<VoiceIcon active={voiceEnabled} />}
                title="Voice Assistance"
                desc="Reads any hovered element aloud"
                active={voiceEnabled}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: voiceEnabled ? '#111' : '#94A3B8' }}>
                      {voiceEnabled ? 'Listening for hover…' : 'Currently off'}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      Hover anything to hear it spoken
                    </div>
                  </div>
                  <Toggle active={voiceEnabled} onToggle={toggleVoice} />
                </div>
                {voiceEnabled && (
                  <div style={{
                    marginTop: 10, padding: '8px 12px', borderRadius: 10,
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    fontSize: 12, color: '#64748B', lineHeight: 1.5,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ fontSize: 16 }}>🎙</span>
                    Move your mouse over any field, button, or label.
                  </div>
                )}
              </ToolCard>

              {/* 3. DYSLEXIA FONT */}
              <ToolCard
                icon={<FontIcon active={dyslexiaFont} />}
                title="Dyslexia-Friendly Font"
                desc="Switches to Lexend for easier reading"
                active={dyslexiaFont}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: dyslexiaFont ? '#111' : '#94A3B8' }}>
                      {dyslexiaFont ? 'Lexend font active' : 'Default font'}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      Wider spacing, reduced visual stress
                    </div>
                  </div>
                  <Toggle active={dyslexiaFont} onToggle={toggleDyslexia} />
                </div>
                <div style={{
                  marginTop: 10, padding: '10px 14px', borderRadius: 10,
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  fontSize: 13, color: '#334155', lineHeight: 1.8,
                  fontFamily: dyslexiaFont ? 'Lexend, sans-serif' : 'inherit',
                  letterSpacing: dyslexiaFont ? '0.04em' : 'normal',
                  transition: 'font-family .3s',
                }}>
                  The quick brown fox jumps over the lazy dog.
                </div>
              </ToolCard>
            </div>
          )}

          {activeTab === 'info' && (
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 12, fontWeight: 700, color: '#111', fontSize: 14 }}>
                About these tools
              </p>
              <p style={{ marginBottom: 10 }}>
                These tools are part of the <strong>global cognitive offloading support layer</strong>. They appear when the AI detects elevated user difficulty and remain available for the full session.
              </p>
              {[
                ['🔍 Zoom', 'Scales the whole interface using CSS zoom. Steps: 75%, 85%, 100%, 115%, 125%'],
                ['🔊 Voice', 'Uses the browser Web Speech API. Reads labels, placeholders, buttons and any text you hover — no server calls.'],
                ['Aa Dyslexia font', 'Replaces the default font with Lexend — designed to reduce visual noise and letter-confusion for dyslexic readers.'],
              ].map(([title, body]) => (
                <div key={title} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: '3px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#111', marginBottom: 3 }}>{title}</div>
                  <div>{body}</div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '12px 18px', borderTop: '1px solid #F1F5F9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#FAFAFA',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              voiceEnabled    && { label: '🔊 Voice',     key: 'v' },
              dyslexiaFont    && { label: 'Aa Lexend',    key: 'f' },
              magnifierActive && { label: '🔎 Lens',      key: 'm' },
              zoomLevel!==100 && { label: `🔍 ${zoomLevel}%`, key: 'z' },
            ].filter(Boolean).map(({ label, key }) => (
              <span key={key} style={{
                fontSize: 11, fontWeight: 600,
                padding: '3px 9px', borderRadius: 99,
                background: '#F1F5F9', color: '#475569',
              }}>{label}</span>
            ))}
            {![voiceEnabled, dyslexiaFont, magnifierActive, zoomLevel !== 100].some(Boolean) && (
              <span style={{ fontSize: 11, color: '#CBD5E1' }}>No tools active</span>
            )}
          </div>
          <button onClick={resetAll} style={{
            padding: '7px 14px', borderRadius: 9,
            border: '1.5px solid #E2E8F0', background: 'none',
            fontSize: 12, fontWeight: 600, color: '#64748B',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Reset all</button>
        </div>

      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateY(-50%) translateX(50px); opacity: 0; }
          to   { transform: translateY(-50%) translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ToolCard({ icon, title, desc, active = false, children }) {
  return (
    <div style={{
      border:       `1.5px solid ${active ? '#222' : '#E2E8F0'}`,
      borderRadius: 14, padding: '14px 16px',
      background:   active ? '#FAFAFA' : '#fff',
      transition:   'border-color .2s, background .2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: active ? '#111' : '#F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background .2s',
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{title}</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{desc}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

function Toggle({ active, onToggle }) {
  return (
    <button onClick={onToggle} role="switch" aria-checked={active} style={{
      width: 50, height: 28, borderRadius: 14,
      background: active ? '#111' : '#E2E8F0',
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background .25s', flexShrink: 0, padding: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3,
        left: active ? 24 : 3,
        width: 22, height: 22, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        transition: 'left .25s',
        display: 'block',
      }} />
    </button>
  )
}

function RoundBtn({ onClick, disabled, title, children }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      width: 38, height: 38, borderRadius: 10,
      border: '1.5px solid #E2E8F0',
      background: disabled ? '#F8FAFC' : '#fff',
      color: disabled ? '#CBD5E1' : '#333',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'all .15s',
    }}>{children}</button>
  )
}

// ─── SVG icons (no emoji, clean rendering) ───────────────────────────────────
const ic = { stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

function ZoomIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...ic} style={{ color: '#64748B' }}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  )
}
function VoiceIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...ic} style={{ color: active ? '#fff' : '#64748B' }}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )
}
function FontIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...ic} style={{ color: active ? '#fff' : '#64748B' }}>
      <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  )
}
function MagIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...ic} style={{ color: active ? '#fff' : '#64748B' }}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  )
}
