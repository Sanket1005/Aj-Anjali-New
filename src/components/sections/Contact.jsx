// ─────────────────────────────────────────────
// src/components/sections/Contact.jsx
//
// Sends real emails using Contact Form 7's REST API
// (WordPress) — no third-party email service needed.
//
// Submits to:
//   POST https://api.themagicmonks.com/wp-json/contact-form-7/v1/contact-forms/128/feedback
//
// Field names below MUST match the CF7 form template exactly:
//   your-name   → Name
//   your-email  → Email
//   tel-260     → Phone
//   select-660  → Service dropdown
//   your-message → Message
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import '../../styles/contact.css'

// ── Contact Form 7 config ────────────────────
const CF7_BASE_URL = 'https://api.themagicmonks.com'
const CF7_FORM_ID   = '128'
// ─────────────────────────────────────────────

const INFO_ITEMS = [
  {
    label: 'Email',
    value: 'anjali@rjanjali.com',   // ← your email
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 6L9 10.5L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: '+91 98765 43210',        // ← your number
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 3C3 3 4 7 6 9C8 11 12 12.5 12 12.5L14 10.5C14 10.5 12 9 11.5 8.5C11 8 12 7 12.5 7.5C13 8 14.5 9.5 14.5 9.5C14.5 9.5 14 13.5 11.5 14C9 14.5 3.5 9 3 6.5C2.5 4 6 3.5 6 3.5L7.5 5C6.5 6 6 7 5.5 7C5 7 3 3 3 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Location',
    value: 'Patna, Bihar — India',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2C6.2 2 4 4.2 4 7C4 11 9 16 9 16C9 16 14 11 14 7C14 4.2 11.8 2 9 2Z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="5" r=".9" fill="currentColor"/></svg> },
  { label: 'YouTube', href: 'https://youtube.com',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M7.5 7L11.5 9L7.5 11V7Z" fill="currentColor"/></svg> },
  { label: 'Twitter', href: 'https://twitter.com',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5L8 10L3 15H4.5L8.7 11L12 15H15L9.8 7.8L14.5 3.5H13L9.2 7L6 3.5H3Z" fill="currentColor"/></svg> },
  { label: 'LinkedIn', href: 'https://linkedin.com',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="8" x2="6" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="6" cy="6" r=".9" fill="currentColor"/><path d="M9.5 13V10.5C9.5 9.4 10.4 8.5 11.5 8.5C12.6 8.5 13.5 9.4 13.5 10.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
]

// Must match the [select* select-660 ...] options in the CF7 form template
const SERVICES = [
  'Event Hosting',
  'Brand Promotion',
  'Digital Campaign',
  'Radio Collaboration',
  'Podcast / Interview',
  'Other',
]

// ── FORM ─────────────────────────────────────
function ContactForm({ onHover }) {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [errors,  setErrors]  = useState({})
  const [status,  setStatus]  = useState('idle') // idle | sending | success | error
  const formRef = useRef(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim())                           e.name    = 'Name is required'
    if (!form.email.trim())                          e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))      e.email   = 'Enter a valid email'
    if (!form.service)                               e.service = 'Please select a service'
    if (!form.message.trim())                        e.message = 'Tell us a bit more'
    else if (form.message.trim().length < 20)        e.message = 'At least 20 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')

    try {
      // Contact Form 7's REST API expects multipart/form-data,
      // with field names matching the CF7 form template exactly.
      const data = new FormData()
      data.append('your-name', form.name)
      data.append('your-email', form.email)
      data.append('tel-260', form.phone || '')
      data.append('select-660', form.service)
      data.append('your-message', form.message)

      // CF7 REST API requires these meta fields — without the unit tag
      // CF7 often rejects the request as a validation/spam failure.
      data.append('_wpcf7', CF7_FORM_ID)
      data.append('_wpcf7_version', '5.9')
      data.append('_wpcf7_locale', 'en_US')
      data.append('_wpcf7_unit_tag', `wpcf7-f${CF7_FORM_ID}-p1-o1`)
      data.append('_wpcf7_container_post', '0')

      const res = await fetch(
        `${CF7_BASE_URL}/wp-json/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`,
        { method: 'POST', body: data }
      )

      const result = await res.json()

      // CF7 returns status: "mail_sent" on success,
      // "validation_failed" / "mail_failed" / "spam" on failure.
      if (result.status === 'mail_sent') {
        setStatus('success')
      } else {
        // Log the real reason so the actual problem is visible
        console.error('CF7 submission issue:', result.status, result.message, result.invalid_fields)
        setStatus('error')
      }
    } catch (err) {
      console.error('Contact form submission error:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact__success">
        <div className="contact__success-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14L11 19L22 9" stroke="#c94a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="contact__success-title">Message Sent!</h3>
        <p className="contact__success-msg">
          Thank you for reaching out.<br />
          Anjali will get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <p className="contact__form-title">Send a Message</p>
      <p className="contact__form-sub">Fill in the details and hit send — it lands straight in my inbox.</p>

      {/* Name + Email */}
      <div className="contact__row">
        <div className="contact__field">
          <label className="contact__label" htmlFor="cf-name">Your Name *</label>
          <input
            id="cf-name" name="name" type="text"
            className="contact__input"
            placeholder="Rahul Kumar"
            value={form.name} onChange={handleChange}
            onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)}
          />
          {errors.name && <span className="contact__error-msg">{errors.name}</span>}
        </div>
        <div className="contact__field">
          <label className="contact__label" htmlFor="cf-email">Email Address *</label>
          <input
            id="cf-email" name="email" type="email"
            className="contact__input"
            placeholder="you@example.com"
            value={form.email} onChange={handleChange}
            onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)}
          />
          {errors.email && <span className="contact__error-msg">{errors.email}</span>}
        </div>
      </div>

      {/* Phone + Service */}
      <div className="contact__row">
        <div className="contact__field">
          <label className="contact__label" htmlFor="cf-phone">Phone (optional)</label>
          <input
            id="cf-phone" name="phone" type="tel"
            className="contact__input"
            placeholder="+91 98765 43210"
            value={form.phone} onChange={handleChange}
            onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)}
          />
        </div>
        <div className="contact__field">
          <label className="contact__label" htmlFor="cf-service">Service Needed *</label>
          <select
            id="cf-service" name="service"
            className="contact__select"
            value={form.service} onChange={handleChange}
            onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)}
          >
            <option value="" disabled>Select a service…</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.service && <span className="contact__error-msg">{errors.service}</span>}
        </div>
      </div>

      {/* Message */}
      <div className="contact__field">
        <label className="contact__label" htmlFor="cf-message">Your Message *</label>
        <textarea
          id="cf-message" name="message"
          className="contact__textarea"
          placeholder="Tell me about your event, brand, or project…"
          value={form.message} onChange={handleChange}
          onMouseEnter={() => onHover?.(true)} onMouseLeave={() => onHover?.(false)}
        />
        {errors.message && <span className="contact__error-msg">{errors.message}</span>}
      </div>

      {status === 'error' && (
        <p className="contact__error-msg" style={{ marginBottom: 12 }}>
          Something went wrong. Please try again or email directly.
        </p>
      )}

      <button
        type="submit"
        className="contact__submit"
        disabled={status === 'sending'}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
      >
        {status === 'sending' ? (
          <><div className="contact__spinner" /> SENDING…</>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 7L1 13V8.5L10 7L1 5.5V1Z" fill="white"/>
            </svg>
            SEND MESSAGE
          </>
        )}
      </button>
    </form>
  )
}

