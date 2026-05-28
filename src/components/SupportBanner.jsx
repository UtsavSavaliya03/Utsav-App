import React from 'react'

// ── Support type definitions ──────────────────────────────────────────────────
const SUPPORT_CFG = {
  S: {
    label:      'Simplification Mode',
    description:'Fields have been simplified and extra guidance added to reduce complexity.',
    icon:       '◈',
    bg:         '#EFF6FF', border: '#93C5FD', text: '#1D4ED8',
    badgeBg:    '#DBEAFE', badgeText: '#1E40AF',
  },
  N: {
    label:      'Navigation Guidance',
    description:'Quick-links are now visible so you can jump to any section freely.',
    icon:       '◎',
    bg:         '#F5F3FF', border: '#A78BFA', text: '#5B21B6',
    badgeBg:    '#EDE9FE', badgeText: '#4C1D95',
  },
  H: {
    label:      'Contextual Hints',
    description:'Hover over or click any field label to see detailed guidance.',
    icon:       '◉',
    bg:         '#FFFBEB', border: '#FCD34D', text: '#92400E',
    badgeBg:    '#FEF3C7', badgeText: '#78350F',
  },
  G: {
    label:      'Guided Walkthrough',
    description:'Fields are highlighted one by one. Use "Next field →" to move through the form step by step.',
    icon:       '◐',
    bg:         '#ECFDF5', border: '#6EE7B7', text: '#065F46',
    badgeBg:    '#D1FAE5', badgeText: '#064E3B',
  },
}

export function getSupportConfig(type) {
  return SUPPORT_CFG[type] || null
}

// ── Support banner ────────────────────────────────────────────────────────────
export function SupportBanner({ type, onDismiss }) {
  const cfg = SUPPORT_CFG[type]
  if (!cfg) return null

  return (
    <div style={{
      background: cfg.bg, border: `1.5px solid ${cfg.border}`,
      borderRadius: 14, padding: '12px 16px', marginBottom: 20,
      animation: 'slideDown .35s cubic-bezier(.16,1,.3,1)',
    }} className='flex items-center gap-4'>
      {/* Icon bubble */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${cfg.border}55`, fontSize: 16, color: cfg.text,
      }}>
        {cfg.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: cfg.text }}>{cfg.label} Active</span>
        </div>
        <p style={{ fontSize: 14, color: cfg.text, opacity: .8, lineHeight: 1.5, margin: 0 }}>
          {cfg.description}
        </p>
      </div>

      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: cfg.text, opacity: .45, fontSize: 14, padding: 0, flexShrink: 0, marginTop: 2,
      }}>✕</button>
    </div>
  )
}

// ── Navigation quick-links (Mode N) ──────────────────────────────────────────
export function NavigationQuickLinks({ currentStep, stepLabels, onNavigate }) {
  return (
    <div style={{
      background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 12,
      padding: '10px 14px', marginBottom: 18,
      animation: 'slideDown .3s ease',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#5B21B6', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        ◎ Quick navigation — jump to any section
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {stepLabels.map((label, i) => (
          <button key={i} onClick={() => onNavigate(i)} style={{
            padding: '5px 13px', borderRadius: 99, fontSize: 11, fontWeight: 500, cursor: 'pointer',
            background: currentStep === i ? '#7C3AED' : '#EDE9FE',
            color:      currentStep === i ? '#fff'     : '#5B21B6',
            border: `1.5px solid ${currentStep === i ? '#7C3AED' : '#C4B5FD'}`,
            transition: 'all .15s', fontFamily: 'inherit',
          }}>
            {i + 1}. {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Guided walkthrough banner (Mode G) ───────────────────────────────────────
export function GuidedWalkthroughBanner({ instruction, stepIndex }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      background: '#FFFBEB', borderLeft: '4px solid #F59E0B',
      borderRadius: '0 12px 12px 0', padding: '10px 14px', marginBottom: 18,
      animation: 'slideDown .3s ease',
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>▶</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>
          Guided mode — complete highlighted field
        </div>
        <p style={{ fontSize: 12, color: '#B45309', lineHeight: 1.55, margin: 0 }}>
          {instruction}
        </p>
      </div>
    </div>
  )
}
