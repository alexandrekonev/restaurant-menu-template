# Setup Guide — Digital Menu Template

A step-by-step guide to deploying a fresh instance of this menu for a new venue.

---

## Prerequisites

- Node.js 18 or later
- A [Sanity](https://sanity.io) account (free tier is sufficient)
- A [Vercel](https://vercel.com) account (free tier is sufficient)
- Git

---

## Step 1 — Clone the repository

```bash
git clone <your-repo-url> my-venue-menu
cd my-venue-menu
npm install
```

---

## Step 2 — Create a new Sanity project

1. Go to [sanity.io/manage](https://sanity.io/manage) and click **New project**.
2. Choose **Blank project** (no starter template).
3. Note down your **Project ID** (visible in the project URL or Overview tab).
4. The default dataset is `production` — leave it as-is unless you need multiple environments.

---

## Step 3 — Create a Sanity API token

1. In your Sanity project, go to **API → Tokens**.
2. Click **Add API token**.
3. Give it a name (e.g. `Next.js ISR`) and set permission to **Editor**.
4. Copy the token value — you will not be able to see it again.

---

## Step 4 — Configure environment variables

Copy the sample file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# ── Sanity ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token_here

# ── Vercel ISR revalidation (optional — set a random secret string) ──────────
SANITY_REVALIDATE_SECRET=choose_a_random_secret

# ── Public base URL (used for absolute links) ────────────────────────────────
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

> **Never commit `.env.local` to Git.** It is already in `.gitignore`.

---

## Step 5 — Deploy the Sanity Studio

The Studio lives at `/studio` inside the Next.js app — no separate deployment needed.
Run the app locally first to verify the Studio loads:

```bash
npm run dev
# Visit http://localhost:3000/studio
```

If you see the Studio UI, everything is connected.

---

## Step 6 — Configure Site Settings in Sanity

Open the Studio at `/studio` → **Site Settings** and fill in:

| Field | Description |
|---|---|
| **Venue Name** | Name used in the browser tab and footer |
| **Logo — Emblem** | Upload your small emblem/sign (SVG or PNG) |
| **Logo — Full** | Upload your full text logo for the hero |
| **Accent Color** | Hex colour (e.g. `#845D41`) for buttons, badges, highlights |
| **Address** | Shown in the footer |
| **Footer Note** | Optional tagline (bilingual BG/EN) |
| **Show prices EUR / BGN** | Toggle which currencies are displayed |
| **Happy Hour** | Enable and set start/end times + banner text |
| **Lunch Menu** | Toggle visibility of the daily lunch section |

---

## Step 7 — Add your content

1. **Categories** — Create drink/food categories, set display style (Cards / List / Compact) and drag to reorder.
2. **Menu Items by Category** — Add items inside each category. Drag rows to reorder.
3. **Daily Menu** — Optionally create daily lunch entries with sections and dishes.

---

## Step 8 — Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. When asked for environment variables, add the same values from Step 4.

### Option B — Vercel Dashboard

1. Push your code to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add each variable from Step 4.
4. Click **Deploy**.

---

## Step 9 — Set up CORS in Sanity

Allow your Vercel domain to query the Sanity API:

1. In Sanity → **API → CORS Origins**, click **Add CORS Origin**.
2. Add `https://your-domain.vercel.app` (and `http://localhost:3000` for local dev).
3. Check **Allow credentials** if you need authenticated requests.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Sanity dataset name (usually `production`) |
| `SANITY_API_TOKEN` | ✅ | Sanity Editor token for server-side fetches |
| `SANITY_REVALIDATE_SECRET` | Recommended | Secret for on-demand ISR revalidation |
| `NEXT_PUBLIC_BASE_URL` | Recommended | Full URL of the deployment |

---

## Architecture Notes

- **Next.js 14 App Router** with ISR — menu revalidates every 10 s, layout every 60 s.
- **Sanity v3** CMS — all content (menu items, categories, settings) lives here.
- **No hardcoded venue data** in code — every venue-specific value comes from Sanity Settings.
- CSS accent colour is injected dynamically via a CSS custom property (`--copper`) set from `accentColor` in Settings. Derived shades (`--copper-lt`, `--copper-dk`) are computed automatically via `color-mix()`.
- Supports **Bulgarian and English** out of the box. Language toggle is shown in the header; BG route is `/menu`, EN route is `/menu/en`.

---

## Local Development

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (run before deploying)
npm run lint     # TypeScript + ESLint check
```
