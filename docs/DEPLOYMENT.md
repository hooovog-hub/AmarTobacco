# Deployment (Vercel)

The project uses the `@astrojs/vercel` adapter: all pages are pre-rendered static HTML and
`/api/contact` is deployed as a serverless function. `vercel.json` adds security headers and
long-term caching for hashed assets.

## 1. First deploy

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project → Import** the repository. The Astro preset is detected
   automatically (build command `npm run build`, no output directory to set).
3. Add environment variables (Project → Settings → Environment Variables), for **Production** and
   **Preview**:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` (optional)
   - `CONTACT_FROM_EMAIL` (optional, see step 3)
4. Deploy. Every push to `main` deploys to production; every other branch/PR gets a preview URL.

## 2. Domain

Project → Settings → Domains → add `amartobacco.com` and `www.amartobacco.com`
(redirect `www` → apex). Update DNS at the registrar as Vercel instructs.

## 3. Email delivery (Resend)

1. Create an account at https://resend.com and an API key → `RESEND_API_KEY`.
2. Add and verify the domain `amartobacco.com` in Resend (DNS records: SPF/DKIM).
3. Set `CONTACT_FROM_EMAIL="AMAR <noreply@amartobacco.com>"`.

Until the domain is verified, the default sender `onboarding@resend.dev` only delivers to the
email address that owns the Resend account.

## 4. Checklist after deploy

- [ ] Age gate appears on first visit, and not again after confirming
- [ ] `/`, `/ru/`, `/hy/` and `/privacy` load; language switcher keeps the current page
- [ ] Submit a test inquiry → email arrives at `CONTACT_TO_EMAIL`, reply-to is the sender
- [ ] `https://amartobacco.com/sitemap-index.xml` and `/robots.txt` are reachable
- [ ] Share a link in a messenger → AMAR preview image shows

## Legal note

Tobacco advertising rules differ by country (EU TPD, Armenian law on tobacco control, UAE, etc.).
The site is built as a trade/B2B site with an age gate, a health warning and no online sales,
but the brand owner should confirm the content with local counsel for each target market.
