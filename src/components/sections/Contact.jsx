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
    value: 'rjanjali.business@gmail.com',   // ← your email
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 6L9 10.5L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/rjanjalimirchi/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="11.2" cy="4.8" r=".8" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/watch?v=8pLQR49eDwM',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3.5" width="14" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6.5 6L10 8L6.5 10V6Z" fill="currentColor"/>
      </svg>
    ),
  },

  {
    label: 'Facebook',
    href: 'https://www.facebook.com/RjAnjaliMirchi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
</svg>
    ),
  },

  {
    label: 'Threads',
    href: 'https://www.threads.com/@rjanjalimirchi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads" viewBox="0 0 16 16">
  <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
</svg>
    ),
  },
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
