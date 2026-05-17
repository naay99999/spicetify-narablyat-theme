# Liquid Glass Upgrade — Design Spec

**Date:** 2026-05-17  
**Scope:** `suudLorLight` scheme only  
**Approach:** Essentials + Depth Hierarchy (Approach 2)  
**Files touched:** `user.css`, `theme.js`

---

## Goals

Transform the current "flat white UI" into a genuine Liquid Glass UI matching Apple Music's aesthetic, by adding:

1. An ambient layered background that gives glass surfaces something to blur through
2. A floating player bar detached from the bottom edge
3. Subtle noise grain on all glass surfaces
4. A depth hierarchy where elevation maps to blur intensity

---

## Section 1 — Background System

**What:** Two ambient color blob elements injected into `body` via `theme.js`, providing the translucent base layer all glass surfaces blur against.

**Implementation:**
- `theme.js` injects two `<div>` elements into `body` with class `spice-ambient-blob-1` and `spice-ambient-blob-2`
- Guard: only inject if not already present (idempotent, MutationObserver-safe)

**CSS:**
```css
body {
  background: linear-gradient(160deg, #f5f3fa 0%, #edf5f1 100%);
  overflow: hidden; /* prevent blob scroll bleed */
}

.spice-ambient-blob-1 {
  position: fixed;
  top: -80px; left: -80px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(180,155,230,0.35), transparent 70%);
  filter: blur(80px);
  z-index: -1;
  pointer-events: none;
}

.spice-ambient-blob-2 {
  position: fixed;
  bottom: -60px; right: -60px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(30,215,96,0.22), transparent 70%);
  filter: blur(60px);
  z-index: -1;
  pointer-events: none;
}
```

**Constraints:**
- `z-index: -1` keeps blobs behind all Spotify content
- No animation (static blobs only — Approach 2 scope)
- No external image files required

---

## Section 2 — Floating Player Bar

**What:** `.Root__now-playing-bar` detaches from the bottom edge and floats as a glass pill above the content.

**CSS changes to `.Root__now-playing-bar`:**

Remove:
- `border-top: 1px solid ...`

Add:
```css
position: fixed;
bottom: 16px;
left: 16px;
right: 16px;
border-radius: 28px;
backdrop-filter: blur(30px) saturate(200%);
border: 1px solid rgba(255,255,255,0.72);
box-shadow:
  0 12px 40px rgba(0,0,0,0.13),
  inset 0 1px 0 rgba(255,255,255,0.90);
```

**Shimmer highlight via `::before`:**
```css
.Root__now-playing-bar::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255,255,255,0.45) 50%,
    transparent 70%
  );
  pointer-events: none;
}
```

**Content clearance:** Add `padding-bottom: 96px` to `.Root__main-view` (or equivalent content container) so tracks/content are not hidden behind the floating bar.

**Constraints:**
- Only the container is repositioned; controls, progress bar, track info inside are unchanged
- `position: fixed` matches how Spotify already positions this element — overriding it is stable

---

## Section 3 — Noise Texture

**What:** A faint fractal noise grain overlaid on every glass surface to prevent the "too digital" look and match Apple's frosted glass tactility.

**Implementation:** `::before` pseudo-element added to each glass surface. Where `::before` is already used (topbar, dialog), the noise is embedded directly into the existing `::before` via `background-image` layering or moved to `::after` if available.

**Noise CSS (reusable pattern):**
```css
/* applied as ::before or blended into existing pseudo-element */
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
background-size: 180px 180px;
opacity: 0.038;
mix-blend-mode: overlay;
pointer-events: none;
```

**Surfaces receiving noise:**
| Surface | Selector |
|---|---|
| Player bar | `.Root__now-playing-bar::after` |
| Topbar search | `.spice-glass-topbar` — add to existing `::before` as layered `background-image` |
| Search dialog | `.spice-glass-dialog` — add to existing `::before` as layered `background-image` |
| Cards | `.main-card-card::after` |
| Sidebar | `.Root__nav-bar::after` |
| Context menu | `.main-contextMenu-menu::after` |

---

## Section 4 — Depth Hierarchy

**What:** Blur and saturation values mapped to elevation level. Higher-floating surfaces have stronger blur, creating a perceptible sense of layered depth.

| Surface | Selector | blur | saturate | Change from current |
|---|---|---|---|---|
| Player bar | `.Root__now-playing-bar` | 30px | 200% | **New** (was 20px/180%) |
| Topbar / Dialog | `.spice-glass-topbar`, `.spice-glass-dialog` | 24px | 180% | +4px blur |
| Context menu | `.main-contextMenu-menu` | 20px | 170% | unchanged |
| Cards | `.main-card-card` | 16px | 160% | -4px blur |
| Sidebar | `.Root__nav-bar` | 12px | 140% | -8px blur |

**Why this matters:** Currently all surfaces use `blur(20px) saturate(180%)` uniformly — the depth hierarchy is invisible. After this change, the player bar will visually "sit above" cards, which sit above the sidebar.

---

## Out of Scope (Approach 3 only)

- Blob animation
- Playlist / album header gradient treatment
- Home header glow
- Dark scheme (`suudLorDark`) changes
- Dynamic album-art color extraction

---

## Risk Assessment

| Change | Selector stability | Risk |
|---|---|---|
| Body background + blobs | `body`, injected class | Very low |
| Floating player bar | `.Root__now-playing-bar` (Spicetify-stable) | Low |
| Noise pseudo-elements | Same selectors as existing glass | Low |
| Depth blur adjustments | Same selectors as existing glass | Low |

No hashed class names introduced. All selectors are `Root__*`, `main-*`, or injected via `theme.js`.

---

## Implementation Order

1. Background system (blobs) — `theme.js` + CSS
2. Floating player bar — `user.css`
3. Content clearance padding — `user.css`
4. Noise texture — `user.css`
5. Depth hierarchy blur adjustments — `user.css`
