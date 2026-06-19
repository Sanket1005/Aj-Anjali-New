// ─────────────────────────────────────────────
// src/components/ui/Cursor.jsx
// Custom cursor: small dot + large lagging ring.
// Both blend in "difference" mode so they're
// visible on any background color.
// ─────────────────────────────────────────────

export default function Cursor({ dot, ring, isLarge }) {
  const dotStyle = {
    position: 'fixed',
    top: 0, left: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    width:  isLarge ? 0 : 8,
    height: isLarge ? 0 : 8,
    borderRadius: '50%',
    background: '#fff',
    transform: `translate(${dot.x - (isLarge ? 0 : 4)}px, ${dot.y - (isLarge ? 0 : 4)}px)`,
    mixBlendMode: 'difference',
    transition: 'width 0.2s, height 0.2s',
    willChange: 'transform',
  }

  const ringStyle = {
    position: 'fixed',
    top: 0, left: 0,
    pointerEvents: 'none',
    zIndex: 9998,
    width:  isLarge ? 80 : 40,
    height: isLarge ? 80 : 40,
    borderRadius: '50%',
    border: `1.5px solid rgba(255,255,255,${isLarge ? 0.3 : 0.55})`,
    transform: `translate(${ring.x - (isLarge ? 40 : 20)}px, ${ring.y - (isLarge ? 40 : 20)}px)`,
    mixBlendMode: 'difference',
    transition: 'width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s',
    willChange: 'transform',
  }

  return (
    <>
      <div style={dotStyle}  aria-hidden="true" />
      <div style={ringStyle} aria-hidden="true" />
    </>
  )
}
