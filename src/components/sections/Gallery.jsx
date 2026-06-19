// ─────────────────────────────────────────────
// src/components/sections/Gallery.jsx
//
// Fetches photos from WordPress Custom Post Type
// (gallery_item) via getGalleryItems(). Falls back to
// placeholder tiles if WordPress has no photos yet.
//
// Features:
//   • 4×3 masonry-feel grid
//   • Scroll-triggered stagger (each cell 60ms apart)
//   • Hover: image scale + caption rise + zoom icon spring
//   • Click → fullscreen lightbox with blur backdrop
//   • Lightbox: prev/next arrows, keyboard ←→ Esc, counter
// ─────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'
import '../../styles/gallery.css'
import { getGalleryItems } from '../../services/pageService'

const FALLBACK_PHOTOS = [
  { id: 1, src: '', caption: 'On Air at Radio Mirchi' },
  { id: 2, src: '', caption: 'Live Event Hosting'     },
  { id: 3, src: '', caption: 'Brand Shoot 2024'       },
  { id: 4, src: '', caption: 'Award Night MC'         },
]

// ── GRID ITEM ────────────────────────────────
function GalleryItem({ photo, index, onOpen, onHover }) {
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => ref.current?.classList.add('in-view'), index * 60)
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      className="gallery__item"
      ref={ref}
      onClick={() => onOpen(index)}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(index)}
      aria-label={`View ${photo.caption}`}
    >
      {photo.src
        ? <img src={photo.src} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div className="gallery__ph">{index + 1}</div>
      }

      <div className="gallery__overlay">
        <span className="gallery__caption">{photo.caption}</span>
      </div>

      <div className="gallery__zoom" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.4"/>
          <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}

// ── LIGHTBOX ─────────────────────────────────
function Lightbox({ photos, activeIndex, onClose, onHover }) {
  const [current, setCurrent] = useState(activeIndex)
  const [open,    setOpen]    = useState(false)

  useEffect(() => {
    setCurrent(activeIndex)
    requestAnimationFrame(() => setOpen(true))
  }, [activeIndex])

  const prev = useCallback(() => setCurrent(c => (c - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % photos.length), [photos.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  const handleClose = () => {
    setOpen(false)
    setTimeout(onClose, 400)
  }

  const photo = photos[current]

  return (
    <div
      className={`gallery__lightbox ${open ? 'open' : ''}`}
      onClick={handleClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {photo.src ? (
          <img
            className="gallery__lightbox-img"
            src={photo.src}
            alt={photo.caption}
            style={{
              maxWidth: '90vw', maxHeight: '80vh', borderRadius: 16,
              transform: open ? 'scale(1)' : 'scale(.9)',
              transition: 'transform .5s cubic-bezier(.22,1,.36,1)',
              boxShadow: '0 40px 100px rgba(0,0,0,.6)',
            }}
          />
        ) : (
          <div style={{
            width: 560, height: 380,
            borderRadius: 16,
            background: 'linear-gradient(135deg,#3a1a10,#7a3a20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,.3)',
            fontFamily: 'var(--f-display)',
            fontSize: '1.2rem', letterSpacing: '.1em',
            transform: open ? 'scale(1)' : 'scale(.9)',
            transition: 'transform .5s cubic-bezier(.22,1,.36,1)',
            boxShadow: '0 40px 100px rgba(0,0,0,.6)',
          }}>
            {photo.caption}
          </div>
        )}
      </div>

      <div className="gallery__lb-arrows" onClick={e => e.stopPropagation()}>
        <button
          className="gallery__lb-arrow"
          onClick={prev}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
          aria-label="Previous"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className="gallery__lb-arrow"
          onClick={next}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
          aria-label="Next"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <button
        className="gallery__lb-close"
        onClick={handleClose}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
      >
        CLOSE
      </button>

      <div className="gallery__lb-counter">
        {current + 1} / {photos.length}
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────
export default function Gallery({ onHover }) {
  const headerRef  = useRef(null)
  const [photos, setPhotos] = useState(FALLBACK_PHOTOS)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    let cancelled = false
    getGalleryItems()
      .then((data) => {
        if (!cancelled && data.length > 0) setPhotos(data)
      })
      .catch((err) => console.error('[Gallery] fetch failed:', err.message))
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

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <section className="gallery" id="gallery">
      <div className="gallery__grain" aria-hidden="true" />

      <div className="gallery__header" ref={headerRef}>
        <div className="gallery__pill">GALLERY</div>
        <h2 className="gallery__title">Moments Behind The Mic</h2>
      </div>

      <div className="gallery__grid">
        {photos.map((photo, i) => (
          <GalleryItem
            key={photo.id}
            photo={photo}
            index={i}
            onOpen={setLightbox}
            onHover={onHover}
          />
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          activeIndex={lightbox}
          onClose={() => setLightbox(null)}
          onHover={onHover}
        />
      )}
    </section>
  )
}
