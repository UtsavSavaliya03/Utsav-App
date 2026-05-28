import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'

/**
 * FieldWrap — wraps any field with:
 *  - Styled label + required star
 *  - Contextual tooltip (Mode H)
 *  - Inline hint text (Mode S)
 *  - Error message
 *  - Guided walkthrough highlight ring (Mode G)
 *  - Simplification background tint (Mode S)
 */
export function FieldWrap({
  label, required, tooltip, hint, error,
  supportMode, isGuidedActive = false,
  children, className = '',
}) {
  const isSimplify = supportMode === 'S'
  const showHint   = (isSimplify && (hint || tooltip)) || hint

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        marginBottom: 18,
        borderRadius: isGuidedActive ? 12 : 0,
        // Guided highlight ring
        ...(isGuidedActive ? {
          outline: '2px solid #FBBF24',
          outlineOffset: 4,
          animation: 'guidedPulse 2s ease-in-out infinite',
          padding: '10px 10px 2px',
          background: '#FFFBEB',
          borderRadius: 12,
        } : {}),
        // Simplification tint
        ...(isSimplify && !isGuidedActive ? {
          background: '#F0F9FF',
          borderRadius: 10,
          padding: '10px 10px 4px',
        } : {}),
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <label style={{
          fontSize: 13, fontWeight: 700, color: '#64748B',
          textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'default',
        }}>
          {label}
          {required && <span style={{ color: '#F87171', marginLeft: 2 }}>*</span>}
        </label>
        {/* Contextual hint icon (Mode H) */}
        {supportMode === 'H' && tooltip && (
          // <span title={tooltip} style={{ fontSize: 12, color: '#FBBF24', cursor: 'help' }}>ⓘ</span>
          <Tooltip title={tooltip} >
            <InfoCircleOutlined className="text-amber-400 text-xs cursor-help" />
          </Tooltip>
        )}
      </div>

      {/* Field */}
      {children}

      {/* Hint text */}
      {showHint && (
        <p style={{ fontSize: 14, color: '#5e7ca5', marginTop: 5, lineHeight: 1.5, marginBottom: 0 }}>
          {hint || tooltip}
        </p>
      )}

      {/* Validation error */}
      {error && (
        <p style={{ fontSize: 11, color: '#EF4444', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 0 }}>
          <span>⚠</span> {error}
        </p>
      )}

      {/* Inline CSS for guided pulse */}
      <style>{`
        @keyframes guidedPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,.45); }
          50%       { box-shadow: 0 0 0 8px rgba(251,191,36,0); }
        }
      `}</style>
    </div>
  )
}
