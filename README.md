# Aadarsh Portfolio

Static, data-driven portfolio site ready for Vercel.

## Edit Content

Update `portfolio-data.js` to change your headline, summary, social links, skills, projects, experience, certifications, and education.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:4173`.

## Build

```bash
npm run build
```

The deployable output is generated in `dist/`.

## Deploy on Vercel

Import this folder into Vercel. The included `vercel.json` uses:

- Build command: `npm run build`
- Output directory: `dist`

## Design notes

- `scene.js` draws the 3D glass emblem and particle field. It only loads on browsers with WebGL and when reduced motion is off; otherwise a lighter CSS emblem is shown. Phones get fewer particles.
- `vendor/three.module.js` is a trimmed, minified build of three.js (MIT). Regenerate it with the command in `scripts/three-entry.js` if `scene.js` needs more of the library.
- Fonts in `fonts/` (Silkscreen and JetBrains Mono) are self-hosted under the SIL Open Font License.
- The 3D scene loads after the page has finished loading, and only on devices with a graphics chip; others keep the CSS emblem.
- Photos are served as AVIF/WebP with a JPG fallback from `img/`. Icons live in `icons/`, `favicon.*` and `apple-touch-icon.png`; the share image is `og-image.jpg` (1200x630).
- `resume.pdf` is linked from the header, hero and contact section. Replace the file to update it.
- `vercel.json` adds cache headers for fonts, images and the 3D library, plus basic security headers. `404.html` is the not-found page.
