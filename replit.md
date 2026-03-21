# Gemini Surgicals — Medical eCommerce Platform

## Overview

A full-stack eCommerce website for **Gemini Surgicals**, a medical supplies brand based in Nairobi, Kenya. Features a clean, clinical white/blue aesthetic matching the brand's Instagram presence.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/gemini-surgicals)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Styling**: Tailwind CSS, Plus Jakarta Sans font
- **Build**: esbuild (API), Vite (frontend)

## Structure

```text
artifacts/
├── api-server/         # Express API server (port 8080, served at /api)
└── gemini-surgicals/   # React+Vite frontend (served at /)
lib/
├── api-spec/           # OpenAPI spec + Orval codegen config
├── api-client-react/   # Generated React Query hooks
├── api-zod/            # Generated Zod schemas from OpenAPI
└── db/                 # Drizzle ORM schema + DB connection
```

## Pages

1. **Homepage** (`/`) — Hero, featured categories, weekly offers, featured products, trust section, WhatsApp CTA
2. **Shop** (`/shop`) — Product grid with filters (category, price, stock) and sort
3. **Product Detail** (`/product/:id`) — Image, price, WhatsApp order button, tabs
4. **Cart** (`/cart`) — Cart items, quantity controls (localStorage)
5. **Checkout** (`/checkout`) — Name, phone, location, M-Pesa / Cash on Delivery
6. **Order Confirmation** (`/order/:id`) — Thank you + order summary
7. **Admin** (`/admin`) — Dashboard stats, product management, order management (password: admin123)

## API Endpoints

- `GET /api/products` — List products with filters
- `GET /api/products/featured` — Featured/offer products
- `GET /api/products/:id` — Get product
- `POST /api/products` — Create product (admin)
- `PUT /api/products/:id` — Update product (admin)
- `DELETE /api/products/:id` — Delete product (admin)
- `GET /api/categories` — List categories
- `POST /api/categories` — Create category (admin)
- `GET /api/orders` — List all orders (admin)
- `POST /api/orders` — Place order
- `GET /api/orders/:id` — Get order
- `PUT /api/orders/:id` — Update order status (admin)
- `GET /api/admin/stats` — Dashboard stats

## Database Schema

- `categories` — Product categories (id, name, slug, description, imageUrl)
- `products` — Products (id, name, slug, description, price, discountPrice, categoryId, stock, weeklyOffer, featured, ...)
- `orders` — Customer orders (id, customerName, phone, location, paymentMethod, status, items JSON, totalAmount)

## WhatsApp

Contact: +254706072888. Floating green button on all pages. Product pages have "Order on WhatsApp" button with pre-filled message.

## Vercel Deployment

Root `vercel.json` is configured for Vercel. To deploy:
1. Push to GitHub
2. Import the repo in Vercel
3. Vercel will use `pnpm install` + `pnpm --filter @workspace/gemini-surgicals run build`
4. Output is `artifacts/gemini-surgicals/dist/public`
5. Set up your own API server (the Express server) separately and update the API base URL

## Sample Products (Seeded)

OnCall Plus Glucometer, H. Pylori Antigen Test Kit, Salmonella Test Kit, VDRL Syphilis Test, CrAg LFA, Suture Practice Kit, Chromic Catgut Sutures, Purple Tops EDTA K3, Red Tops, Littmann Stethoscope, Electric Centrifuge, Urinalysis Strips, Fuji Dry Imaging Film, SleepWell Gummies, Mission Plus HB Machine
