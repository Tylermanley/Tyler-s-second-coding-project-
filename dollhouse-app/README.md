# Dollhouse 🏠💗

**Design Your Life. Delivered.**

A working demo app built from the Dollhouse investor pitch: an AI-powered fashion &
home design platform for women, combining smart recommendations, a curated
marketplace, mood boards with social features, and a seamless delivery flow.

This is a functional full-stack prototype (Node/Express API + vanilla JS SPA) meant
to make the pitch tangible for investors and users — not a production storefront.
Data lives in memory and resets whenever the server restarts.

## Features

Mapped straight from the pitch deck:

- **✨ AI-Powered Personalization** — a 4-question style quiz (vibe, palette,
  fashion/home focus, budget) feeds an explainable scoring engine that ranks
  products and tells you *why* each one was picked.
- **🛍️ Marketplace** — browse fashion & home decor, filter by category/vibe/
  palette/budget, search by name or designer.
- **🎨 Boards** — save products into moodboards that blend fashion + home
  finds, just like the pitch's "inspiration meets shopping."
- **📌 Social & Community** — public boards can be liked and commented on by
  other shoppers.
- **💖 Independent Designer Marketplace** — designer profiles (indie vs.
  brand-partner), plus a "apply to sell on Dollhouse" intake form.
- **🚚 Seamless Delivery** — a real cart → checkout flow that produces an
  order confirmation with an estimated delivery date.
- **💎 VIP Boxes** — three subscription tiers (Style Edit, Home Refresh, Full
  Dollhouse) mirroring the pitch's subscription-box revenue stream.
- **📊 Investor Dashboard** — live platform metrics (boards, likes, orders,
  subscriptions) next to the market-opportunity numbers from the deck.
- **📢 The Pitch itself** — the full investor narrative, rendered as the
  app's home page, with an illustrated pink dollhouse hero and "room" cards
  (The Closet / The Living Room / Whole House) for navigating the marketplace.
- **👤 Profile & Social Connections** — set a display name and connect demo
  Instagram/TikTok/Pinterest/Facebook handles; boards can be shared to
  Pinterest, Facebook, and X via real share-intent links, or copied as a
  direct link (`#/boards/:id` deep-links straight to a board).

## Tech stack

- **Backend:** Node.js + Express, in-memory data store (`src/data.js`,
  `src/store.js`), a small rule-based recommender (`src/recommend.js`).
- **Frontend:** Vanilla HTML/CSS/JS single-page app (`public/`), hash-routed,
  no build step required.

## Running it

```bash
cd dollhouse-app
npm install
npm start
```

Then open **http://localhost:4000**.

For auto-reload during development: `npm run dev` (uses Node's built-in
`--watch`).

## Project structure

```
dollhouse-app/
├── server.js              # Express app entry point
├── src/
│   ├── data.js             # Seed products, designers, VIP tiers
│   ├── store.js            # In-memory runtime state (boards, orders, subs)
│   ├── recommend.js        # Style-quiz scoring/recommendation engine
│   └── routes/             # /api/products, /recommendations, /boards,
│                           #   /designers, /checkout, /vip, /stats, /profile
└── public/
    ├── index.html
    ├── css/styles.css
    └── js/
        ├── api.js          # fetch() wrapper for the REST API
        └── app.js          # SPA router + view rendering
```

## API overview

| Method | Path                              | Purpose                              |
|--------|------------------------------------|---------------------------------------|
| GET    | `/api/products`                    | List/filter products                  |
| GET    | `/api/products/:id`                | Product detail                        |
| POST   | `/api/recommendations`             | AI style-quiz recommendations         |
| GET    | `/api/boards`                      | List boards                           |
| POST   | `/api/boards`                      | Create a board                        |
| POST   | `/api/boards/:id/items`            | Add a product to a board              |
| DELETE | `/api/boards/:id/items/:productId` | Remove a product from a board         |
| POST   | `/api/boards/:id/like`             | Toggle a like                         |
| POST   | `/api/boards/:id/comments`         | Add a comment                         |
| GET    | `/api/designers`                   | List designers                        |
| POST   | `/api/designers/apply`             | Apply to sell on Dollhouse            |
| POST   | `/api/checkout`                    | Place an order                        |
| GET    | `/api/checkout/orders`             | Order history                         |
| GET    | `/api/vip/tiers`                   | VIP box tiers                         |
| POST   | `/api/vip/subscribe`               | Subscribe to a VIP box                |
| GET    | `/api/stats`                       | Live + market metrics for investors   |
| GET    | `/api/profile/:userId`             | Get (or create) a profile             |
| PUT    | `/api/profile/:userId`             | Update display name                   |
| POST   | `/api/profile/:userId/social/:platform` | Connect a social handle          |
| DELETE | `/api/profile/:userId/social/:platform` | Disconnect a social account       |

## Notes / next steps for a real product

- Swap the in-memory store for a real database and add persistent accounts.
- Replace the rule-based recommender with a trained model / embedding search.
- Wire the marketplace commission & sponsored-placement logic into real
  payments (Stripe Connect for designer payouts is a natural fit).
- Real product photography instead of CSS gradient swatches.
- Replace demo "connect" with real OAuth (Instagram/TikTok/Pinterest/Facebook
  login) once API credentials for each platform are available.
