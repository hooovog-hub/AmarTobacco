# AMAR — Brand Website

Official website for **AMAR**, a premium Virginia blend cigarette brand.
B2B-focused brand site for importers, distributors and trade partners, built from the AMAR product presentation.

- **Live:** https://amartobacco.com
- **Languages:** English (`/`), Russian (`/ru/`), Armenian (`/hy/`)
- **Stack:** [Astro 7](https://astro.build) · TypeScript (strict) · vanilla CSS · Vercel

## Features

- Landing page that follows the presentation slide by slide: brand, blend, paper, filters,
  manufacturing, packaging, technical specifications, "Own your ritual", partnership
- **18+ age gate** (remembered for 30 days) and a "Smoking kills" health warning on every page
- Partner inquiry form → serverless function → email via [Resend](https://resend.com),
  with server-side validation, a honeypot and a time-to-fill check against spam
- Fully static pages (fast, cheap to host); only `/api/contact` runs on the server
- Optimized responsive images (AVIF/WebP via Vercel Image Optimization), self-hosted fonts
- SEO: per-locale titles/descriptions, canonical + `hreflang`, Open Graph image, sitemap, robots.txt
- Accessible: semantic HTML, skip link, keyboard-friendly dialog and menu, `prefers-reduced-motion`

## Getting started

Requires **Node.js 22+**.

```bash
npm install
cp .env.example .env   # optional: add RESEND_API_KEY to test real email sending
npm run dev            # http://localhost:4321
```

## Scripts

| Command            | What it does                                         |
| ------------------ | ---------------------------------------------------- |
| `npm run dev`      | Start the dev server                                 |
| `npm run build`    | Type-check (`astro check`) and build for Vercel      |
| `npm run preview`  | Preview the production build locally                 |
| `npm run lint`     | ESLint (TypeScript + Astro rules)                    |
| `npm run format`   | Format everything with Prettier                      |
| `npm run test`     | Unit tests (Vitest): form validation, translations   |
| `npm run validate` | Lint + format check + tests + build (run before PRs) |

## Project structure

```
src/
├── assets/
│   ├── brand/            # AMAR wordmark (SVG source)
│   └── images/           # Product & campaign photography (optimized at build/request time)
├── components/
│   ├── sections/         # Page sections (Hero, About, FeatureSection, Specs, Ritual, Partner)
│   ├── ui/               # Small building blocks (Wordmark, SectionBadge, SpecList)
│   ├── AgeGate.astro     # 18+ dialog
│   ├── ContactForm.astro # Partner inquiry form (client-side validation + fetch)
│   ├── Header.astro / Footer.astro / LanguageSwitcher.astro
├── config/site.ts        # Brand constants: domain, email, age settings, section ids
├── i18n/
│   ├── types.ts          # Dictionary interface — every locale must implement it
│   ├── locales/          # en.ts, ru.ts, hy.ts — ALL site copy lives here
│   └── index.ts          # Locale helpers (paths, rich text)
├── layouts/BaseLayout.astro  # <head>, SEO tags, fonts, age gate, header/footer
├── lib/contact.ts        # Inquiry validation + email template (shared by API and tests)
├── pages/                # Routes: /, /ru/, /hy/, /privacy, 404, /api/contact
├── styles/global.css     # Design tokens (colors, type, spacing) and base styles
└── views/                # Full page templates rendered once per locale
public/                   # Favicons, OG image, manifest, robots.txt
docs/                     # Design notes and deployment guide
```

## Editing content

All text is in `src/i18n/locales/{en,ru,hy}.ts`. The `Dictionary` type makes a missing key in
any language a compile error, and `npm run test` also checks that no string is empty.
Wrap words in `**double asterisks**` to make them bold in lead paragraphs.

Brand constants (email, domain, minimum age) are in `src/config/site.ts`.

## Environment variables

| Name                 | Required | Description                                                       |
| -------------------- | -------- | ----------------------------------------------------------------- |
| `RESEND_API_KEY`     | yes\*    | Resend API key. Without it the form politely asks users to email. |
| `CONTACT_TO_EMAIL`   | no       | Inbox for inquiries (default `amartobacco.arm@gmail.com`)         |
| `CONTACT_FROM_EMAIL` | no       | Sender; must be on a domain verified in Resend                    |

\* required in production for the form to deliver email.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
