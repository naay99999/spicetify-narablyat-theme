# Liquid Glass Design System Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `color.ini` and `user.css` to match the narablyat Liquid Glass design system — frost white / dark neutral palettes, electric mint-green accent (`#00e676`), frosted glass at `blur(20px) saturate(180%)`, and Apple squircle radius scale.

**Architecture:** Two files only — `color.ini` drives Spicetify's `--spice-*` variables for both schemes; `user.css` holds CSS custom properties and all selector rules. No JS changes needed.

**Tech Stack:** CSS, Spicetify CLI (`spicetify apply`)

---

## File Map

| File | Change |
|---|---|
| `color.ini` | Replace all color values in `suudLorLight` and `suudLorDark` |
| `user.css` | Update `:root` variables, glass variables, hardcoded accent rgba, blur values, hardcoded radii |

---

### Task 1: Update `suudLorLight` in color.ini

**Files:**
- Modify: `color.ini`

- [ ] **Step 1: Replace the `[suudLorLight]` block entirely**

Open `color.ini` and replace the `[suudLorLight]` block with:

```ini
[suudLorLight]
main               = f5f5f7
main-elevated      = ffffff
pressed            = e5e5ea
highlight          = f2f2f7
selected-row       = e8e8ed
background-highlight = f2f2f7
background-press   = e5e5ea
text               = 1d1d1f
subtext            = 6e6e73
alt-text           = ffffff
sidebar            = f5f5f7
player             = f5f5f7
player-border      = d1d1d6
player-bar-bg      = 00e676
player-bar-shadow  = c0fdd8
card               = ffffff
shadow             = e8e8ed
button             = 00e676
button-active      = 00ff87
button-disabled    = d1d1d6
tab-active         = ffffff
notification       = 00e676
notification-error = ff453a
notif-bubble-info  = f0fdf4
notif-bubble-error = fff0f0
misc               = 6e6e73
not-selected       = aeaeb2
accent             = 00e676
layer-shadow       = e8e8ed
contour            = d1d1d6
dark-border        = d1d1d6
```

- [ ] **Step 2: Verify with spicetify (light scheme)**

```bash
spicetify config color_scheme suudLorLight && spicetify apply
```

Expected: Spotify loads with frost white background, electric green progress bar and buttons. No platinum/warm gray tones remain.

- [ ] **Step 3: Commit**

```bash
git add color.ini
git commit -m "refactor(color): update suudLorLight to frost white palette"
```

---

### Task 2: Update `suudLorDark` in color.ini

**Files:**
- Modify: `color.ini`

- [ ] **Step 1: Replace the `[suudLorDark]` block entirely**

Replace the `[suudLorDark]` block with:

```ini
[suudLorDark]
main               = 0a0a0a
main-elevated      = 1c1c1e
pressed            = 2c2c2e
highlight          = 3a3a3c
selected-row       = 2c2c2e
background-highlight = 1c1c1e
background-press   = 2c2c2e
text               = f5f5f7
subtext            = 8e8e93
alt-text           = ffffff
sidebar            = 0a0a0a
player             = 0a0a0a
player-border      = 2c2c2e
player-bar-bg      = 00e676
player-bar-shadow  = 0a0a0a
card               = 1c1c1e
shadow             = 0a0a0a
button             = 00e676
button-active      = 00ff87
button-disabled    = 3a3a3c
tab-active         = 2c2c2e
notification       = 00e676
notification-error = ff453a
notif-bubble-info  = 1c1c1e
notif-bubble-error = 3a1c1e
misc               = 8e8e93
not-selected       = 3a3a3c
accent             = 00e676
layer-shadow       = 0a0a0a
contour            = 2c2c2e
dark-border        = 2c2c2e
```

- [ ] **Step 2: Verify with spicetify (dark scheme)**

```bash
spicetify config color_scheme suudLorDark && spicetify apply
```

Expected: Spotify loads with near-black background (`#0a0a0a`), no green tint on surfaces, electric green accent on progress bar and play button.

- [ ] **Step 3: Commit**

```bash
git add color.ini
git commit -m "refactor(color): update suudLorDark to dark neutral palette"
```

---

### Task 3: Update CSS custom properties in user.css

**Files:**
- Modify: `user.css` lines 1–51

- [ ] **Step 1: Replace the first `:root` block (lines 1–24)**

Replace:

```css
:root {
  /* ---- Color Palette ---- */
  --color-bg: #e5e4e2;
  /*  platinum */
  --color-surface: #eae9e7;
  /* slightly elevated */
  --color-border: #e5e5e5;
  --color-text: #1a1a1a;
  --color-subtext: #6d6d6d;
  --color-accent: #1db954;
  --color-accent-hover: #1ed760;
  --color-disabled: #cccccc;
  --color-card-shadow: rgba(0, 0, 0, 0.05);

  /* ---- Layout ---- */
  --radius-md: 10px;
  --radius-sm: 6px;
  --radius-lg: 16px;

  /* ---- Transitions ---- */
  --transition-fast: 0.15s ease;
  --transition-medium: 0.25s ease;
  --transition-slow: 0.4s ease;
}
```

