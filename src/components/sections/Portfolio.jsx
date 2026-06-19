// ─────────────────────────────────────────────
// src/components/sections/Portfolio.jsx
//
// Features:
//   ✅ Instagram Reel embeds (via blockquote + script)
//   ✅ Auto-play carousel (pauses on hover/drag)
//   ✅ Smooth momentum drag (mouse + touch)
//   ✅ Arrow navigation + progress bar
//   ✅ Scroll-triggered stagger animations
//
// HOW TO ADD YOUR REELS:
//   1. Go to your Instagram Reel
//   2. Click ··· → Embed → Copy link
//   3. The URL looks like: https://www.instagram.com/reel/ABC123/
//   4. Paste just the shortcode (e.g. "ABC123") into reelId below
//
// ─────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'
import '../../styles/portfolio.css'
import { getPortfolioItems } from '../../services/pageService'

// ── FALLBACK — shown if WordPress has no portfolio items yet ──
const FALLBACK_ITEMS = [
  { id: 1, type: 'reel', reelId: 'DWNucrRE8B5', title: '', category: '' },
  { id: 2, type: 'reel', reelId: 'DKKpfE_Om5E', title: '', category: '' },
  { id: 3, type: 'reel', reelId: 'DYMlv75TFHX', title: '', category: '' },
  { id: 4, type: 'reel', reelId: 'DXmj3RmiDBG', title: '', category: '' },
  { id: 5, type: 'reel', reelId: 'DXE0B7Ik9Wg', title: '', category: '' },
]

const CARD_W = 340   // px — card width
const CARD_GAP = 24    // px — gap between cards
const STEP = CARD_W + CARD_GAP
const AUTO_MS = 3000  // autoplay interval ms

