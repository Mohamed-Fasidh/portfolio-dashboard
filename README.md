# Dynamic Portfolio Dashboard — Full Featured

Next.js 14 + TypeScript + Tailwind dashboard that fetches:
- **CMP** (Yahoo Finance via `yahoo-finance2` — unofficial)
- **P/E** and **Latest Earnings** (Google Finance scraping via `cheerio`)

## Features
- Portfolio table: Investment, Portfolio %, CMP, Present Value, Gain/Loss, P/E, Latest Earnings
- Sector grouping totals
- Auto refresh every 15s (configurable via `.env.local`)
- Color-coded gains/losses
- Recharts allocation pie chart
- Batch fetching with LRU cache
- Graceful error handling

## Quickstart
```bash
npm install
npm run dev
# open http://localhost:3000
```
Optional: copy `.env.local.example` to `.env.local` and tweak `NEXT_PUBLIC_REFRESH_MS`.

## Notes
- Yahoo/Google endpoints are unofficial and may change at any time.
- All scraping occurs server-side; no secrets are exposed in the client.
