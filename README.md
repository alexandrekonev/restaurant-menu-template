# Restaurant Menu Template

A reusable digital menu template for restaurants and bars, built with **Next.js 14** and **Sanity v3**.

## Features

- Bilingual support (BG / EN)
- Dark theme with configurable accent colour
- Cards / List / Compact display modes per category
- Happy Hour banner (time-based)
- Daily lunch menu section
- Social media links in footer (Instagram, Facebook, TikTok, Google Review)
- Working hours display in footer
- Floating Back-to-Top button
- Reservation form with email delivery via [Resend](https://resend.com)
- Call button (shown when phone is configured)
- All branding (name, logo, colours, links) managed from Sanity Studio — zero hardcoding

## Quick Start

See **[SETUP.md](./SETUP.md)** for full installation instructions.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (usually `production`) |
| `SANITY_API_TOKEN` | Sanity Editor token |
| `SANITY_REVALIDATE_SECRET` | Random secret for ISR revalidation |
| `NEXT_PUBLIC_BASE_URL` | Public URL of the deployment |
| `RESEND_API_KEY` | Resend API key for reservation emails |

## License

MIT — use freely for commercial and personal projects.
