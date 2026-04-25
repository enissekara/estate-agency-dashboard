# Estate Agency Transaction Dashboard

A full-stack web application designed to manage real estate transactions, track deal progress, and automatically calculate commission distribution between the agency and agents.

---

##  Overview

This project simulates a real-world real estate workflow where transactions move through multiple stages and commissions are calculated dynamically based on business rules.

It demonstrates:

* Clean backend architecture
* State management with Pinia
* Frontend-backend integration
* Business logic modeling
* Testable and maintainable code structure

---

##  Tech Stack

### Frontend

* Nuxt 3 (Vue 3)
* Pinia (State Management)
* Composition API

### Backend

* NestJS
* TypeScript
* REST API

### Database

* MongoDB

---

##  Features

*  Dashboard with real-time transaction data
*  Transaction stage progression:

  * `title_deed → earnest_money → completed`
*  Automatic commission calculation
*  Business rule handling:

  * Agency always receives 50%
  * Remaining 50% goes to agents:

    * If same agent → gets full share
    * If different agents → split equally
*  Reset system state
* ⚡ Instant UI updates via API integration

---

##  Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd estate-case
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run start
```

Backend runs on:

```
http://localhost:3001
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

##  API Endpoints

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/`                            | Fetch dashboard data           |
| PATCH  | `/transactions/:id/next-stage` | Move transaction to next stage |
| POST   | `/reset`                       | Reset all data                 |

---

##  Business Logic

Commission calculation is handled centrally in the backend:

* **Agency Share:** 50% of total fee
* **Agent Share:** 50% of total fee

### Scenarios:

**1. Same Agent**

```
listingAgent === sellingAgent
→ Agent receives full 50%
```

**2. Different Agents**

```
listingAgent !== sellingAgent
→ Each agent gets 25%
```

---

##  Testing

Backend logic is fully testable.

Run tests with:

```bash
cd backend
npm run test
```

Includes tests for:

* Commission calculation
* Edge cases (e.g., zero fee)
* Stage transitions

---

##  Architecture Notes

* Backend follows modular NestJS structure
* Business logic is separated and reusable
* Frontend uses Pinia for centralized state management
* API layer is cleanly abstracted
* Designed for scalability and maintainability

---

##  Assumptions

* All transactions follow a fixed stage order
* Commission logic is consistent across all deals
* No authentication layer is required for this case
* Data is resettable for demonstration purposes

---

##  Possible Improvements

* Add authentication (JWT)
* Pagination & filtering
* Real-time updates (WebSocket)
* Role-based dashboards
* Deployment (Docker / Cloud)

---

##  Author

Developed as part of a technical case study.

---
