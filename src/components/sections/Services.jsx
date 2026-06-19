// ─────────────────────────────────────────────
// src/components/sections/Services.jsx
//
// Fetches Services from WordPress Custom Post Type
// (service) via getServices(). Falls back to the
// original hardcoded list if WordPress has no
// services yet, or the request fails.
//
// Animations:
//   • Header fades + rises on scroll
//   • Cards stagger in (80ms apart) on scroll
//   • Hover: card lifts + darkens + shine sweep
//   • Arrow rotates 45° on hover
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import '../../styles/services.css'
import { getServices } from '../../services/pageService'

const FALLBACK_SERVICES = [
  {
    id: 1,
    title: 'Event Hosting',
    desc: 'Corporate launches, cultural events, award nights, college fests — Anjali brings the energy and keeps audiences engaged from start to finish.',
    icon: '',
  },
  {
    id: 2,
    title: 'Brand Promotions',
    desc: 'Authentic brand storytelling via Instagram, reels, and radio — reaching a highly engaged, loyal audience across Bihar and beyond.',
    icon: '',
  },
  {
    id: 3,
    title: 'Digital Campaigns',
    desc: 'Strategy-first social media campaigns with creative direction, influencer outreach, and measurable engagement results.',
    icon: '',
  },
  {
    id: 4,
    title: 'Radio Collaborations',
    desc: 'On-air brand integration, sponsored segments, and co-branded radio programs reaching thousands of daily listeners.',
    icon: '',
  },
]

// ── CARD ─────────────────────────────────────
function ServiceCard({ service, index, onHover }) {
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => ref.current?.classList.add('in-view'), index * 100)
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      className="services__card"
      ref={ref}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <div className="services__icon">
        {service.icon
          ? <img src={service.icon} alt={service.title} style={{ width: 32, height: 32 }} />
          : null}
      </div>

      <h3 className="services__card-title">{service.title}</h3>
      <p  className="services__card-desc">{service.desc}</p>

      <div className="services__arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 12L12 2M12 2H4M12 2V10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────
export default function Services({ onHover }) {
  const headerRef = useRef(null)
  const [services, setServices] = useState(FALLBACK_SERVICES)

  useEffect(() => {
    let cancelled = false
    getServices()
      .then((data) => {
        if (!cancelled && data.length > 0) setServices(data)
      })
      .catch((err) => console.error('[Services] fetch failed:', err.message))
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { headerRef.current?.classList.add('in-view'); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="services" id="services">

      <div className="services__header" ref={headerRef}>
        <div className="services__pill">SERVICES</div>
        <h2 className="services__title">Let's Create Something Impactful</h2>
      </div>

      <div className="services__grid">
        {services.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} onHover={onHover} />
        ))}
      </div>

    </section>
  )
}
