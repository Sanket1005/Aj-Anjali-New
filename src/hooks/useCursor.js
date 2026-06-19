// ─────────────────────────────────────────────
// src/hooks/useCursor.js
// Tracks mouse position.
// - dot: snaps instantly to mouse
// - ring: lerps smoothly behind (laggy follower)
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'

export function useCursor() {
  // Dot position — snaps immediately
  const [dot, setDot] = useState({ x: -200, y: -200 })

  // Ring position — lerps behind
  const [ring, setRing] = useState({ x: -200, y: -200 })

  // Is cursor hovering something interactive?
  const [isLarge, setIsLarge] = useState(false)

  const ringRef  = useRef({ x: -200, y: -200 })
  const targetRef = useRef({ x: -200, y: -200 })
  const rafRef   = useRef(null)

  useEffect(() => {
    // Track mouse
    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      setDot({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', onMove)

    // Lerp ring toward target each frame
    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      ringRef.current.x = lerp(ringRef.current.x, targetRef.current.x, 0.12)
      ringRef.current.y = lerp(ringRef.current.y, targetRef.current.y, 0.12)
      setRing({ x: ringRef.current.x, y: ringRef.current.y })
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { dot, ring, isLarge, setIsLarge }
}
