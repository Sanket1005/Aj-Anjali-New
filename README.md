# RJ Anjali — React Website

A modern, animated personal brand website for RJ Anjali Singh.
Inspired by Nevire.webflow.io interaction patterns.

---

## 📁 Folder Structure

```
rj-anjali/
├── public/
│   └── anjali.png              ← Place your hero photo here
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx      ← Fixed top navigation
│   │   │   └── MenuOverlay.jsx ← Full-screen circular menu
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.jsx        ← Hero banner (main landing)
│   │   │   └── Marquee.jsx     ← Scrolling ticker strip
│   │   │
│   │   └── ui/
│   │       ├── Cursor.jsx      ← Custom cursor (dot + ring)
│   │       └── PageCover.jsx   ← Intro wipe animation
│   │
│   ├── hooks/
│   │   ├── useCursor.js        ← Cursor position + lerp logic
│   │   └── useScrolled.js      ← Detects page scroll
│   │
│   ├── styles/
│   │   ├── globals.css         ← Reset, fonts, body styles
│   │   ├── navbar.css          ← Nav + menu styles
│   │   ├── hero.css            ← Hero section styles + animations
│   │   └── marquee.css         ← Ticker strip styles
│   │
│   ├── data/
│   │   └── content.js          ← All text content in one place
│   │
│   └── App.jsx                 ← Root component, wires everything
│
├── index.html                  ← Vite HTML entry
├── package.json
└── vite.config.js
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:5173
```

---

## 🖼️ Adding Your Photo

1. Copy your photo to `public/anjali.png`
2. Open `src/components/sections/Hero.jsx`
3. Find the `{/* PHOTO PLACEHOLDER */}` comment
4. Replace the placeholder div with:

```jsx
<img
  ref={imgRef}
  src="/anjali.png"
  alt="RJ Anjali"
  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }}
/>
```

---

## ✏️ Editing Content

All text lives in one file: `src/data/content.js`

```js
// Change name, tagline, description, stats — all here
export const HERO = {
  name: "Anjali Singh",
  tagline: "RJ · HOST · CREATOR ...",
  ...
}
```

---

## 🎨 Changing Colors

Open `src/styles/globals.css` — edit the CSS variables at the top:

```css
:root {
  --brand-primary:  #b53017;   /* main terracotta */
  --brand-dark:     #1a0a06;   /* near-black */
  --brand-light:    #d86035;   /* lighter orange */
}
```

---

## ⚙️ Animation Timings

Each entrance animation delay is in `src/styles/hero.css`.
Look for `transition-delay` values to fine-tune the stagger.

---

## 📦 Build for Production

```bash
npm run build
```
Output goes to `/dist` — deploy to Vercel, Netlify, or any static host.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool / dev server |
| Google Fonts | Cormorant Garamond + DM Sans |
| Pure CSS | All animations (no animation library needed) |

---

## 🔌 Adding More Sections

1. Create `src/components/sections/YourSection.jsx`
2. Add its CSS to `src/styles/` (or inline)
3. Import and add it in `src/App.jsx` below `<Marquee />`

---