// ── MAIN ─────────────────────────────────────
export default function Contact({ onHover }) {
  const infoRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          infoRef.current?.classList.add('in-view')
          formRef.current?.classList.add('in-view')
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (infoRef.current) obs.observe(infoRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">

        {/* ── LEFT: INFO ── */}
        <div className="contact__info" ref={infoRef}>
          <div className="contact__pill">GET IN TOUCH</div>

          <h2 className="contact__heading">
            Let's Create<br />
            Something <span>Impactful</span>
          </h2>

          <p className="contact__desc">
            Have an event, campaign, or collaboration in mind?
            Drop a message and let's talk about how Anjali can bring energy to your project.
          </p>

          {/* Info items */}
          <div className="contact__info-items">
            {INFO_ITEMS.map((item) => (
              <div
                key={item.label}
                className="contact__info-item"
                onMouseEnter={() => onHover?.(true)}
                onMouseLeave={() => onHover?.(false)}
              >
                <div className="contact__info-icon">{item.icon}</div>
                <div>
                  <p className="contact__info-label">{item.label}</p>
                  <p className="contact__info-val">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="contact__socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="contact__social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                onMouseEnter={() => onHover?.(true)}
                onMouseLeave={() => onHover?.(false)}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── RIGHT: FORM ── */}
        <div className="contact__form-wrap" ref={formRef}>
          <ContactForm onHover={onHover} />
        </div>

      </div>
    </section>
  )
}
