# Liquid Glass Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the `suudLorLight` scheme to a genuine Apple Music–style Liquid Glass UI by adding ambient background blobs, a floating player bar, noise grain on glass surfaces, and a blur-based depth hierarchy.

**Architecture:** All visual changes live in `user.css`. The ambient blobs require two DOM elements injected by `theme.js`. No new files — only `user.css` and `theme.js` are modified. Apply changes incrementally with `spicetify apply` after each task.

**Tech Stack:** CSS (backdrop-filter, SVG data URI noise, radial-gradient), Spicetify theme.js (DOM injection via MutationObserver)

---

## File Map

| File | What changes |
|---|---|
| `theme.js` | Add blob injection (Task 1) |
| `user.css` | Body gradient + blob styles (Task 1), floating player bar + shimmer + content clearance (Task 2), noise custom property + surface pseudo-elements (Task 3), blur hierarchy adjustments (Task 4) |

---

### Task 1: Ambient Background System

**Files:**
- Modify: `theme.js`
- Modify: `user.css`

- [ ] **Step 1: Add blob injection to `theme.js`**

Open `theme.js`. The file currently has one IIFE wrapping `applyGlassEnhancements`. Add a second IIFE for blob injection **after** the existing one:

```js
(function () {
  const injectAmbientBlobs = () => {
    if (!document.querySelector('.spice-ambient-blob-1')) {
      const b1 = document.createElement('div');
      b1.className = 'spice-ambient-blob-1';
      document.body.appendChild(b1);
    }
    if (!document.querySelector('.spice-ambient-blob-2')) {
      const b2 = document.createElement('div');
      b2.className = 'spice-ambient-blob-2';
      document.body.appendChild(b2);
    }
  };

  const mo = new MutationObserver(injectAmbientBlobs);
  mo.observe(document.body, { childList: true });
  injectAmbientBlobs();
})();
```

- [ ] **Step 2: Add body gradient and blob CSS to `user.css`**

Add this block at the very end of `user.css`:

```css
/* ---- Ambient Background System ---- */
body {
  background: linear-gradient(160deg, #f5f3fa 0%, #edf5f1 100%) !important;
}

.spice-ambient-blob-1 {
  position: fixed;
  top: -80px;
  left: -80px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(180, 155, 230, 0.35), transparent 70%);
  filter: blur(80px);
  z-index: -1;
  pointer-events: none;
}

.spice-ambient-blob-2 {
  position: fixed;
  bottom: -60px;
  right: -60px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(30, 215, 96, 0.22), transparent 70%);
  filter: blur(60px);
  z-index: -1;
  pointer-events: none;
}
```

- [ ] **Step 3: Apply and verify**

```bash
spicetify apply
```

Open Spotify. Expected: background is a warm off-white with a faint purple tint top-left and green tint bottom-right. If background is still pure white, open DevTools → Elements → `body` and confirm `spice-ambient-blob-1` is present as a child.

- [ ] **Step 4: Commit**

```bash
git add user.css theme.js
git commit -m "feat(glass): add ambient blob background system"
```

---

### Task 2: Floating Player Bar

**Files:**
- Modify: `user.css` (lines ~362–368 — the `.Root__now-playing-bar` block)

- [ ] **Step 1: Replace the existing `.Root__now-playing-bar` rule**

Find this block in `user.css` (around line 362):

```css
/* Playing Bar — Liquid Glass */
.Root__now-playing-bar {
  background: var(--glass-surface) !important;
  border-top: 1px solid var(--glass-border) !important;
  box-shadow: inset 0 1px 0 var(--glass-highlight), 0 -16px 16px rgba(0, 0, 0, 0.05) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
```

Replace the entire block with:

```css
/* Playing Bar — Floating Liquid Glass */
.Root__now-playing-bar {
  position: fixed !important;
  bottom: 16px !important;
  left: 16px !important;
  right: 16px !important;
  border-radius: 28px !important;
  background: var(--glass-surface) !important;
  border: 1px solid rgba(255, 255, 255, 0.72) !important;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.90) !important;
  backdrop-filter: blur(30px) saturate(200%) !important;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

/* Diagonal shimmer streak */
.Root__now-playing-bar::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.45) 50%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Add content clearance so player bar doesn't cover tracks**

Add this rule **immediately after** the player bar block:

```css
/* Clearance for floating player bar */
.Root__main-view {
  padding-bottom: 96px !important;
}
```

- [ ] **Step 3: Apply and verify**

```bash
spicetify apply
```

Open Spotify. Expected:
- Player bar has rounded corners on all sides and floats ~16px above the bottom edge
- A faint diagonal white shimmer is visible across the bar
- Scrolling a long playlist — last track is not hidden behind the player bar
- If player bar overlaps content, increase `padding-bottom` value

- [ ] **Step 4: Commit**

```bash
git add user.css
git commit -m "feat(glass): float player bar with shimmer highlight"
```

---

### Task 3: Noise Texture on Glass Surfaces

**Files:**
- Modify: `user.css`

- [ ] **Step 1: Add noise CSS custom property to `:root`**

Find the first `:root` block at line 1 of `user.css`. Add this variable inside it, after `--color-card-shadow`:

```css
--noise-svg: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
```

- [ ] **Step 2: Add noise `::after` to the floating player bar**

Directly after the `.Root__now-playing-bar::before` rule added in Task 2, add:

```css
.Root__now-playing-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: var(--noise-svg);
  background-size: 180px 180px;
  opacity: 0.038;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 3: Add noise `::after` to cards**

