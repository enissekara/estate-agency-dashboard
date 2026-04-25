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