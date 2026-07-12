# UI Fix Guidelines

**Date:** 2026-05-22  
**Scope:** Light theme UI refinement after Spotify XPUI source inspection  
**Primary files:** `user.css`, `theme.js`

> **Historical document.** This is a research writeup from the initial UI fix pass. It is superseded by [`docs/design-spec.md`](./design-spec.md) for anything normative — colors, blur levels, hover policy, tokens. If this document and the spec ever disagree, the spec wins. The XPUI source-inspection notes below (file locations, selector stability notes) remain useful reference material and are kept as-is.

## Source Inspection Notes

Do not rely on `xpui.app.spotify.com` as the source endpoint. The useful XPUI files are bundled locally in the Spotify app:

```text
/Applications/Spotify.app/Contents/Resources/Apps/xpui
```

Relevant files observed:

- `xpui-snapshot.css` contains root layout, sidebars, player bar, Encore base styles, and global route CSS.
- `xpui-modules.js` contains the lyrics module implementation used by `xpui-routes-lyrics.js`.
- `dwp-now-playing-bar.css` contains player bar controls, progress bars, volume, and now-playing widget styles.
- `xpui-routes-lyrics.js` is only a small route wrapper; the real lyrics component is in `xpui-modules.js`.

Prefer stable selectors from XPUI and Spicetify:

- Stable: `.Root__now-playing-bar`, `.Root__nav-bar`, `.Root__right-sidebar`, `.lyrics-lyrics-container`, `.lyrics-lyrics-background`, `.lyrics-lyrics-contentContainer`, `.lyrics-lyrics-contentWrapper`
- Stable enough: `data-testid`, `aria-*`, `role`, `.main-*`, `.x-*`
- Fragile: hashed classes such as `.HFowbNOgNPgtZSE4`, `.pH4ZUdfvwTB_sRS_.ubsAl0Z3N0XZgmhy`

Only use hashed classes when no stable selector exists, and add a comment explaining what the selector targets.

## Visual Priorities

1. Keep the Liquid Glass system cohesive across center content, side panels, and player controls.
2. Keep electric green functional only: active states, progress, confirmed toggles, and primary play.
3. Avoid broad hover styling. Use focus, active, checked, selected, and current states.
4. Make surfaces read as glass by giving them visible tint, border, and background variation.
5. Keep lyrics readable, but prevent the lyrics route from overpowering the whole layout.

## Recommended Fix Areas

### 1. Lyrics Route

Current issue: the lyrics panel can become a large opaque color block because Spotify sets dynamic colors through CSS variables.

Source behavior:

- Container: `.lyrics-lyrics-container`
- Background layer: `.lyrics-lyrics-background`
- Content wrapper: `.lyrics-lyrics-contentContainer .lyrics-lyrics-contentWrapper`
- Spotify variable: `--lyrics-color-background`

Recommended approach:

- Override `--lyrics-color-background` on `.lyrics-lyrics-container`, not on hashed classes.
- Keep text colors from Spotify when possible so album-aware contrast still works.
- Add a glass overlay or toned background that reduces hard saturation.
- Keep the lyrics content width and type scale intact unless there is a real readability issue.

Example direction:

```css
.lyrics-lyrics-container {
  --lyrics-color-background: color-mix(in srgb, var(--spice-card, #ffffff) 72%, rgba(120, 24, 24, 0.22)) !important;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.lyrics-lyrics-background {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04)),
    var(--lyrics-color-background) !important;
  backdrop-filter: blur(18px) saturate(160%);
}
```

Avoid forcing lyrics text to green. Lyrics should remain content-first and should not compete with player controls.

### 2. Right Sidebar / Queue Panel

Current issue: the right panel can look too flat and some secondary text can become too faint.

Source behavior:

- Root grid area: `.Root__right-sidebar`
- Current theme target: `[data-testid="right-sidebar"]`

Recommended approach:

- Target both selectors together.
- Increase panel boundary subtly with a left border and low-opacity shadow.
- Keep panel background translucent, but do not make it so transparent that queue text fades.
- Set text variables inside the panel only if Spotify's inherited colors are too weak.

