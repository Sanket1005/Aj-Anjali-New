// ─────────────────────────────────────────────
// src/hooks/useScrolled.js
// Returns true once the user scrolls past
// the threshold (default: 30px).
// Used by Navbar to switch to slim mode.
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'

export function useScrolled(threshold = 30) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])

  return scrolled
}
