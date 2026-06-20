import React, { useEffect, useRef, useState } from 'react'
import '../../styles/brands.css'
import { getBrands } from '../../services/pageService'

const STATS = [
  { value: '40+', label: 'BRANDS WORKED WITH' },
  { value: '200+', label: 'LIVE EVENTS' },
  { value: '8+', label: 'YEARS EXPERIENCE' },
]

function LogoPill({ brand, onHover }) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <div
      className="brands__logocard"
      style={{
        width: 200,
        height: 120,
        flexShrink: 0,
        background: '#fff',
        borderRadius: 18,
        border: '1px solid rgba(42,26,13,.06)',
        boxShadow: '0 4px 18px rgba(42,26,13,.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 26,
        boxSizing: 'border-box',
      }}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <img
        src={brand.logo}
        alt="Brand Logo"
        className="brands__logo-icon"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function BrandRow({ brands, onHover, direction = 'fwd' }) {
  if (!brands || brands.length === 0) return null

  const repeatedBrands = [...brands, ...brands]

  return (
    <div className="brands__scrollwindow">
      <div className={`brands__track brands__track--${direction}`}>
        {repeatedBrands.map((brand, index) => (
          <LogoPill
            key={`${brand.id || index}-${index}`}
            brand={brand}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  )
}

export default function Brands({ onHover }) {
  const headerRef = useRef(null)
  const counterRef = useRef(null)
  const ctaRef = useRef(null)

  const [brands, setBrands] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadBrands() {
      try {
        const data = await getBrands()

        if (!cancelled) {
          setBrands(Array.isArray(data) ? data : [])
          setLoaded(true)
        }
      } catch (error) {
        console.error('Brands fetch error:', error)

        if (!cancelled) {
          setLoaded(true)
        }
      }
    }

    loadBrands()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const elements = [
      headerRef.current,
      counterRef.current,
      ctaRef.current,
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      {
        threshold: 0.2,
      }
    )

    elements.forEach((element) => {
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="brands" id="brands">
      <div className="brands__header" ref={headerRef}>
        <div className="brands__pill">COLLABORATIONS</div>

        <h2 className="brands__title">Trusted By Great Brands</h2>

        <p className="brands__sub">
          From national radio networks to digital-first brands — they've all
          worked with Anjali.
        </p>
      </div>

      <div className="brands__counter-row" ref={counterRef}>
        {STATS.map((stat) => (
          <div className="brands__counter-item" key={stat.label}>
            <div className="brands__counter-val">{stat.value}</div>

            <div className="brands__counter-lbl">{stat.label}</div>
          </div>
        ))}
      </div>

      {loaded && brands.length > 0 && (
        <div className="brands__tracks">
          <BrandRow brands={brands} onHover={onHover} direction="fwd" />
          {brands.length >= 4 && (
            <BrandRow
              brands={[...brands].reverse()}
              onHover={onHover}
              direction="rev"
            />
          )}
        </div>
      )}

      <div className="brands__cta" ref={ctaRef}>
        <p className="brands__cta-text">Your brand could be here too.</p>

        <a
          href="#contact"
          className="brands__cta-btn"
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
        >
          WORK WITH ME
        </a>
      </div>
    </section>
  )
}