Example direction:

```css
.Root__right-sidebar,
[data-testid="right-sidebar"] {
  background: color-mix(in srgb, var(--spice-card, #ffffff) 78%, transparent) !important;
  border-left: 1px solid rgba(0, 0, 0, 0.10) !important;
  box-shadow: -6px 0 18px rgba(0, 0, 0, 0.06) !important;
  backdrop-filter: blur(18px) saturate(155%) !important;
}
```

If upper informational text is still too faint, adjust only scoped text colors:

```css
.Root__right-sidebar {
  --text-subdued: color-mix(in srgb, var(--spice-text, #111111) 58%, transparent);
}
```

### 3. Player Controls Accent

Current issue: too many player icons become green because the selector is broad.

Current theme rule:

```css
.player-controls [data-encore-id="buttonTertiary"],
.main-nowPlayingBar-container [data-encore-id="buttonTertiary"] {
  color: var(--color-accent) !important;
}
```

Recommended approach:

- Default tertiary controls should be neutral.
- Use green only for active/toggled states and the primary play button.
- Preserve active dots and progress fill as functional indicators.

Example direction:

```css
.player-controls [data-encore-id="buttonTertiary"],
.main-nowPlayingBar-container [data-encore-id="buttonTertiary"] {
  color: var(--ui-subtext) !important;
}

.main-genericButton-button.main-genericButton-buttonActive,
.player-controls [aria-checked="true"],
.main-nowPlayingBar-container [aria-checked="true"] {
  color: var(--ui-accent) !important;
}
```

Do not remove green from the play button or playback progress unless the design direction changes.

### 4. Floating Now-Playing Bar

Current issue: the floating player bar is visually strong. It works as a signature element, but can compete with the main content.

Current theme target:

- `.Root__now-playing-bar`
- `.Root__main-view` clearance padding

Recommended approach:

- Keep the floating pill.
- Slightly reduce visual weight before changing layout behavior.
- Tune shadow, radius, and bottom clearance together.

Suggested tuning range:

- `bottom`: 12px to 16px
- `left/right`: 12px to 16px
- `border-radius`: 22px to 28px
- `box-shadow`: reduce opacity before reducing blur
- `.Root__main-view` padding-bottom: match actual bar footprint plus clearance

Avoid lowering `z-index` unless overlap behavior is confirmed in Spotify.

### 5. Sidebar Glass

Current issue: the left library panel can still read as a flat white block.

Current theme target:

- `.Root__nav-bar`

Recommended approach:

- Keep the existing stable selector.
- Increase tint or boundary, not just blur. Blur is invisible when the background behind it has low variation.
- Avoid overusing green in list rows.

Example direction:

```css
.Root__nav-bar {
  background: color-mix(in srgb, rgba(230, 225, 248, 1) 24%, var(--spice-card, #ffffff)) !important;
  border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
}
```

## Validation Checklist

After changes, run:

```bash
spicetify apply
spicetify config color_scheme suudLorDark && spicetify apply
spicetify config color_scheme suudLorLight && spicetify apply
```

Manual checks:

- Lyrics route: background is not an opaque color block; lyrics stay readable.
- Queue/right sidebar: headings, secondary text, and list rows are readable.
- Player controls: inactive icons are neutral; active controls and progress are green.
- Now-playing bar: still floats, does not hide content, and does not feel oversized.
- Left sidebar: has subtle depth without looking purple-heavy.
- Search modal and topbar search still use the existing glass classes from `theme.js`.
- Context menus still render above glass overlays and remain readable.

Use Spotify DevTools to confirm selectors still match after Spotify updates.

## Implementation Notes

- Keep edits grouped by component section in `user.css`.
- Prefer custom properties and `color-mix()` over repeated hardcoded colors.
- Do not add broad global rules for `button`, `a`, `input`, or `svg`.
- Do not introduce new runtime DOM mutations in `theme.js` unless CSS selectors cannot target the element reliably.
- If a hashed selector is added, include a short comment with the UI element it targets and why a stable selector was not available.
