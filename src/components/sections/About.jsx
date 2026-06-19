// ─────────────────────────────────────────────
// src/components/sections/About.jsx
//
// Now pulls content from WordPress ACF fields
// (about_pill, about_heading, about_body_1/2/3, about_image)
// via the `data` prop (already fetched once in App.jsx).
//
// Falls back to original hardcoded text if a field is
// empty, so the section never looks broken while you're
// still filling in WordPress.
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import '../../styles/about.css'
import { resolveImage } from '../../services/pageService'

const FALLBACK = {
  pill: 'ABOUT RJ ANJALI MIRCHI',
  heading: 'More Than Just A Voice',
  body1: 'Anjali Singh is a Bihar-based Radio Jockey, host, and digital personality known for her fearless opinions, energetic presence, and relatable storytelling.',
  body2: 'From radio studios to live events and digital screens, she creates conversations that connect deeply with audiences. Her personality blends confidence, authenticity, humor, and strong regional roots.',
  body3: "Whether it's hosting live shows, interviewing guests, collaborating with brands, or entertaining online audiences — Anjali brings energy wherever the mic turns on.",
  imageUrl: '',
}

export default function About({ data }) {
  const imgRef     = useRef(null)
  const contentRef = useRef(null)
  const [imageUrl, setImageUrl] = useState(FALLBACK.imageUrl)

  const acf = data?.acf || {}

  // about_image — handles both "Image URL" (string) and "Image ID" (number)
  useEffect(() => {
    let cancelled = false
    resolveImage(acf.about_image).then((url) => {
      if (!cancelled && url) setImageUrl(url)
    })
    return () => { cancelled = true }
  }, [acf.about_image])

  const about = {
    pill:     acf.about_pill    || FALLBACK.pill,
    heading:  acf.about_heading || FALLBACK.heading,
    body1:    acf.about_body_1  || FALLBACK.body1,
    body2:    acf.about_body_2  || FALLBACK.body2,
    body3:    acf.about_body_3  || FALLBACK.body3,
    imageUrl,
  }

  useEffect(() => {
    const imgObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          imgObserver.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (imgRef.current) imgObserver.observe(imgRef.current)

    const children = contentRef.current
      ? contentRef.current.querySelectorAll(
          '.about__pill, .about__heading, .about__divider, .about__body'
        )
      : []

    const contentObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((el, i) => {
            setTimeout(() => el.classList.add('in-view'), i * 120)
          })
          contentObserver.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (contentRef.current) contentObserver.observe(contentRef.current)

    return () => {
      imgObserver.disconnect()
      contentObserver.disconnect()
    }
  }, [])

  return (
    <section className="about" id="about">
      <div className="about__inner">

        <div className="about__img-wrap" ref={imgRef}>
          {about.imageUrl ? (
            <img src={about.imageUrl} alt={about.heading} />
          ) : (
            <div>[ ADD PHOTO IN WORDPRESS → about_image ]</div>
          )}
        </div>

        <div className="about__content" ref={contentRef}>
          <div className="about__pill">{about.pill}</div>
          <h2 className="about__heading">{about.heading}</h2>
          <p className="about__body">{about.body1}</p>
          <p className="about__body">{about.body2}</p>
          <p className="about__body">{about.body3}</p>
        </div>
      </div>
    </section>
  )
}
