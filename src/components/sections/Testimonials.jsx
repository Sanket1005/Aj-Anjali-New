// ─────────────────────────────────────────────
// src/components/sections/Testimonials.jsx
//
// Fetches testimonials from WordPress Custom Post Type
// (testimonial) via getTestimonials(). Falls back to the
// original hardcoded list if WordPress has none yet.
//
// Stylish 3D carousel:
//   • Center card: large, sharp, glowing
//   • Side cards: shrunk, blurred, rotateY perspective
//   • Auto-rotates every 4s, pauses on hover
//   • Arrow + dot navigation
//   • Keyboard accessible (← →)
// ─────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'
import '../../styles/testimonials.css'
import { getTestimonials } from '../../services/pageService'

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    stars: 5,
    body: '"Anjali hosted our annual awards ceremony and absolutely stole the show. Her energy was infectious — she kept 800 guests engaged for 4 hours straight. We\'re booking her again."',
    name: 'Rahul Kumar',
    role: 'CEO, MediaHouse Patna',
    initials: 'R',
  },
  {
    id: 2,
    stars: 5,
    body: '"Working with Anjali on our product launch campaign was effortless. She understood our brand voice instantly and created content that drove real conversions. 40% CTR on her stories!"',
    name: 'Priya Sharma',
    role: 'Marketing Head, StyleBazaar',
    initials: 'P',
  },
  {
    id: 3,
    stars: 5,
    body: '"Her radio segment interview style is unlike anything else in Bihar. She asks the questions no one else dares to ask. Genuine, bold, and deeply connected with the audience."',
    name: 'Anand Mishra',
    role: 'Station Director, Radio City',
    initials: 'A',
  },
]

// Returns CSS class based on position relative to active index
function getClass(cardIndex, activeIndex, total) {
  let diff = cardIndex - activeIndex

  if (diff >  Math.floor(total / 2)) diff -= total
  if (diff < -Math.floor(total / 2)) diff += total

  if (diff === 0)  return 'testi__card--active'
  if (diff === 1)  return 'testi__card--right'
  if (diff === -1) return 'testi__card--left'
  if (diff === 2)  return 'testi__card--far-right'
  if (diff === -2) return 'testi__card--far-left'
  return 'testi__card--hidden'
}

// ── CARD ─────────────────────────────────────
function TestiCard({ t, posClass, onHover }) {
  return (
    <div
      className={`testi__card ${posClass}`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      aria-hidden={posClass !== 'testi__card--active'}
    >
      <div className="testi__quote-deco" aria-hidden="true">"</div>

      <div className="testi__stars" aria-label={`${t.stars} stars`}>
        {Array.from({ length: t.stars }).map((_, i) => (
          <span key={i} className="testi__star">★</span>
        ))}
      </div>

      <p className="testi__body">{t.body}</p>

      <div className="testi__author">
        <div className="testi__avatar" aria-hidden="true">{t.initials}</div>
        <div>
          <p className="testi__author-name">{t.name}</p>
          <p className="testi__author-role">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────
export default function Testimonials({ onHover }) {
  const [items,   setItems]   = useState(FALLBACK_TESTIMONIALS)
  const [active,  setActive]  = useState(0)
  const [visible, setVisible] = useState(false)
  const headerRef  = useRef(null)
  const autoRef    = useRef(null)
  const hoveredRef = useRef(false)

  const N = items.length

  useEffect(() => {
    let cancelled = false
    getTestimonials()
      .then((data) => {
        if (!cancelled && data.length > 0) setItems(data)
      })
      .catch((err) => console.error('[Testimonials] fetch failed:', err.message))
    return () => { cancelled = true }
  }, [])

  const next = useCallback(() => setActive(a => (a + 1) % N), [N])
  const prev = useCallback(() => setActive(a => (a - 1 + N) % N), [N])

  // ── Header reveal ──
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          headerRef.current?.classList.add('in-view')
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  // ── Auto-play ──
  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (!hoveredRef.current) next()
    }, 4000)
    return () => clearInterval(autoRef.current)
  }, [next])

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // ── Touch swipe ──
  const touchStart = useRef(0)
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    const dx = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 50) dx > 0 ? next() : prev()
  }

  return (
    <section
      className="testi"
      id="testimonials"
      onMouseEnter={() => { hoveredRef.current = true }}
      onMouseLeave={() => { hoveredRef.current = false }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="testi__header" ref={headerRef}>
        <div className="testi__pill">TESTIMONIALS</div>
        <h2 className="testi__title">What They Say</h2>
      </div>

      <div className="testi__stage" role="region" aria-label="Testimonials carousel">
        {visible && items.map((t, i) => (
          <TestiCard
            key={t.id}
            t={t}
            posClass={getClass(i, active, N)}
            onHover={onHover}
          />
        ))}
      </div>

      <div className="testi__controls">
        <button
          className="testi__arrow"
          onClick={prev}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
          aria-label="Previous testimonial"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="testi__dots" role="tablist" aria-label="Testimonial navigation">
          {items.map((_, i) => (
            <button
              key={i}
              className={`testi__dot ${i === active ? 'testi__dot--active' : ''}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => onHover?.(true)}
              onMouseLeave={() => onHover?.(false)}
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="testi__arrow"
          onClick={next}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
          aria-label="Next testimonial"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
