// ─────────────────────────────────────────────
// src/components/sections/Brands.jsx
//
// Features:
//   • Dual-row infinite marquee (row 1 left, row 2 right)
//   • Faded edge masks (pure CSS)
//   • Each pill: logo icon + brand name
//   • Hover: pill lifts + glows + name turns coral
//   • Marquee pauses on hover
//   • Counter row (brands / events / years)
//   • Scroll-triggered header + counter reveal
//   • Bottom CTA "Work With Me" button
//
// HOW TO USE REAL LOGOS:
//   Replace the colored letter icon with:
//   <img src="/brands/radio-mirchi.png" alt="Radio Mirchi"
//        style={{width:36,height:36,objectFit:'contain'}} />
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import '../../styles/brands.css'
import { getBrands } from '../../services/pageService'

// ── FALLBACK — shown if WordPress has no brands yet ──
const FALLBACK_BRANDS = [
  { id: 1, name: 'Radio Mirchi', initials: 'RM', color: '#e8622a', logo: '' },
  { id: 2, name: 'Red FM',       initials: 'RF', color: '#cc1a1a', logo: '' },
  { id: 3, name: 'Big FM',       initials: 'BF', color: '#1a6acc', logo: '' },
  { id: 4, name: 'Fever 104',    initials: 'F',  color: '#cc7a1a', logo: '' },
]

const STATS = [
  { value: '40+',  label: 'BRANDS WORKED WITH' },
  { value: '200+', label: 'LIVE EVENTS'         },
  { value: '8+',   label: 'YEARS EXPERIENCE'    },
]

// ── LOGO PILL ────────────────────────────────
function LogoPill({ brand, onHover }) {
  return (
    <div
      className="brands__logo-pill"
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          style={{ width: 36, height: 36, objectFit: 'contain' }}
        />
      ) : (
        <div
          className="brands__logo-icon"
          style={{ background: brand.color }}
          aria-hidden="true"
        >
          {brand.initials}
        </div>
      )}
      <span className="brands__logo-name">{brand.name}</span>
    </div>
  )
}

// ── ROW ──────────────────────────────────────
function BrandRow({ brands, direction, onHover }) {
  // Double items for seamless loop
  const doubled = [...brands, ...brands]
  return (
    <div className="brands__track-overflow" style={{ overflow: 'hidden' }}>
      <div className={`brands__track brands__track--${direction}`}>
        {doubled.map((brand, i) => (
          <LogoPill key={`${brand.id}-${i}`} brand={brand} onHover={onHover} />
        ))}
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────
export default function Brands({ onHover }) {
  const headerRef  = useRef(null)
  const counterRef = useRef(null)
  const ctaRef     = useRef(null)
  const [brands, setBrands] = useState(FALLBACK_BRANDS)

  useEffect(() => {
    let cancelled = false
    getBrands()
      .then((data) => {
        if (!cancelled && data.length > 0) setBrands(data)
      })
      .catch((err) => console.error('[Brands] fetch failed:', err.message))
    return () => { cancelled = true }
  }, [])

  const mid = Math.ceil(brands.length / 2)
  const row1 = brands.slice(0, mid)
  const row2 = brands.slice(mid)

  useEffect(() => {
    const targets = [
      { ref: headerRef,  threshold: 0.3 },
      { ref: counterRef, threshold: 0.2 },
      { ref: ctaRef,     threshold: 0.2 },
    ]

    const observers = targets.map(({ ref, threshold }) => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { ref.current?.classList.add('in-view'); obs.disconnect() } },
        { threshold }
      )
      if (ref.current) obs.observe(ref.current)
      return obs
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <section className="brands" id="brands">

      {/* Header */}
      <div className="brands__header" ref={headerRef}>
        <div className="brands__pill">COLLABORATIONS</div>
        <h2 className="brands__title">Trusted By Great Brands</h2>
        <p className="brands__sub">
          From national radio networks to digital-first brands — they've all worked with Anjali.
        </p>
      </div>

      {/* Stats */}
      <div className="brands__counter-row" ref={counterRef}>
        {STATS.map((s, i) => (
          <div key={s.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
              <div>
                <div className="brands__counter-val">{s.value}</div>
                <div className="brands__counter-lbl">{s.label}</div>
              </div>
              {i < STATS.length - 1 && <div className="brands__counter-sep" />}
            </div>
          </div>
        ))}
      </div>

      {/* Dual marquee rows */}
      <div className="brands__tracks">
        <BrandRow brands={row1} direction="fwd" onHover={onHover} />
        <BrandRow brands={row2} direction="rev" onHover={onHover} />
      </div>

      {/* CTA */}
      <div className="brands__cta" ref={ctaRef}>
        <p className="brands__cta-text">Your brand could be here too.</p>
        <a
          href="#contact"
          className="brands__cta-btn"
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H4M12 2V10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          WORK WITH ME
        </a>
      </div>

    </section>
  )
}
