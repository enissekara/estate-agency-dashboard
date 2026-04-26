# Estate Agency Dashboard

A full-stack real estate transaction management dashboard built with modern web technologies.

## 🚀 Live Demo

* Frontend: https://estate-agency-dashboard.vercel.app
* Backend API: https://estate-agency-dashboard.onrender.com/api/summary

## 🧩 Features

* Track real estate transactions
* Manage transaction stages (agreement → earnest money → title deed → completed)
* Automatic commission calculation
* Real-time dashboard metrics
* Agent-based revenue distribution

## 🛠️ Tech Stack

* Frontend: Nuxt 3, Vue 3
* State Management: Pinia
* Backend: NestJS
* Database: MongoDB
* Deployment: Vercel (frontend), Render (backend)

## ⚙️ API Endpoints

* GET `/api/summary`
* PATCH `/api/transactions/:id/next-stage`
* POST `/api/reset`

## ⚠️ Note

During deployment, caching and state synchronization issues were encountered.
To ensure reliability in production, direct API fetching was used instead of relying solely on global state management.

## 📦 Installation

### Backend

```bash
cd backend
npm install
npm run start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
