# G.U.M Enterprises — Website

## Original Problem Statement
Change the background of the existing G.U.M Enterprises website to a cosmic galaxy theme — a deep-space visual filled with swirling nebulae, stars, and colorful clouds in shades of purple, pink, and blue.

## Architecture
- Static HTML/CSS/JS site (uploaded as GUM-WEBSITE.zip).
- Hosted through the frontend service: assets copied into `/app/frontend/public/` (Images, Prodcuts, videos, css, js) and the site markup lives in `/app/frontend/public/index.html`.
- React app (`/app/frontend/src/App.js`) intentionally renders `null` and mounts into a hidden `#root` div so it does not touch the static markup.
- Backend (FastAPI + MongoDB) is untouched from the initial scaffold.

## User Choices (this session)
- Animated cosmic galaxy background.
- Applied site-wide (all sections).
- Subtle dark overlays / glass panels retained for text readability.

## Implementation Log
- 2026-01: Added animated cosmic galaxy background (deep-space base + 4 drifting nebulae in purple/pink/blue/cyan + 3 parallax star fields with twinkle) via `/app/frontend/public/css/style.css`. Added `.cosmic-bg` markup with layered star/nebula divs in `index.html`. Neutralised the hero photo and old page-shell nebula overlays. Tinted glass panels violet and darkened nav/footer for readability. Respects `prefers-reduced-motion`.

## Verified
- Screenshots taken at hero, mid-page, brands, and products sections — cosmic theme visible everywhere, all copy readable, gold branding preserved.

## Backlog / Future Enhancements
- P2: Optional shooting-star sweep every ~15s for extra "wow".
- P2: Convert product cards to include real product images (Classic Smooth PB, Jaggery Peanuts).
- Business enhancement idea: add a "Notify Me" email capture for the "Coming Soon" products to build a launch waitlist and grow the marketing funnel.
