# G.U.M Enterprises — Website

## Original Problem Statement
Change the background of the existing G.U.M Enterprises website to a cosmic galaxy theme.
Follow-up requests:
- Add shooting-star sweep animation.
- Add a Milky Way band.
- Increase falling-star frequency (~every 5s).
- Apply user-supplied cosmic-galaxy PNG as the actual background.
- Build a prominent Catalogue section (Products / Videos / Recipes) so clients see products first, and make it easy to add media going forward.

## Architecture
- Static HTML/CSS/JS site (uploaded as GUM-WEBSITE.zip).
- Hosted via the frontend service — assets in `/app/frontend/public/`, markup in `/app/frontend/public/index.html`.
- React `App.js` renders `null`; static HTML is served directly.
- Backend (FastAPI + MongoDB) untouched from the initial scaffold.

## Session Log
- **2026-01** Applied animated cosmic galaxy background site-wide (deep-space base + 4 nebulae + 3 parallax star fields + Milky Way band).
- **2026-01** Added shooting-star sweep — grew to 8 stars on a 40 s loop, staggered 5 s apart.
- **2026-01** Replaced CSS-generated sky with user-supplied cosmic galaxy PNG (`/Images/cosmic-galaxy-bg.png`) using `background-attachment: fixed` for cinematic parallax. CSS Milky Way + nebulae hidden; shooting stars kept for motion.
- **2026-01** Added **Catalogue** section (right after hero) with **Products / Videos / Recipes** tabs. Fully data-driven from `/catalogue.json`. Non-technical updates: drop media into `/catalogue/media/` and edit `/catalogue.json`. Full instructions in `/catalogue/README.txt`. Added "Catalogue" nav link.

## Files Added / Touched
- `/app/frontend/public/catalogue.json` — the single source of truth for catalogue content.
- `/app/frontend/public/catalogue/README.txt` — plain-English instructions for the client.
- `/app/frontend/public/catalogue/media/` — folder to drop images / MP4s / posters.
- `/app/frontend/public/index.html` — catalogue section markup + nav link.
- `/app/frontend/public/css/style.css` — catalogue styles (tabs, cards, badges, empty states).
- `/app/frontend/public/js/script.js` — catalogue renderer (fetch + render + tab switching).
- `/app/frontend/public/Images/cosmic-galaxy-bg.png` — background artwork.

## Verified
- Screenshots taken for Products / Videos / Recipes tabs — 4 product cards, 1 video empty state, 1 recipe. Tab switching works. Galaxy background visible behind everything.

## Backlog / Ideas
- P2: Auto-play muted product videos as hero cards on hover.
- P2: Lightbox for enlarged recipe/product images.
- P2: Filter / search inside catalogue when catalogue grows large.
- Business idea: "Notify Me on Launch" email capture on Soon-tagged products to build a launch waitlist.
