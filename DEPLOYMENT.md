# Pharma Distribution Management System (Pharma DMS) - Production Deployment Guide

This document provides complete instructions for deploying the **Pharma Distribution Management System (Pharma DMS)** into staging and production environments.

---

## 1. System Architecture Overview

The system consists of three decoupled components:
- **Frontend**: Next.js 16.4.3 (Turbopack, React 19, TailwindCSS) running on port `3000`.
- **Backend API**: Node.js / Express 4 + TypeScript + Prisma ORM 5.22 running on port `5001`.
- **Database**: PostgreSQL 16+ relational database storing customer ledgers, batch inventories, sales vouchers, delivery routes, and NIC e-invoice statutory records.

---

## 2. Environment Variables Configuration

### Frontend (`frontend/.env.local` or Cloud Provider Env)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Public endpoint URL of the backend API | `https://api.yourdomain.com/api` (or `http://localhost:5001/api`) |

### Backend (`backend/.env` or Cloud Provider Env)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Listening port for the Express server | `5001` |
| `NODE_ENV` | Environment identifier | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/pharma_dms?schema=public` |
| `FRONTEND_URL` | Allowed client URL for CORS | `https://app.yourdomain.com` |
| `JWT_SECRET` | 64-character secret key for JWT auth | Any secure random string |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |

---

## 3. Deployment Methods

### Option A: 1-Click Containerized Deployment (Docker & Docker Compose)

The easiest and most isolated way to deploy the entire stack:

1. **Clone repository and configure environment**:
   ```bash
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   # Edit secrets in backend/.env
   ```

2. **Build and start all containers in background**:
   ```bash
   docker compose up -d --build
   ```

3. **Initialize Database Schema & Seeds** (First run only):
   ```bash
   docker exec -it pharma_backend npx prisma db push
   docker exec -it pharma_backend npm run db:seed
   ```

4. **Verify Health**:
   - Frontend: `http://<your-server-ip>:3000`
   - Backend API: `http://<your-server-ip>:5001/api/health`

5. **Stop Stack**:
   ```bash
   docker compose down
   ```

---

### Option B: Bare-Metal / Linux VPS Deployment (PM2 + NGINX)

#### Step 1: Install System Prerequisites
```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y nodejs npm postgresql postgresql-contrib nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

#### Step 2: Configure PostgreSQL Database
```bash
sudo -u postgres psql
CREATE DATABASE pharma_dms;
CREATE USER pharma_admin WITH ENCRYPTED PASSWORD 'StrongPassword123';
GRANT ALL PRIVILEGES ON DATABASE pharma_dms TO pharma_admin;
\q
```

#### Step 3: Install & Build Backend
```bash
cd backend
npm install --production=false
cp .env.example .env
# Edit DATABASE_URL in .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run build
cd ..
```

#### Step 4: Install & Build Frontend
```bash
cd frontend
npm install --production=false
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL in .env.local
npm run build
cd ..
```

#### Step 5: Start & Manage with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### Option C: Cloud Platform Deployment (Vercel + Railway / Render)

1. **Database & Backend (Railway / Render / Supabase)**:
   - Create a PostgreSQL database on Supabase or Neon.
   - Deploy `backend/` directory to Railway or Render.
   - Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`).
   - Run build command: `npm install && npx prisma generate && npx prisma db push && npm run build`.
   - Start command: `node dist/index.js`.

2. **Frontend (Vercel / Cloudflare)**:
   - Connect GitHub repository to Vercel.
   - Set root directory to `frontend`.
   - Add environment variable `NEXT_PUBLIC_API_URL=https://<your-railway-backend-url>/api`.
   - Deploy.

---

## 4. Production NGINX Reverse Proxy Configuration

Place this configuration in `/etc/nginx/sites-available/pharma.conf`:

```nginx
# Upstream definitions
upstream pharma_frontend {
    server 127.0.0.1:3000;
    keepalive 64;
}

upstream pharma_backend {
    server 127.0.0.1:5001;
    keepalive 64;
}

server {
    listen 80;
    server_name pharma.yourdomain.com api.pharma.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pharma.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/pharma.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pharma.yourdomain.com/privkey.pem;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://pharma_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.pharma.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/pharma.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pharma.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://pharma_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and reload NGINX:
```bash
sudo ln -s /etc/nginx/sites-available/pharma.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Automated Database Backups

Schedule automated daily backups using cron:

```bash
# Add to crontab (crontab -e)
0 2 * * * pg_dump -U pharma_admin pharma_dms | gzip > /var/backups/pharma/pharma_dms_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

---

## 6. Verification & Health Monitoring

To verify deployment integrity post-release:
1. **Health API**:
   ```bash
   curl -i https://api.yourdomain.com/api/health
   # Expected: HTTP 200 {"status":"healthy","database":"connected",...}
   ```
2. **Execute Full End-to-End Business Lifecycle Test**:
   ```bash
   npm run test:e2e
   # Expected: 31/31 steps passed (100.0% success rate)
   ```
3. **Execute Full Browser Suite**:
   ```bash
   npm run test:flow
   # Expected: 24/24 checks passed, 0 runtime errors
   ```
