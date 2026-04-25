#  Design Decisions & Architecture Notes

This document explains how the system is designed, why certain decisions were made, and how the overall architecture works.

---

##  General Approach

While building this project, the main goal was to keep things **simple, readable, and scalable**.

Instead of over-engineering, I focused on:
- Clear separation of responsibilities
- Easy-to-follow logic
- Real-world scenario simulation

The idea was to build something that not only works, but is also easy for another developer to understand quickly.

---

##  Backend Design (NestJS)

The backend is built using **NestJS**, mainly because of its structured and modular architecture.

### Why NestJS?
- It enforces a clean architecture by default
- Easy to scale and maintain
- Separates concerns (controller, service, etc.)

---

###  Business Logic

The core logic is based on a real estate workflow:

Transactions move through stages:
- `earnest_money`
- `title_deed`
- `completed`

Each step represents a real-life process.

---

###  Commission Calculation

The commission logic is intentionally simple but realistic:

- 50% goes to the agency
- 50% is shared between agents

Edge case handled:
- If the same agent is both listing and selling → they get the full agent share

This logic is extracted into a separate function:
```ts
calculateBreakdown()

This makes it:

Reusable
Testable
Easy to maintain

Testing Strategy

Instead of testing everything, I focused on critical business logic:



Tested scenarios:

Same agent case
Different agents case
Zero fee case

This ensures the most important logic is reliable.



Frontend Design (Nuxt 3 + Pinia)

The frontend is built with Nuxt 3, using modern Vue 3 features.


Why Nuxt 3?
Clean project structure
Built-in routing & SSR support
Great developer experience


State Management (Pinia)

Pinia is used to manage application state.

Instead of calling API directly in components:

All API logic is centralized in a store

stores/transactions.ts


Benefits:

Cleaner components
Better scalability
Easier debugging



Data Flow
Page loads
Store fetches dashboard data
UI renders transactions
User clicks "Next Stage"
Store sends API request
UI updates automatically



Frontend ↔ Backend Communication

Communication is handled via simple REST API:

GET / → fetch dashboard data
PATCH /transactions/:id/next-stage → move transaction forward
POST /reset → reset system state


Design Trade-offs

Some things were intentionally kept simple:

No database (mock data used)
No authentication
No complex error handling

Reason:

Focus was on logic, architecture, and clarity, not production-level completeness.


If This Were a Real Project...

Given more time, I would:

Add a real database (PostgreSQL / MongoDB)
Implement authentication (JWT)
Add role-based access (admin / agent)
Improve UI/UX interactions
Add loading & error states
Write more comprehensive tests


Final Thoughts

This project reflects how I approach development:

Keep things clean
Focus on business logic
Build scalable structure from the start

Even though it's a small project, the goal was to simulate how a real-world system would be designed.

