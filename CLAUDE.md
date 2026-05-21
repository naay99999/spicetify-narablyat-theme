# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Spicetify theme for Spotify called **narablyat**, built around a "Liquid Glass" aesthetic with soft platinum colors. There is no build system — changes are applied directly via the Spicetify CLI.

## Applying Changes

After editing any file, apply to Spotify:

```bash
spicetify apply
```

If that doesn't work:

```bash
spicetify restore backup apply
```

To switch color schemes:

```bash
spicetify config color_scheme suudLorDark   # dark green-tinted scheme
spicetify config color_scheme suudLorLight  # soft platinum scheme
spicetify apply
```

## Finding Spotify Class Names

Open Spotify DevTools (Cmd+Opt+I on Mac, Ctrl+Shift+I on Windows) to inspect elements and find the class names to target in `user.css`.

## Architecture

**`user.css`** — All visual styling. Structured in sections:
- CSS custom properties at `:root` (colors, radii, transitions, glass variables, search variables)
- Topbar search (`spice-glass-topbar`) — pill-shaped glass container
- Modal search dialog (`spice-glass-dialog`) — frosted glass card with animated accent blob
- Progress/volume bars — accent-colored with rounded rails
- Now-playing bar — blurred backdrop
- Ambient background blobs (`spice-ambient-blob-1/2`) — fixed positioned blurs behind all content

**`theme.js`** — Two IIFEs that run at Spotify startup:
1. **Glass class injector** — `MutationObserver` watches the DOM and adds `spice-glass-overlay`, `spice-glass-dialog`, `spice-glass-inputWrap`, `spice-glass-topbar` to Spotify's dynamically rendered elements.
2. **Ambient blob injector** — One-time, idempotent injection of `<div class="spice-ambient-blob-1">` and `<div class="spice-ambient-blob-2">` into `<body>`. These provide the background layer that glass surfaces blur against.

**`color.ini`** — Two color schemes: `suudLorLight` (platinum) and `suudLorDark` (deep green). Variables here map to Spicetify's `--spice-*` CSS variables.

**`manifest.json`** — Declares the theme name, which files it uses, and available schemes.

## Glass Effect Pattern

The Liquid Glass effect requires three layers working together:
1. `backdrop-filter: blur(Xpx) saturate(180%)` on the element
2. Semi-transparent `background: rgba(...)` so the blur shows through
3. `::before` / `::after` pseudo-elements for the highlight streak and accent blob

**Blur depth hierarchy** — blur intensity maps to surface elevation:
- Cards and panels: `blur(16px)`
- Topbar and modal dialog: `blur(24px)`

Hover states are intentionally removed throughout — the design uses focus and active states only.

## CSS Conventions

- 2-space indentation
- CSS custom properties in `:root` for all design tokens (colors, radii, transitions, glass values) — no hardcoded repeated values
- Sections separated by short comments matching the existing style (e.g. `/* Topbar Search: Liquid Glass pill */`)
- Classes added by `theme.js` use the `spice-glass-*` prefix; ambient background elements use `spice-ambient-blob-*`

## Targeting Spotify's Obfuscated Classes

Spotify uses hashed class names (e.g. `Ckze8wMFNiDXk_f1IqjJ`) that can change after updates. Prefer `data-testid`, `aria-label`, `role`, and Spicetify's stable class patterns (`main-*`, `x-*`) over hashed names. When a hashed name is unavoidable, note it in a comment.

## Manual Testing Checklist

After `spicetify apply`, verify in both `suudLorLight` and `suudLorDark`:
- Search modal (open with Cmd+K) — glass card, animated accent blob, input wrap
- Topbar inline search — pill shape, focus ring, icon color change
- Now-playing bar — blur and controls
- Progress and volume bars — accent color, rounded rails
- Sidebar and cards — blur depth, border radius
- Context menus and filter chips — glass treatment

## Commit Style

Conventional Commits with component scopes: `fix(glass): ...`, `feat(css): ...`, `refactor(theme): ...`, `docs(readme): ...`. Subjects are imperative.
