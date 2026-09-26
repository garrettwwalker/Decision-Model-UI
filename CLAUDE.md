# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Daybreak** is a static design preview (no backend, no build step, no tests) for a decision-intelligence portal that predicts geopolitical events for clients in the maritime supply chain. The tagline is "Wake up to risk before the world does".

- `index.html` is the marketing/landing page. Its sections are `#platform`, `#predictions`, `#maritime` and `#request-access`.
- `executive.html`, `analyst.html` and `workbench.html` are the three insight tiers ("Executive Brief", "Analyst Console", "Quant Workbench"). They share a console shell, and a tier-switcher links them to each other.
- All four pages share one stylesheet (`assets/css/styles.css`) and one script (`assets/js/main.js`). The page text is illustrative placeholder content.

## Running locally

Serve the directory over HTTP instead of opening the files directly. When the user tried to open `index.html` from the browser address bar, it went to a search engine instead.

```
python3 -m http.server 8734
# http://localhost:8734/index.html
```

There is no linter or test suite. After editing, check that tags and braces are balanced and that the server still returns 200 for each page.

## Git workflow

Commit completed changes and push them to GitHub (`origin`, https://github.com/garrettwwalker/Decision-Model-UI, branch `main`). Make one focused commit per logical change. Don't let work pile up uncommitted.

- Write clean, conventional commit messages: a short imperative subject line (about 50 characters or fewer, e.g. "Tighten radar blip reveal timing"), optionally followed by a blank line and a brief body explaining *why*.
- Push after each commit (`git push origin main`).
- While the user is still iterating on a change (e.g. tweaking an animation), commit once they're happy with it rather than on every intermediate attempt.

## Architecture notes

- **main.js is shared and opt-in by markup.** Every `init*` function runs on every page and returns early if its hook elements are missing. Features attach through data attributes:
  - `[data-nav]`: active nav link
  - `[data-coeff]`, `[data-weight]`, `[data-suffix]` and `[data-composite-score]`: workbench sliders that compute a weighted composite score
  - `[data-chat-input]`, `[data-chip]`, `[data-chat-send]` and `[data-chat-scroll]`: the read-only chat demo in the analyst console
  - `[data-year]`: footer year

  To add behavior, add a guarded `init*` function and markup hooks. Don't write per-page scripts.
- **Design tokens** are CSS custom properties on `:root` in `styles.css`. Use them rather than raw hex values:
  - palette: `--gold`, `--coral`, `--rose`, `--ink`, `--dusk`, `--cream`
  - gradients: `--sunset`, `--night-sky`
  - radii
  - fonts: Space Grotesk for display, Manrope for body text, IBM Plex Mono for mono, all loaded from Google Fonts

  `styles.css` is organized into commented sections: nav, hero, sections, cards, console shell, per-tier sections, and responsive rules at the end.
- **Nav scroll state:** the nav is transparent at the top of the page so the hero's sunset gradient runs up to the top edge. `.site-nav.scrolled` (added after about 8px of scroll) switches on the translucent, blurred banner. Don't give the unscrolled nav a background.

### Hero radar map (index.html)

The hero map took many iterations to get right, so change it carefully:

- The map is a real-coastline SVG (`viewBox="0 0 100 39.1667"`, `preserveAspectRatio="xMidYMid meet"`), letterboxed inside a `.map-panel` with `aspect-ratio: 16/11`. Keep the map at its true proportions. Don't stretch it to fill the panel, and don't narrow the panel to fit the map.
- `.map-sweep` is a horizontal beam that moves left to right. It has a solid gold (`#F5A83C`, the logo's orange) leading edge with a fading trail behind it, runs on an 11s CSS loop (`map-sweep-move`), and fades out off the right edge before it restarts.
- Blips (`.map-blip`) don't animate on their own. Each cycle, `initMapReveal()` picks a random subset (`APPEAR_CHANCE`). It reveals each chosen blip at `--t * SWEEP_MS + REVEAL_LAG_MS` by toggling `.is-revealed`. `--t` is the point in the cycle, as a fraction, when the beam's leading edge reaches that blip.
- `SWEEP_MS` in JS must match the CSS animation duration. If you change the sweep keyframes or duration, or move a blip, recompute that blip's `--t`. The user wants blips to appear just as the beam passes (currently `REVEAL_LAG_MS = 30`).

## Brand preferences from the user

- Logo: a simple circle filled with the gold→rose gradient (`#F5A83C` → `#D9486B`), with nothing inside it. It's used for the favicon and for `.brand-mark` in the nav on every page.
- The user rejected hero visuals that are heavy on numbers or abstract. For the map, they rejected circles standing in for landmasses.
