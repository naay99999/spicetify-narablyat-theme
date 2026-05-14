# narablyat Theme

A Spotify theme for Spicetify with a Liquid Glass design inspired by Apple — frosted surfaces, rounded corners, and electric green accent.

## Main Features

- Frosted glass surfaces with `blur(20px) saturate(180%)`
- Two color schemes: `suudLorLight` (frost white) and `suudLorDark` (dark neutral)
- Electric mint-green accent (`#00e676`) on play controls and interactive elements
- Apple squircle corner radius scale (8px → 32px)
- No hover states — focus and active states only

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
Near-black surfaces with electric green accent, like macOS dark mode.
```bash
spicetify config color_scheme suudLorDark && spicetify apply
```

## How to Customize

### Change Colors

Edit `color.ini` to change the color scheme values. Key properties:

```ini
[suudLorLight]
main               = f5f5f7    ; base background (frost white)
accent             = 00e676    ; electric mint-green accent
text               = 1d1d1f    ; primary text
subtext            = 6e6e73    ; secondary text

[suudLorDark]
main               = 0a0a0a    ; base background (near-black)
accent             = 00e676    ; electric mint-green accent
text               = f5f5f7    ; primary text
subtext            = 8e8e93    ; secondary text
```

Or edit CSS variables directly in `user.css` (lines 1–24):

```css
:root {
  --color-bg: #f5f5f7;
  --color-accent: #00e676;
  --color-text: #1d1d1f;
}
```

### Change Glass Effect

Find `backdrop-filter` in `user.css` and adjust the values:

```css
backdrop-filter: blur(20px) saturate(180%);  /* increase/decrease blur */
```

Or adjust glass surface opacity via the glass variables (lines 41–51):

```css
:root {
  --glass-surface: rgba(255, 255, 255, 0.72);  /* light mode glass opacity */
  --glass-ink: rgba(28, 28, 30, 0.72);          /* dark input inside glass */
}
```

### Change Corner Roundness

Edit the radius variables in `user.css` (lines 14–18):

```css
:root {
  --radius-xs: 8px;    /* badge, chip */
  --radius-sm: 12px;   /* button, input */
  --radius-md: 20px;   /* card, panel */
  --radius-lg: 28px;   /* modal, dialog */
  --radius-xl: 32px;   /* large container */
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
  backdrop-filter: blur(20px) saturate(180%) !important;
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
