# ABCN Studios Website

Marketing site for ABCN Studios — built with [Astro](https://astro.build), deployed to GitHub Pages at [abcnstudios.com](https://abcnstudios.com).

## Getting started

```bash
npm install       # install dependencies (only needed once, or after pulling new changes)
npm run dev        # start local dev server at http://localhost:4321, live-reloads on save
npm run build       # build the production site into dist/
npm run preview      # serve the built dist/ folder locally, to sanity-check a production build
```

Requires Node.js `>=22.12.0` (see `package.json` → `engines`).

Pushing to `master` on GitHub triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages automatically. No manual deploy step.

## Project structure

```
src/
  pages/                 one file = one route (index.astro → "/", about.astro → "/about/", etc.)
  layouts/                shared page shells (BaseLayout = every page, GamePageLayout = game detail pages)
  components/
    nav/                   site nav + footer
    sections/               reusable content blocks (Hero, WavyBox, Gallery, StoreLinks, ...)
    decor/                   leaves, twigs, placeholder boxes
    icons/                   small inline SVG icons (bonfire, etc.)
  content/games/           game data — see "Editing game content" below
  content.config.ts         schema for the fields allowed in content/games/*.json
  data/site.ts              nav links, site tagline, footer contact info
  styles/tokens.css          every color and font used on the site, as CSS variables
  styles/global.css          base resets and typography
  assets/logo/                the source logo file (auto-optimized by Astro wherever it's used)
public/                    static files served as-is at the same path (images, favicon, CNAME)
```

## Editing game content

Each game is one JSON file:
- `src/content/games/tropicards.json`
- `src/content/games/buggy-rescue.json`

Fields (all plain text/JSON, no code involved):

| Field | Used for |
|---|---|
| `title` | Game name, shown as the page heading |
| `tagline` | Short line shown inside the hero image box until a real `heroImage` is set |
| `summary` | Paragraph shown under the hero |
| `platform` | `"multi"` or `"mobile"` — just changes the wording of the store-links heading |
| `heroImage` | Path to the game's logo/key art (see "Adding images") |
| `screenshots` | Array of image paths for the screenshot carousel |
| `storeLinks.playStore` / `.appStore` | Store URLs — omit either one to show a "Coming Soon" badge instead |
| `devNotes` | Array of `{ image, caption }` for the "Development" section |
| `suits` | Tropicards only — array of `{ name, description, image }`, up to 4; any left out show as "Coming soon" |

Schema/validation lives in `src/content.config.ts` if a field ever needs to change shape.

## Adding images

Drop files directly into these folders (already created, empty), then reference them by path in the matching JSON file:

```
public/games/tropicards/                 →  src/content/games/tropicards.json
public/games/tropicards/screenshots/
public/games/tropicards/dev/
public/games/tropicards/suits/
public/games/buggy-rescue/                →  src/content/games/buggy-rescue.json
public/games/buggy-rescue/screenshots/
public/games/buggy-rescue/dev/
```

Reference them with a leading slash, e.g.:
```json
"heroImage": "/games/tropicards/logo.png",
"screenshots": ["/games/tropicards/screenshots/shot-1.jpg"],
"devNotes": [{ "image": "/games/tropicards/dev/sketch-1.jpg", "caption": "Early sketch" }]
```
No build step needed — anything in `public/` is served exactly as-is.

## Changing fonts

Three variables in `src/styles/tokens.css` control every font on the site:

```css
--font-display: 'Iceberg', system-ui, sans-serif;   /* headings, nav menu items, footer contact details */
--font-body: 'Exo 2', system-ui, sans-serif;         /* everything else */
--font-tagline: 'Ruthie', var(--font-display);       /* homepage tagline only */
```

The actual font files are loaded once, in `src/layouts/BaseLayout.astro`, as a list of `import '@fontsource/<name>/400.css'` lines near the top.

**To use a new font:**
1. Find it on [fonts.google.com](https://fonts.google.com), note its exact name.
2. `npm install @fontsource/<name-in-lowercase-with-hyphens>` (e.g. "Titan One" → `@fontsource/titan-one`).
3. Check what weights it ships: `ls node_modules/@fontsource/<name>/*.css` — most display fonts only have `400.css`.
4. Add `import '@fontsource/<name>/<weight>.css';` to `BaseLayout.astro`.
5. Point the relevant token in `tokens.css` at it, e.g. `--font-tagline: 'Titan One', var(--font-display);`.

Font names must match exactly what the package declares — check with `grep font-family node_modules/@fontsource/<name>/400.css` if unsure.

**Fonts currently installed but not wired to any token** (loaded and ready to use — just point a token at one, or use `font-family: 'Name'` directly in any component's `<style>` block): Henny Penny, Bubblegum Sans, Fleur De Leah, Love Light, Puppies Play, Updock, Estonia, Ruthie, Princess Sofia. Most of these are delicate script/handwritten styles — check legibility at the size you actually use them.

**Fonts we tried for the tagline and removed** (evaluated against the logo's bold graffiti-spike lettering, then uninstalled since they weren't picked — reinstall with `npm install @fontsource/<name>` if you want to reconsider one): Bungee (bold poster/condensed — the original placeholder pick), Bungee Shade (Bungee with a layered outline effect), Climate Crisis (bold rounded, variable font, "protest sign" energy), Rubik Wet Paint (same rounded base with a dripping-paint effect), Titan One (playful bold rounded, no spikes), Knewave (soft rounded hand-marker style, too blobby), Bagel Fat One (Korean-first bubble font, wrong fit). **New Rocker** was the closest structural match to the logo's sharp angular terminals and was applied — but the tagline is currently set to **Ruthie** (a cursive script), so that was changed again since.

**One thing to watch:** the tagline is forced to a single line (`white-space: nowrap` in `src/components/sections/Hero.astro`, near the `.tagline` font-size). If a new font is much wider than the current one, it can overflow on narrow phone screens — test at a narrow browser width after changing it. The `font-size: clamp(min, preferred, max)` right above it controls sizing; lower the `min` (first value) if it overflows, or raise the `max` (third value) to make it bigger everywhere.

## Changing colors

Every color on the site is a CSS variable in `src/styles/tokens.css`:

```css
/* Site chrome — black & white theme */
--color-ink: #121212;      /* primary text, borders/outlines, dark section backgrounds (footer, WavyBox borders) */
--color-paper: #ffffff;     /* page background, white box tone */
--color-mist: #f2f2f2;      /* light gray tint, box backgrounds */
--color-cloud: #e3e3e3;      /* slightly deeper gray tint, box backgrounds / dividers */
--color-gray: #737373;       /* muted text — placeholder labels, captions */

/* Logo palette — reserved for decorative accents (leaves, twigs), not site chrome */
--logo-teal-dark: #033c42;
--logo-turquoise: #09f0cd;
--logo-yellow: #fff507;
--logo-orange: #ff8215;
--logo-green: #94cc03;
--logo-brown: #7a4a1e;
--logo-olive: #4a5a1e;
```

Editing one of these updates it **everywhere it's used on the site**, since every component references the variable, not a hardcoded color.

**Example — the About page card border:** that thick black outline around the rounded box is set in `src/components/sections/WavyBox.astro`:
```css
.wavy-box {
  border: var(--border-thick) solid var(--color-ink);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-ink);
}
```
It uses `--color-ink`, the same variable used for all text and every other box's border/shadow site-wide. Two ways to change it:
- **Change it everywhere:** edit `--color-ink` in `tokens.css`. Affects every WavyBox border, all body text color, nav border, etc.
- **Change just the About page's box:** in `src/pages/about.astro`, add a CSS override targeting its box specifically (it already has a `class="about-box"` hook for this):
  ```css
  .about :global(.about-box) {
    border-color: var(--logo-green); /* or any color/hex you want */
  }
  ```
  (The `box-shadow` is separate from `border` — override that too if you want the drop-shadow to match.)

## Deployment

- Hosted on **GitHub Pages**, custom domain **abcnstudios.com** (see `public/CNAME`).
- `astro.config.mjs` sets `site` to the production URL; `trailingSlash: 'always'` keeps URLs consistent.
- `.github/workflows/deploy.yml` builds and deploys on every push to `master`. It pins Node 22 explicitly (`withastro/action` defaults to Node 20, which is too old for this Astro version).
- One-time manual setup already done: GitHub repo Settings → Pages → Source set to "GitHub Actions"; custom domain + DNS pointed at GitHub Pages.
