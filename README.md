# Pharma Distribution Management System (Pharma DMS)

An enterprise-grade, high-volume pharmaceutical distribution and supply chain ERP built with modern web technologies: Next.js 16 (React 19, TailwindCSS), Express 4 (TypeScript, MVC), Prisma ORM, and PostgreSQL.

---

## 📁 Repository Structure

```
Pharma_Distribution_Management/
├── frontend/                     # Next.js 16.4.3 Web Client
│   ├── src/
│   │   ├── app/                 # 13 Application Modules & App Router
│   │   ├── components/          # Reusable UI & Layout Components
│   │   ├── context/             # Auth & Global State Context
│   │   ├── lib/                 # Type-Safe API Client & Utilities
│   │   └── proxy.ts             # Authentication & Route Guard Proxy
│   ├── public/                  # Static Assets & Icons
│   ├── Dockerfile               # Multi-stage Next.js Container
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
├── backend/                      # Express + TypeScript + Prisma API
│   ├── src/
│   │   ├── config/              # Environment & App Configuration
│   │   ├── controllers/         # MVC Controllers for all Pharma Domains
│   │   ├── db/                  # Prisma Client Instance
│   │   ├── middleware/          # JWT Auth, Validation & Rate Limiting
│   │   ├── routes/              # Express API Routes
│   │   └── prisma/seed.ts       # Database Seed Script
│   ├── prisma/
│   │   └── schema.prisma        # Complete Relational Database Schema
│   ├── Dockerfile               # Multi-stage Backend Container
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── scratch/                      # Automated E2E & Browser Test Suites
├── docker-compose.yml            # 1-Click Multi-Service Orchestrator
├── ecosystem.config.js           # PM2 Process Manager Configuration
├── DEPLOYMENT.md                 # Production Operations & Deployment Guide
├── package.json                  # Root Monorepo Orchestrator
└── README.md                     # Project Documentation
```

---

## 🚀 Quick Start (Development)

### 1. Prerequisites
- **Node.js**: v20 or higher
- **PostgreSQL**: v16 or higher (or Docker)

### 2. Configure Environment
```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
# Edit DATABASE_URL and secrets in backend/.env
```

### 3. Initialize Database
```bash
npm run db:push
npm run db:seed
```

### 4. Run Development Servers
```bash
# Run both Backend (Port 5001) and Frontend (Port 3000)
npm run dev

# Or run separately:
npm run dev:backend
npm run dev:frontend
```

---

## 📦 Production Deployment

### Option A: Docker Compose (Recommended)
```bash
docker compose up -d --build
```

### Option B: PM2 on Linux VPS
```bash
npm run build
pm2 start ecosystem.config.js
```

For complete VPS, NGINX SSL reverse proxy, and backup instructions, see [DEPLOYMENT.md](file:///Users/pranjalsoni/Desktop/Pharma/DEPLOYMENT.md).

---

## 🧪 Verification & Automated Testing
```bash
# Run full browser suite across all 13 modules (Google Chrome)
npm run test:flow

# Run 31-step commercial business lifecycle test
npm run test:e2e
```