// ── INSTAGRAM EMBED CARD ─────────────────────
function ReelCard({ item, index, onHover }) {
  const cardRef = useRef(null)
  const embedRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [show, setShow] = useState(false)

  // Scroll-triggered entrance
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setShow(true), index * 80)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (cardRef.current) obs.observe(cardRef.current)
    return () => obs.disconnect()
  }, [index])

  // Load Instagram embed script once
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process()
      setReady(true)
      return
    }
    if (document.getElementById('ig-script')) {
      const wait = setInterval(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process()
          setReady(true)
          clearInterval(wait)
        }
      }, 200)
      return () => clearInterval(wait)
    }
    const script = document.createElement('script')
    script.id = 'ig-script'
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.onload = () => {
      window.instgrm?.Embeds.process()
      setReady(true)
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div
      ref={cardRef}
      className="portfolio__card"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
        transition: `opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)`,
      }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Instagram embed */}
      <div
        ref={embedRef}
        className="portfolio__reel-wrap"
        style={{ background: item.bg }}
      >
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={`https://www.instagram.com/reel/${item.reelId}/`}
          data-instgrm-version="14"
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            margin: 0,
            maxWidth: '100%',
            minWidth: '100%',
            padding: 0,
            width: '100%',
          }}
        />

        {/* Fallback shown until script processes */}
        {!ready && (
          <div className="portfolio__reel-fallback" style={{ background: item.bg }}>
            <div className="portfolio__reel-fallback-inner">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#igGrad)" />
                <defs>
                  <linearGradient id="igGrad" x1="0" y1="32" x2="32" y2="0">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="5" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="22" cy="10" r="1.5" fill="white" />
                <rect x="6" y="6" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>
              <p>Loading Reel…</p>
            </div>
          </div>
        )}
      </div>

      {/* Card info overlay */}
      <div className="portfolio__card-overlay" />
      <div className="portfolio__card-info">
        <p className="portfolio__card-tag">{item.category}</p>
        <h3 className="portfolio__card-title">{item.title}</h3>
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────
export default function Portfolio({ onHover }) {
  const headerRef = useRef(null)
  const trackRef = useRef(null)
  const autoRef = useRef(null)
  const isHovered = useRef(false)
  const isDragging = useRef(false)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, velX: 0, lastX: 0, lastT: 0 })
  const rafRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const autoPlayRef = useRef(null)
  const isHoveredRef = useRef(false)
  const [items, setItems] = useState(FALLBACK_ITEMS)

  // ── Fetch portfolio items from WordPress ──
  useEffect(() => {
    let cancelled = false
    getPortfolioItems()
      .then((data) => {
        if (!cancelled && data.length > 0) setItems(data)
      })
      .catch((err) => console.error('[Portfolio] fetch failed:', err.message))
    return () => { cancelled = true }
  }, [])

  // ── Header reveal ──
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { headerRef.current?.classList.add('in-view'); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const speed = 0.5

    const autoScroll = () => {
      if (!isHoveredRef.current) {
        el.scrollLeft += speed

        // Infinite loop reset
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        }
      }

      autoPlayRef.current = requestAnimationFrame(autoScroll)
    }

    autoPlayRef.current = requestAnimationFrame(autoScroll)

    return () => {
      cancelAnimationFrame(autoPlayRef.current)
    }
  }, [])

  // ── Progress ──
  const updateProgress = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0)
  }, [])

  // ── Smooth scroll ──
  const smoothScrollTo = useCallback((target) => {
    const el = trackRef.current
    if (!el) return
    const start = el.scrollLeft
    const distance = target - start
    const duration = 600
    let startTime = null
    const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    const step = (ts) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      el.scrollLeft = start + distance * ease(p)
      updateProgress()
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(step)
  }, [updateProgress])

  // ── Auto-play ──
  const startAuto = useCallback(() => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      if (isHovered.current || isDragging.current) return
      const el = trackRef.current
      if (!el) return
      const max = el.scrollWidth - el.clientWidth
      // loop back to start when reaching end
      const next = el.scrollLeft + STEP >= max - 10 ? 0 : el.scrollLeft + STEP
      smoothScrollTo(next)
    }, AUTO_MS)
  }, [smoothScrollTo])

  useEffect(() => {
    startAuto()
    return () => clearInterval(autoRef.current)
  }, [startAuto])

  // ── Arrow nav ──
  const scrollBy = (dir) => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    let target = el.scrollLeft + dir * STEP
    if (target < 0) target = max
    if (target > max) target = 0
    smoothScrollTo(target)
  }

  // ── Mouse drag ──
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const onDown = (e) => {
      isDragging.current = true
      drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, velX: 0, lastX: e.pageX, lastT: Date.now() }
      cancelAnimationFrame(rafRef.current)
    }
    const onMove = (e) => {
      if (!drag.current.active) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = (x - drag.current.startX) * 1.3
      const now = Date.now()
      drag.current.velX = (e.pageX - drag.current.lastX) / (now - drag.current.lastT + 1) * 16
      drag.current.lastX = e.pageX
      drag.current.lastT = now
      el.scrollLeft = drag.current.scrollLeft - walk
      updateProgress()
    }
    const onUp = () => {
      if (!drag.current.active) return
      drag.current.active = false
      isDragging.current = false
      let vel = drag.current.velX * -1
      const glide = () => {
        if (Math.abs(vel) < 0.4) return
        el.scrollLeft += vel
        vel *= 0.91
        updateProgress()
        rafRef.current = requestAnimationFrame(glide)
      }
      rafRef.current = requestAnimationFrame(glide)
    }

    el.addEventListener('mousedown', onDown)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseup', onUp)
    el.addEventListener('mouseleave', onUp)
    el.addEventListener('scroll', updateProgress, { passive: true })
    return () => {
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseup', onUp)
      el.removeEventListener('mouseleave', onUp)
      el.removeEventListener('scroll', updateProgress)
    }
  }, [updateProgress])

  // ── Touch drag ──
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let startX = 0, startScroll = 0
    const onStart = (e) => { isDragging.current = true; startX = e.touches[0].pageX; startScroll = el.scrollLeft; cancelAnimationFrame(rafRef.current) }
    const onMove = (e) => { el.scrollLeft = startScroll + (startX - e.touches[0].pageX); updateProgress() }
    const onEnd = () => { isDragging.current = false }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onEnd)
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [updateProgress])

  return (
    <section className="portfolio" id="projects">
      <div className="portfolio__grain" aria-hidden="true" />

      {/* HEADER */}
      <div className="portfolio__header" ref={headerRef}>
        <div className="portfolio__pill">PORTFOLIO</div>
        <h2 className="portfolio__title">Moments Behind The Mic</h2>
      </div>

      {/* CAROUSEL */}
      <div
        className="portfolio__carousel"
        onMouseEnter={() => {
          isHoveredRef.current = true
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false
        }}
      >
        <div
          className="portfolio__track"
          ref={trackRef}
          style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {[...items, ...items].map((item, index) => (
            <ReelCard key={index} item={item} onHover={onHover} />
          ))}
          <div style={{ flexShrink: 0, width: 32 }} />
        </div>
      </div>

      {/* PROGRESS + ARROWS */}
      <div className="portfolio__progress">
        <button className="portfolio__arrow" onClick={() => scrollBy(-1)}
          onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="portfolio__bar-wrap">
          <div className="portfolio__bar-fill" style={{ width: `${Math.max(progress, 5)}%` }} />
        </div>

        <button className="portfolio__arrow" onClick={() => scrollBy(1)}
          onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <style>{`
        .portfolio__track::-webkit-scrollbar { display: none; }

        .portfolio__subtitle {
          font-family: var(--f-body);
          font-size: .68rem;
          font-weight: 400;
          letter-spacing: .2em;
          color: rgba(255,255,255,.45);
          margin-top: 10px;
        }

        .portfolio__reel-wrap {
          width: 100%;
          aspect-ratio: 9 / 16;
          overflow: hidden;
          position: relative;
          border-radius: 20px;
        }

        .portfolio__reel-wrap .instagram-media {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          min-width: unset !important;
          border-radius: 20px !important;
        }

        .portfolio__reel-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .portfolio__reel-fallback-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,.5);
          font-family: var(--f-body);
          font-size: .7rem;
          letter-spacing: .1em;
        }
      `}</style>
    </section>
  )
}
