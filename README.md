# narablyat Theme

A Spotify theme for Spicetify with a Liquid Glass design inspired by Apple — frosted surfaces, rounded corners, and a forest-green accent.

## Main Features

- Frosted glass surfaces across a five-level elevation scale (nav bar and chips up to the floating player bar) — see [`docs/design-spec.md`](./docs/design-spec.md#44-elevation-scale) for the full blur/saturate table
- Two color schemes: `suudLorLight` (frost white) and `suudLorDark` (dark neutral)
- Forest-green accent (`#16a34a`) on play controls and interactive elements
- Apple squircle corner radius scale (8px → 32px)
- No hover states outside dense list rows — focus and active states only

## How to Install

### What You Need

You need to install [Spicetify](https://spicetify.app/) first.

### Installation Steps

1. **Download this theme** to your Spicetify themes folder:
   ```bash
   cd ~/.config/spicetify/Themes
   git clone <repository-url> narablyat
   ```

   Or copy the `narablyat` folder to `~/.config/spicetify/Themes/`

2. **Turn on the theme:**
   ```bash
   spicetify config current_theme narablyat
   spicetify config color_scheme suudLorDark
   spicetify apply
   ```

3. **Open Spotify** - The theme will load automatically

## Color Schemes

### suudLorLight — Frost White
Clean, bright, Apple-inspired white glass.
```bash
spicetify config color_scheme suudLorLight && spicetify apply
```

### suudLorDark — Dark Neutral
Near-black surfaces with forest-green accent, like macOS dark mode.
```bash
spicetify config color_scheme suudLorDark && spicetify apply
```

## How to Customize

### Change Colors

Edit `color.ini` to change the color scheme values. Key properties:

```ini
[suudLorLight]
main               = fafafa    ; base background (frost white)
accent             = 16a34a    ; forest-green accent
text               = 111111    ; primary text
subtext            = 5f5f5f    ; secondary text

[suudLorDark]
main               = 0a0a0a    ; base background (near-black)
accent             = 16a34a    ; forest-green accent
text               = f5f5f7    ; primary text
subtext            = 8e8e93    ; secondary text
```

`color.ini` values feed Spicetify's `--spice-*` variables, which the accent ramp and surface tokens in `user.css` are built from — see [`docs/design-spec.md`](./docs/design-spec.md#4-token-architecture) (`--accent`, `--accent-a08`…`--accent-a75` and `--surface-input`…`--surface-popover`). Change `color.ini` first; only touch the derived tokens in `user.css` if you want a relationship between accent and surfaces to work differently than the spec.

### Change Glass Effect

The blur/saturate pair for each surface is a token, not a literal — the TOKENS section at the top of `user.css` defines `--glass-blur-1`/`--glass-sat-1` through `--glass-blur-5`/`--glass-sat-5`, one pair per elevation level (nav bar and chips at the low end, the floating player bar at the top). Adjust a level's values there and every surface at that level updates together. The full level-to-surface mapping is in [`docs/design-spec.md`](./docs/design-spec.md#44-elevation-scale) (section 4.4).

Glass surface opacity is a separate set of tokens (`--surface-input`, `--surface-chip`, `--surface-modal`, `--surface-panel`, `--surface-popover`, `--surface-solid`), also in the TOKENS section — see section 4.2 of the spec for what each one is used for.

### Change Corner Roundness

Edit the radius variables in the TOKENS section at the top of `user.css`:

```css
:root {
  --radius-xs: 8px;      /* badge, kbd */
  --radius-sm: 12px;     /* list row, menu item, input */
  --radius-md: 20px;     /* card, panel, menu */
  --radius-lg: 28px;     /* modal, floating player */
  --radius-xl: 32px;     /* large container */
  --radius-full: 9999px; /* pills, circular buttons */
}
```

### Change Animation Speed

Edit the transition variables in `user.css`:

```css
:root {
  --transition-fast: 0.15s ease;
  --transition-medium: 0.25s ease;
  --transition-slow: 0.4s ease;
}
```

### Add Glass Effect to Other Parts

1. Open Spotify DevTools (Cmd+Opt+I on Mac, Ctrl+Shift+I on Windows)
2. Find the class name of the part you want to style
3. Add styles in `user.css` using this pattern:

```css
.your-class-name {
  background: rgba(255, 255, 255, 0.72) !important;       /* light mode */
  /* background: rgba(28, 28, 30, 0.72) !important; */    /* dark mode */
  border: 1px solid rgba(255, 255, 255, 0.40) !important;
  border-radius: var(--radius-md) !important;
  backdrop-filter: blur(var(--glass-blur-2)) saturate(var(--glass-sat-2)) !important; /* pick a level from the elevation scale */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.60) !important;
}
```

## Update Theme After Changes

Every time you change `user.css`, `theme.js`, or `color.ini`, run:

```bash
spicetify apply
```

If that doesn't work:

```bash
spicetify restore backup apply
```

## File Structure

```
narablyat/
├── user.css        # Main theme styles (Liquid Glass effects)
├── theme.js        # Script to add glass classes to elements
├── color.ini       # Color schemes (suudLorLight, suudLorDark)
├── manifest.json   # Theme information
└── README.md       # This file
```

## Tips

- Use Spotify DevTools to find class names for styling
- Test the theme after Spotify updates — class names may change
- Glass effects use `backdrop-filter` which can slow down older computers
- If your computer is slow, reduce the blur value (e.g. `blur(10px)`)
- Prefer `data-testid` and `aria-label` selectors over hashed class names

## Common Problems

**Theme not loading:**
```bash
spicetify restore backup apply
```

**Colors not changing:**
- Edit both `color.ini` and CSS variables in `user.css`
- Run `spicetify apply` again

**Glass effect not showing:**
- Check if your browser supports `backdrop-filter`
- Try toggling hardware acceleration in Spotify settings

## License

Free use jaa :3

## Credits

- Uses [Spicetify](https://spicetify.app/) framework
- Design inspired by Apple's Liquid Glass aesthetic
