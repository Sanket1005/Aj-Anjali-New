// ─────────────────────────────────────────────
// src/components/sections/Hero.jsx
//
// Uses the `data` prop (Home page ACF fields),
// already fetched once in App.jsx — no separate
// fetch needed here anymore.
// Stats are hardcoded (no Repeater / ACF Pro needed)
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import '../../styles/hero.css'
import { resolveImage } from '../../services/pageService'

// ── Stats are hardcoded (no ACF Pro Repeater needed) ──────────────────────
const STATS = [
  { value: '19+',   label: 'YEARS ON AIR' },
  { value: '50M+', label: 'LISTENERS'    },
  { value: '200+', label: 'EPISODES'     },
]

// ── Fallback content (shown if a field is empty) ──────────────────────────
const FALLBACK = {
  pill:        'RJ · HOST · CREATOR · UNFILTERED & UNAPOLOGETIC',
  titleUpright:'Anjali Singh Voices',
  titleItalic: ['Opinions', 'Energy'],
  subtitle:    'Radio Jockey, Host & Digital Personality from Bihar — creating conversations that people actually remember.',
  imageUrl:    '',
  buttonText:  'WATCH SHOW REEL',
  buttonLink:  '#',
  ghostLabel:  'VIEW PROJECTS ↗',
  ghostLink:   '#projects',
}

// ─────────────────────────────────────────────────────────────────────────
export default function Hero({ loaded, onHover, data }) {
  const imgRef = useRef(null)
  const [imageUrl, setImageUrl] = useState(FALLBACK.imageUrl)

  const acf = data?.acf || {}

  // hero_title_italic — Textarea, one word per line
  const titleItalic = (acf.hero_title_italic || '')
    .split('\n')
    .map(w => w.trim())
    .filter(Boolean)

  // hero_image — handles both "Image URL" (string) and "Image ID" (number)
  useEffect(() => {
    let cancelled = false
    resolveImage(acf.hero_image).then((url) => {
      if (!cancelled && url) setImageUrl(url)
    })
    return () => { cancelled = true }
  }, [acf.hero_image])

  const hero = {
    pill:         acf.hero_pill          || FALLBACK.pill,
    titleUpright: acf.hero_title_upright || FALLBACK.titleUpright,
    titleItalic:  titleItalic.length     ? titleItalic : FALLBACK.titleItalic,
    subtitle:     acf.hero_subtitle      || FALLBACK.subtitle,
    imageUrl,
    buttonText:   acf.hero_button_text   || FALLBACK.buttonText,
    buttonLink:   acf.hero_button_link   || FALLBACK.buttonLink,
    ghostLabel:   acf.hero_ghost_label   || FALLBACK.ghostLabel,
    ghostLink:    acf.hero_ghost_link    || FALLBACK.ghostLink,
  }

  // ── Mouse parallax on the hero photo ────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (!imgRef.current) return
      const dx = (e.clientX / window.innerWidth  - 0.5) * 20
      const dy = (e.clientY / window.innerHeight - 0.5) * 12
      imgRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`
    }
    const onLeave = () => {
      if (imgRef.current)
        imgRef.current.style.transform = 'translate(0, 0) scale(1.06)'
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const s = loaded ? '--show' : ''

  return (
    <section className="hero" id="home">

      <div className="hero__grain"    aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      {/* ── HERO PHOTO ─────────────────────────── */}
      <div className={`hero__photo ${loaded ? 'hero__photo--visible' : ''}`}>
        <div className="hero__photo-inner" ref={imgRef}>
          {hero.imageUrl
            ? <img src={hero.imageUrl} alt="Anjali Singh" />
            : <div className="hero__photo-placeholder" aria-hidden="true" />
          }
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div className="hero__content">

        <div className={`hero__pill hero__pill${s}`}>
          <span className="hero__pill-dot" aria-hidden="true" />
          {hero.pill}
        </div>

        <h1 className={`hero__title-upright hero__title-upright${s}`}>
          {hero.titleUpright}
        </h1>

        <div className="hero__title-italic" aria-hidden="true">
          {hero.titleItalic.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className={`hero__word-slide ${loaded ? 'hero__word-slide--show' : ''}`}
              style={{ transitionDelay: loaded ? `${0.85 + i * 0.14}s` : '0s' }}
            >
              {word}
            </span>
          ))}
        </div>

        <p className={`hero__desc hero__desc${s}`}>
          {hero.subtitle}
        </p>

        <div className={`hero__cta-row hero__cta-row${s}`}>

          <a
            href={hero.buttonLink}
            className="hero__cta-primary"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          >
            <span className="hero__play-circle" aria-hidden="true">
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
                <path d="M1 1L8 5.5L1 10V1Z" fill="white" />
              </svg>
            </span>
            {hero.buttonText}
          </a>

          <a
            href={hero.ghostLink}
            className="hero__cta-ghost"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          >
            {hero.ghostLabel}
          </a>

        </div>
      </div>

      {/* ── SCROLL CUE ─────────────────────────── */}
      <div
        className={`hero__scroll-cue ${loaded ? 'hero__scroll-cue--show' : ''}`}
        aria-hidden="true"
      >
        <div className="hero__scroll-bar" />
        SCROLL
      </div>

      {/* ── STATS — hardcoded (no ACF Pro needed) ── */}
      <div className={`hero__stats ${loaded ? 'hero__stats--show' : ''}`}>
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="hero__stat-value">{value}</div>
            <div className="hero__stat-label">{label}</div>
          </div>
        ))}
      </div>

    </section>
  )
}