With:

```css
:root {
  /* ---- Color Palette ---- */
  --color-bg: #f5f5f7;
  --color-surface: #ffffff;
  --color-border: rgba(0, 0, 0, 0.08);
  --color-text: #1d1d1f;
  --color-subtext: #6e6e73;
  --color-accent: #00e676;
  --color-accent-hover: #00ff87;
  --color-disabled: #d1d1d6;
  --color-card-shadow: rgba(0, 0, 0, 0.08);

  /* ---- Layout ---- */
  --radius-xs: 8px;
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --radius-xl: 32px;

  /* ---- Transitions ---- */
  --transition-fast: 0.15s ease;
  --transition-medium: 0.25s ease;
  --transition-slow: 0.4s ease;
}
```

- [ ] **Step 2: Replace the search bar `:root` block (lines 27–38)**

Replace:

```css
:root {
  --search-bg: rgba(229, 228, 226, 0.72);
  --search-bg-hover: rgba(229, 228, 226, 0.86);
  --search-bg-focus: #e5e4e2;
  --search-border: rgba(0, 0, 0, 0.08);
  --search-border-hover: rgba(29, 185, 84, 0.35);
  --search-ring: rgba(29, 185, 84, 0.28);
  --search-text: var(--color-text);
  --search-subtext: var(--color-subtext);
  --search-icon: var(--color-subtext);
  --search-icon-hover: var(--color-accent);
}
```

With:

```css
:root {
  --search-bg: rgba(255, 255, 255, 0.52);
  --search-bg-hover: rgba(255, 255, 255, 0.66);
  --search-bg-focus: #ffffff;
  --search-border: rgba(0, 0, 0, 0.08);
  --search-border-hover: rgba(0, 230, 118, 0.35);
  --search-ring: rgba(0, 230, 118, 0.28);
  --search-text: var(--color-text);
  --search-subtext: var(--color-subtext);
  --search-icon: var(--color-subtext);
  --search-icon-hover: var(--color-accent);
}
```

- [ ] **Step 3: Replace the glass modal `:root` block (lines 41–51)**

Replace:

```css
:root {
  --glass-overlay-tint: rgba(229, 228, 226, 0.35);
  --glass-surface: rgba(229, 228, 226, 0.68);
  --glass-border: rgba(255, 255, 255, 0.35);
  --glass-highlight: rgba(255, 255, 255, 0.35);
  --glass-shadow: rgba(20, 20, 20, 0.18);
  --glass-ink: rgba(18, 18, 18, 0.70);
  --glass-ink-hover: rgba(18, 18, 18, 0.78);
  --glass-ink-border: rgba(255, 255, 255, 0.14);
  --glass-ink-ring: rgba(29, 185, 84, 0.22);
}
```

With:

```css
:root {
  --glass-overlay-tint: rgba(255, 255, 255, 0.35);
  --glass-surface: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(255, 255, 255, 0.40);
  --glass-highlight: rgba(255, 255, 255, 0.60);
  --glass-shadow: rgba(0, 0, 0, 0.08);
  --glass-ink: rgba(28, 28, 30, 0.72);
  --glass-ink-hover: rgba(28, 28, 30, 0.86);
  --glass-ink-border: rgba(255, 255, 255, 0.14);
  --glass-ink-ring: rgba(0, 230, 118, 0.28);
}
```

- [ ] **Step 4: Apply and check variables are live**

```bash
spicetify apply
```

Expected: Search bar is now frost white glass, shadow is lighter, focus ring uses `#00e676`.

- [ ] **Step 5: Commit**

```bash
git add user.css
git commit -m "refactor(css): update custom properties to Liquid Glass design tokens"
```

---

### Task 4: Update hardcoded accent rgba values in user.css

**Files:**
- Modify: `user.css`

There are 7 occurrences of the old green `rgba(29, 185, 84, ...)` still hardcoded in selectors. Replace each one.

- [ ] **Step 1: Line ~101 — topbar accent blob**

Replace:
```css
  background: radial-gradient(60% 50% at 40% 35%, rgba(29, 185, 84, 0.28), rgba(29, 185, 84, 0) 70%);
```
With:
```css
  background: radial-gradient(60% 50% at 40% 35%, rgba(0, 230, 118, 0.28), rgba(0, 230, 118, 0) 70%);
```

- [ ] **Step 2: Lines ~151–152 — active nav link**

Replace:
```css
  background: rgba(29, 185, 84, 0.12) !important;
  border-color: rgba(29, 185, 84, 0.35) !important;
```
With:
```css
  background: rgba(0, 230, 118, 0.12) !important;
  border-color: rgba(0, 230, 118, 0.35) !important;
```

