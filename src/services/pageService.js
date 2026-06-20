// ─────────────────────────────────────────────
// src/services/pageService.js
//
// Single source of truth for ALL WordPress data fetching.
// Every section component imports from here instead of
// writing its own fetch logic.
//
// Falls back to safe defaults if WordPress is unreachable
// or a field hasn't been filled in yet — the site never
// breaks, it just shows fallback content.
// ─────────────────────────────────────────────

import api from "../api/wordpress";

// ── Helper: resolve an ACF image field to a usable URL ──
// Handles both "Return Format: Image URL" (string) and
// "Return Format: Image ID" (number) just in case.
//
// This WordPress install intermittently fails media requests —
// not consistently broken, just flaky (different images fail
// on different page loads). A single quick try-and-give-up
// approach means random photos disappear on random loads.
//
// Fix: retry up to 3 times per image, with a short delay
// between attempts, before giving up. Most transient server
// hiccups resolve themselves within a second or two.
async function fetchMediaUrl(value) {
  // Try the smaller filtered request first
  try {
    const res = await api.get(`/media/${value}?_fields=source_url`);
    if (res.data?.source_url) return res.data.source_url;
  } catch (_) {}

  // Fall back to the full object
  try {
    const res = await api.get(`/media/${value}`);
    if (res.data?.source_url) return res.data.source_url;
  } catch (_) {}

  return "";
}

const RETRY_DELAYS_MS = [0, 600, 1500]; // 3 attempts total

export async function resolveImage(value) {
  if (!value) return "";
  if (typeof value === "string" && value.startsWith("http")) return value;
  if (typeof value !== "number" && !/^\d+$/.test(value)) return "";

  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    const url = await fetchMediaUrl(value);
    if (url) return url;
  }

  return ""; // all attempts failed — give up quietly, caller handles missing image
}

// ── Helper: resolve a list of image IDs with light staggering ──
// Firing 20-50 simultaneous media requests at once seems to be
// part of what makes this WordPress install flaky. Staggering
// the start of each request by a small amount spreads out the
// load and noticeably reduces how often images fail.
async function resolveImagesStaggered(values, staggerMs = 60) {
  return Promise.all(
    values.map(async (value, i) => {
      if (i > 0) await new Promise((r) => setTimeout(r, i * staggerMs));
      return resolveImage(value);
    })
  );
}

// ── HOME PAGE (Hero + About ACF fields) ──────────────
export const getHomePage = async () => {
  const response = await api.get("/pages?slug=home&_embed");
  return response.data[0] || null;
};

// ── TESTIMONIALS (Custom Post Type: testimonial) ─────
export const getTestimonials = async () => {
  const response = await api.get("/testimonial?per_page=100");
  return response.data
    .map((post) => {
      const acf = post.acf || {};
      return {
        id: post.id,
        stars: Number(acf.stars) || 5,
        body: acf.body || "",
        name: acf.name || "",
        role: acf.role || "",
        initials: acf.initials || "",
      };
    })
    .filter((t) => t.body && t.name); // skip empty/incomplete entries
};

// ── GALLERY ITEMS (Custom Post Type: gallery_item) ───
export const getGalleryItems = async () => {
  const response = await api.get("/gallery_item?per_page=100");
  const posts = response.data;
  const urls = await resolveImagesStaggered(posts.map((p) => p.acf?.photo));
  const items = posts.map((post, i) => ({
    id: post.id,
    src: urls[i],
    caption: post.acf?.caption || "",
  }));
  return items.filter((g) => g.src); // skip items with no resolvable photo
};

// ── PORTFOLIO ITEMS (Custom Post Type: portfolio_item) ─
export const getPortfolioItems = async () => {
  const response = await api.get("/portfolio_item?per_page=100");
  return response.data
    .map((post) => {
      const acf = post.acf || {};
      return {
        id: post.id,
        reelId: acf.reel_id || "",
        title: acf.pf_title || "",
        category: acf.category || "",
      };
    })
    .filter((p) => p.reelId); // skip items with no reel ID
};

// ── BRANDS (Custom Post Type: brand) ─────────────────
// Logo-only — just the brand image, no name/initials/color needed.
export const getBrands = async () => {
  const response = await api.get("/brand?per_page=100");
  const posts = response.data;
  const urls = await resolveImagesStaggered(posts.map((p) => p.acf?.logo));
  const items = posts.map((post, i) => ({
    id: post.id,
    logo: urls[i],
  }));
  return items.filter((b) => b.logo); // only keep items that actually have a logo
};

// ── SERVICES (Custom Post Type: services) ───────────
// NOTE: WordPress post type slug is "services" (plural).
export const getServices = async () => {
  const response = await api.get("/services?per_page=100");
  const posts = response.data;
  const icons = await resolveImagesStaggered(posts.map((p) => p.acf?.icon));
  const items = posts.map((post, i) => ({
    id: post.id,
    title: post.acf?.service_title || "",
    desc: post.acf?.service_desc || "",
    icon: icons[i],
  }));
  return items.filter((s) => s.title); // keep the card even if the icon failed
};