Find the `.main-card-card` block (around line 489). Add this rule after it:

```css
.main-card-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: var(--noise-svg);
  background-size: 180px 180px;
  opacity: 0.038;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

Note: `.main-card-card` already has `overflow: hidden` — the pseudo-element will be clipped correctly.

- [ ] **Step 4: Add noise `::after` to sidebar and context menu**

Find the `.Root__nav-bar` rule (around line 514). Add `position: relative` to it so `::after` has a containing block, then replace the block with:

```css
.Root__nav-bar {
  position: relative;
  background: var(--glass-surface) !important;
  border-right: 1px solid var(--glass-border) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
}
```

Then add after it:

```css
.Root__nav-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--noise-svg);
  background-size: 180px 180px;
  opacity: 0.038;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

Find the `.main-contextMenu-menu` rule (around line 575). Add `position: relative` to it, then replace the block with:

```css
.main-contextMenu-menu {
  position: relative;
  background: color-mix(in srgb, var(--spice-card, #ffffff) 82%, transparent) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-md) !important;
  box-shadow: 0 8px 24px var(--glass-shadow), inset 0 1px 0 var(--glass-highlight) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  overflow: hidden;
  padding: 6px !important;
}
```

Then add after it:

```css
.main-contextMenu-menu::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: var(--noise-svg);
  background-size: 180px 180px;
  opacity: 0.038;
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

- [ ] **Step 5: Apply and verify**

```bash
spicetify apply
```

Open Spotify. Zoom browser to 200% (Cmd +) and look closely at the player bar and a card. Expected: faint grain texture visible on glass surfaces. If you can't see it at normal zoom, that's correct — it's intentionally subtle.

- [ ] **Step 6: Commit**

```bash
git add user.css
git commit -m "feat(glass): add noise grain texture to glass surfaces"
```

---

### Task 4: Depth Hierarchy

**Files:**
- Modify: `user.css`

- [ ] **Step 1: Update topbar blur**

Find the `.spice-glass-topbar` rule (around line 63). Change:
```css
backdrop-filter: blur(20px) saturate(180%) !important;
```
to:
```css
backdrop-filter: blur(24px) saturate(180%) !important;
```

- [ ] **Step 2: Update dialog blur**

Find the `.spice-glass-dialog[role="dialog"][aria-label="Search"]` rule (around line 155). Change:
```css
backdrop-filter: blur(20px) saturate(180%) !important;
```
to:
```css
backdrop-filter: blur(24px) saturate(180%) !important;
```

- [ ] **Step 3: Update cards blur**

Find the `.main-card-card` rule (around line 489). Change:
```css
backdrop-filter: blur(20px) saturate(180%) !important;
```
to:
```css
backdrop-filter: blur(16px) saturate(160%) !important;
```

- [ ] **Step 4: Update sidebar blur**

Find the `.Root__nav-bar` rule (around line 514). Change:
```css
backdrop-filter: blur(20px) saturate(180%) !important;
```
to:
```css
backdrop-filter: blur(12px) saturate(140%) !important;
```

- [ ] **Step 5: Update context menu blur**

Find the `.main-contextMenu-menu` rule (around line 575). Change:
```css
backdrop-filter: blur(20px) saturate(180%) !important;
```
to:
```css
backdrop-filter: blur(20px) saturate(170%) !important;
```

- [ ] **Step 6: Apply and verify**

```bash
spicetify apply
```

Open Spotify. Expected depth from highest to lowest blur:
- Player bar — strongest blur (blobs behind it should be most smeared)
- Topbar search / Search dialog — second
- Context menu — third
- Cards — lighter than topbar
- Sidebar — lightest of all

If it all looks the same, open DevTools, hover each element, and confirm `backdrop-filter` values differ as expected.

- [ ] **Step 7: Final commit**

```bash
git add user.css
git commit -m "feat(glass): apply blur depth hierarchy across surfaces"
```
