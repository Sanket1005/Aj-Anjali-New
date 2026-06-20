// ─────────────────────────────────────────────
// src/components/sections/Brands.jsx
//
// Features:
//   • Dual-row infinite marquee (row 1 left, row 2 right)
//   • Faded edge masks (pure CSS)
//   • Each pill: just the logo image, no text
//   • Hover: pill lifts + glows
//   • Marquee pauses on hover
//   • Counter row (brands / events / years)
//   • Scroll-triggered header + counter reveal
//   • Bottom CTA "Work With Me" button
//
// LOGOS COME FROM WORDPRESS:
//   getBrands() fetches the "brand" custom post type —
//   only the ACF "logo" image field is used. The BRANDS
//   array below is just a fallback shown if WordPress
//   has no brands yet (or the request fails).
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import '../../styles/brands.css'
import { getBrands } from '../../services/pageService'

// ── FALLBACK — shown only if WordPress has no brands yet ──
const BRANDS = [
  { id: 1,  logo: '/brands/radio-mirchi.png' },
  { id: 2,  logo: '/brands/red-fm.png' },
  { id: 3,  logo: '/brands/big-fm.png' },
  { id: 4,  logo: '/brands/fever-104.png' },
  { id: 5,  logo: '/brands/myntra.png' },
  { id: 6,  logo: '/brands/nykaa.png' },
  { id: 7,  logo: '/brands/stylebazaar.png' },
  { id: 8,  logo: '/brands/flipkart.png' },
  { id: 9,  logo: '/brands/patna-live.png' },
  { id: 10, logo: '/brands/bihar-now.png' },
  { id: 11, logo: '/brands/etv-bihar.png' },
  { id: 12, logo: '/brands/zee-bihar.png' },
  { id: 13, logo: '/brands/sony-liv.png' },
  { id: 14, logo: '/brands/amazon-india.png' },
  { id: 15, logo: '/brands/boat-lifestyle.png' },
  { id: 16, logo: '/brands/mamaearth.png' },
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
      <img
        src={brand.logo}
        alt=""
        className="brands__logo-icon"
      />
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
  const [brands, setBrands] = useState(BRANDS) // start with fallback list

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