- [ ] **Step 3: Line ~186 — dialog accent blob**

Replace:
```css
  background: radial-gradient(60% 65% at 40% 35%, rgba(29, 185, 84, 0.35) 0%, rgba(29, 185, 84, 0.18) 50%, rgba(29, 185, 84, 0) 100%);
```
With:
```css
  background: radial-gradient(60% 65% at 40% 35%, rgba(0, 230, 118, 0.35) 0%, rgba(0, 230, 118, 0.18) 50%, rgba(0, 230, 118, 0) 100%);
```

- [ ] **Step 4: Line ~247 — selected search option**

Replace:
```css
  background: rgba(29, 185, 84, 0.08) !important;
```
With:
```css
  background: rgba(0, 230, 118, 0.08) !important;
```

- [ ] **Step 5: Line ~445 — volume bar fill**

Replace:
```css
  background-color: rgba(29, 185, 84, 0.75);
```
With:
```css
  background-color: rgba(0, 230, 118, 0.75);
```

- [ ] **Step 6: Verify no old accent remains**

```bash
grep -n "29, 185, 84\|1db954\|1ed760\|4ade80\|5efc8d" /Users/naay/workspace/naay/spicetify-narablyat-theme/user.css
```

Expected: no output (zero matches).

- [ ] **Step 7: Commit**

```bash
git add user.css
git commit -m "refactor(css): replace old green accent rgba with #00e676 values"
```

---

### Task 5: Update backdrop-filter blur values

**Files:**
- Modify: `user.css`

All glass elements move from `blur(10px–16px) saturate(120%)` to `blur(20px) saturate(180%)`.

- [ ] **Step 1: Topbar glass blur (line ~68)**

Replace:
```css
  backdrop-filter: blur(10px) saturate(120%) !important;
```
With:
```css
  backdrop-filter: blur(20px) saturate(180%) !important;
```

- [ ] **Step 2: Dialog glass blur (line ~162)**

Replace:
```css
  backdrop-filter: blur(12px) saturate(120%) !important;
```
With:
```css
  backdrop-filter: blur(20px) saturate(180%) !important;
```

- [ ] **Step 3: Search container blur (line ~268)**

Replace:
```css
  backdrop-filter: blur(10px) !important;
```
With:
```css
  backdrop-filter: blur(20px) saturate(180%) !important;
```

- [ ] **Step 4: Now-playing bar blur (line ~371)**

Replace:
```css
  backdrop-filter: blur(16px);
```
With:
```css
  backdrop-filter: blur(20px) saturate(180%);
```

- [ ] **Step 5: Apply and visually verify glass depth**

```bash
spicetify apply
```

Expected: All glass surfaces (topbar search, search modal, now-playing bar) have noticeably thicker, more opaque blur — closer to iOS Control Center.

- [ ] **Step 6: Commit**

```bash
git add user.css
git commit -m "refactor(css): update backdrop-filter to blur(20px) saturate(180%)"
```

---

### Task 6: Update hardcoded border-radius values

**Files:**
- Modify: `user.css`

Three hardcoded radius values that should use design tokens.

- [ ] **Step 1: Dialog border-radius (line ~160)**

Replace:
```css
  border-radius: 24px !important;
```
With:
```css
  border-radius: var(--radius-lg) !important;
```

- [ ] **Step 2: Search result option rows (line ~242)**

Replace:
```css
  border-radius: 10px;
```
With:
```css
  border-radius: var(--radius-sm);
```

- [ ] **Step 3: Keyboard shortcut chips (line ~255)**

Replace:
```css
  border-radius: 6px !important;
```
With:
```css
  border-radius: var(--radius-xs) !important;
```

- [ ] **Step 4: Apply**

```bash
spicetify apply
```

Expected: Search modal has 28px rounded corners, result rows have 12px, kbd chips have 8px.

- [ ] **Step 5: Commit**

```bash
git add user.css
git commit -m "refactor(css): replace hardcoded radii with design token variables"
```

---

### Task 7: Final verification — both schemes

- [ ] **Step 1: Test light scheme end-to-end**

```bash
spicetify config color_scheme suudLorLight && spicetify apply
```

Check in Spotify:
- Background is frost white (`#f5f5f7`) — no platinum/warm gray
- Play button and progress bar are electric green (`#00e676`)
- Search bar is frosted white glass with thick blur
- Search modal has 28px rounded corners
- No old green (`#1db954`) visible anywhere

- [ ] **Step 2: Test dark scheme end-to-end**

```bash
spicetify config color_scheme suudLorDark && spicetify apply
```

Check in Spotify:
- Background is near-black (`#0a0a0a`) — no dark green tint
- Surfaces are `#1c1c1e` gray, not green-tinted
- Play button and progress bar are electric green (`#00e676`)
- Glass surfaces have thick frost blur

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "refactor: complete Liquid Glass design system migration"
```
