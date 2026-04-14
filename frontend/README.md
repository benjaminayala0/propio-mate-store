# 🧉 Mate Único - E-Commerce Platform

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/react-v19-blue.svg)
![Vite](https://img.shields.io/badge/vite-v7-yellow.svg)
![Node.js](https://img.shields.io/badge/node.js-express-green.svg)
![PostgreSQL](https://img.shields.io/badge/database-postgresql-blue.svg)

**Mate Único** is a modern, high-performance e-commerce platform built to sell artisanal Mates and accessories. It provides a complete end-to-end shopping experience, from browsing products to processing payments and tracking orders.

This repository is structured as a monorepo containing three main services:
- **Frontend** (`/frontend`): The customer-facing web application.
- **Backend** (`/backend`): The main API, handling business logic, users, orders, and payments.
- **Admin CMS** (`/admin`): A headless CMS (Strapi) to easily manage products, inventory, and content.

---

## ✨ Key Features

- 🛍️ **Full Browsing Experience**: Dynamic product listings, detailed product views, and category filtering.
- 🛒 **Shopping Cart & Checkout**: Persistent cart context, leading to a smooth checkout flow.
- 💳 **Payment Integration**: Secure online payments processed via **MercadoPago**.
- ✉️ **Automated Mailing**: Automated order confirmation emails using **Resend** (API) or Gmail SMTP fallback.
- 🔐 **Authentication**: User accounts with standard JWT authentication and **Google OAuth** integration.
- 📦 **Order Tracking**: Users can view purchase history and track their shipment status.
- 🚀 **Performance Optimized**: Configured with Vercel Analytics & Speed Insights to ensure excellent UX and monitor Core Web Vitals.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Client-side)
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **Monitoring:** Vercel Analytics & Vercel Speed Insights
- **Hosting:** Vercel (Edge CDN)

### Backend (API)
- **Framework:** Node.js with Express v5
- **Database:** PostgreSQL (Cloud hosted on Supabase/Neon)
- **ORM:** Sequelize
- **Security:** Helmet, Express Rate Limit, bcrypt, JWT
- **Media Storage:** Cloudinary
- **Caching:** Node-cache
- **Hosting:** Render

### Admin (Content Management)
- **CMS:** Strapi (Node.js)
- **Database:** PostgreSQL
- **Hosting:** Render

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (or a cloud DB connection string like Supabase)
- MercadoPago Test Access Token
- Cloudinary Credentials
- Resend API Key (for emails)

### 1. Clone the repository
```bash
git clone https://github.com/benjaminayala0/propio-mate-store.git
cd propio-mate-store
```

### 2. Setup the Backend API
Open a terminal in the root and navigate to the backend:
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory with the required variables:
```env
PORT=3000
DATABASE_URL=postgres://user:pass@host:5432/db
JWT_SECRET=your_jwt_secret
MERCADOPAGO_ACCESS_TOKEN=your_mp_token
RESEND_API_KEY=your_resend_key
CLOUDINARY_URL=your_cloudinary_url
```
Run the development server:
```bash
npm run dev
```

### 3. Setup the Frontend Client
Open a new terminal session.
```bash
cd frontend
npm install
```
Create a `.env` file in `/frontend` (if your axios instance requires it):
```env
VITE_API_URL=http://localhost:3000/api
```
Run the Vite development server:
```bash
npm run dev
```

### 4. Setup the Admin CMS (Strapi)
Open a new terminal session.
```bash
cd admin
npm install
npm run develop
```

---

## 📂 Project Structure Overview

```text
mate-unico/
├── admin/                 # Strapi Headless CMS code
├── backend/               # Main Express.js API
│   ├── src/
│   │   ├── controllers/   # Route handlers (cart, checkout, mailer, user)
│   │   ├── routes/        # Express router configs
│   │   ├── helpers/       # Utils (verifyToken, emails)
│   │   └── config/        # DB & Server settings
│   ├── app.js             # API Entry point
│   └── package.json       
├── frontend/              # React Client
│   ├── src/
│   │   ├── api/           # Axios interceptors & endpoints
│   │   ├── components/    # Reusable UI React components
│   │   ├── context/       # React Context APIs (CartProvider)
│   │   ├── pages/         # Page Views (Checkout, Home, Products)
│   │   └── utils/         # Helpers (googleLogin)
│   ├── main.jsx           # Entry point (Router & Vercel Integrations)
│   └── package.json
└── README.md              # Project documentation
```

## 🛡️ Best Practices & Patterns Applied

This project follows strict Software Engineering principles:
- **Separation of Concerns (SoC):** Distinct separation between the client presentation, custom API logic, and headless content management. MVC architecture is utilized inside the backend.
- **High Cohesion, Low Coupling:** Code is modularized effectively using specialized controllers, helpers, and middlewares.
- **Security & Integrity:** OWASP standards are covered by applying rate-limiting, CORS handling, and `helmet` for header security.
- **Scalability:** Stateless token-based (JWT) authentication, abstracting session states out of the API.

---
*Maintained by Benjamín Ayala*
