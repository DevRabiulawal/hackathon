# Captionly dashboard

A responsive social-content workspace for the hackathon brief. It contains an AI-caption generation interaction, performance overview, and scheduled-post queue in a single Next.js application.

## Run locally

1. Copy `.env.example` to `.env.local` and fill in credentials when you connect the real services.
2. Run `npm install`.
3. Run `npm run dev`, then open `http://localhost:3000`.

## Production integrations to add

- Gemini caption generation in a server-side route (keep `GEMINI_API_KEY` private).
- Google OAuth and Google Drive draft storage.
- Resend email notifications and a Vercel Cron route for scheduled sends.

## Design notes

The UI is intentionally inspired by the supplied dashboard’s calm editorial layout, without duplicating its branding, copy, assets, or exact visual treatment. It adapts from a desktop sidebar to a streamlined mobile header.
