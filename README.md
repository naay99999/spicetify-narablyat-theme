# narablyat Theme

A Spotify theme for Spicetify with a modern Liquid Glass design and soft platinum colors.

## Main Features

- Nothing ;)

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

## How to Customize

### Change Colors

Edit the `color.ini` file to change colors:

For example
```ini
[suudLor]
main               = e5e4e2    ; main background color
accent             = 1db954    ; accent color (Spotify green)
text               = 1a1a1a    ; text color
subtext            = 707070    ; secondary text color
```

Or edit CSS variables in `user.css` (lines 1-22):

```css
:root {
  --color-bg: #e5e4e2;        /* background color */
  --color-accent: #1db954;    /* accent color */
  --color-text: #1a1a1a;      /* text color */
  /* ... */
}
```

### Change Animation Speed

Edit the transition variables in `user.css` (lines 18-22):

```css
:root {
  --transition-fast: 0.15s ease;    /* fast */
  --transition-medium: 0.25s ease;  /* medium */
  --transition-slow: 0.4s ease;     /* slow */
}
```

### Change Glass Blur Amount

Find `backdrop-filter` in `user.css` and change the `blur()` value:

```css
backdrop-filter: blur(10px) saturate(120%);  /* increase/decrease blur */
```

### Change Corner Roundness

Edit the variables in `user.css` (lines 14-16):

```css
:root {
  --radius-sm: 6px;     /* small */
  --radius-md: 10px;    /* medium */
  --radius-lg: 16px;    /* large */
}
```

### Add Glass Effect to Other Parts

1. Open Spotify DevTools (Ctrl+Shift+I or Cmd+Opt+I)
2. Find the class name of the part you want to style
3. Add styles in `user.css` using this pattern:

```css
.your-class-name {
  background: rgba(229, 228, 226, 0.68) !important;
  border: 1px solid rgba(255, 255, 255, 0.35) !important;
  border-radius: var(--radius-lg) !important;
  backdrop-filter: blur(12px) saturate(120%) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
```

## Update Theme After Changes

Every time you change `user.css`, `theme.js`, or `color.ini`, you need to run:

```bash
spicetify apply
```

If that doesn't work, try this:

```bash
spicetify restore backup apply
```

## File Structure

```
narablyat/
├── user.css        # Main theme styles (Liquid Glass effects)
├── theme.js        # Script to add glass classes to elements
├── color.ini       # Spicetify color settings
├── manifest.json   # Theme information
└── README.md       # This file
```

## Tips

- Use Spotify DevTools to find class names for styling
- Test the theme after Spotify updates because the page structure may change
- Glass effects use `backdrop-filter` which can slow down older computers
- If your computer is slow, try reducing the blur values

## Common Problems

**Theme not loading:**
```bash
spicetify restore backup apply
```

**Colors not changing:**
- Make sure you edit both `color.ini` and CSS variables in `user.css`
- Run `spicetify apply` again

**Glass effect not showing:**
- Check if your browser supports `backdrop-filter`
- Try turning hardware acceleration off and on again

## License

Free use jaa :3

## Credits

- Uses [Spicetify](https://spicetify.app/) framework
- Design inspired by macOS and Glassmorphism design trends
