// ─────────────────────────────────────────────
// src/components/ui/PageCover.jsx
// Full-screen dark overlay that slides away
// on first load, revealing the site beneath.
// ─────────────────────────────────────────────

export default function PageCover({ visible }) {
  const style = {
    position: 'fixed',
    inset: 0,
    zIndex: 500,
    background: '#1a0a06',
    transformOrigin: 'bottom',
    transform: visible ? 'scaleY(0)' : 'scaleY(1)',
    transition: visible ? 'transform 1.2s cubic-bezier(0.77, 0, 0.18, 1)' : 'none',
    pointerEvents: visible ? 'none' : 'all',
  }

  return <div style={style} aria-hidden="true" />
}
