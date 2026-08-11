# DiBS Redesign (Study Room Booking System)

A modern web application designed to fix the usability and data concurrency issues of room booking system.

---

## **Project Overview**

The legacy DiBS application forces students to navigate a rigid template-based structure, making it difficult to find available study rooms quickly. 

This project completely overhauls the **Database Architecture**, **Backend Business Logic**, and **User Experience**:
* **Database & Integrity:** Replaced fixed templates with flexible timestamps, unique asset identifiers (`room_code`), and composite unique constraints to prevent double-booking.
* **Smart Availability Engine:** Developed an efficient slot-checking system that accounts for session durations, room features, and peak booking overlaps.
* **User-Centric Architecture:** Shifted from "database-first" thinking to an intuitive filter-driven system (search by location, capacity, floor, and equipment).

---

## **Tech Stack**

* **Frontend:** Vue.js, Axios, CSS3 (Tailwind CSS)
* **Backend:** Node.js, Express.js (RESTful API architecture)
* **Database:** PostgreSQL (running via Docker)
* **Tools & Design:** Figma (Wireframing & UI Components), Docker

---

## **Database Architecture & Schema**

The database is built on PostgreSQL with relational integrity in mind:

[Library] 1 --- * [Room] 1 --- * [Booking] * --- 1 [User]

### Key Highlights:
* **Natural & Surrogate Keys:** Uses internal `id` primary keys for fast join operations, alongside human-readable `room_code` values (e.g., `PAR-177-1-G17`) for frontend consumption and URL structure.
* **Metadata & Filtering:** Features like `capacity`, `floor`, `has_projector`, `has_whiteboard`, and `is_accessible` enable granular multi-variable queries.
* **Custom Constraints:** Composite keys (`UNIQUE(name, library_id)`) prevent human-error duplicate entries during seeding.

---

## **Key Learnings & Software Engineering Takeaways**

Building this full-stack application from scratch provided deep, practical experience beyond standard university exercises:

### 1. Database Integrity & Race Conditions
* **Preventing Double Bookings:** Learned how to use PostgreSQL's `OVERLAPS` operator and transactional checks before `INSERT` statements to handle concurrent user requests safely.
* **SQL Injection & Security:** Practiced using parameterized queries (`pool.query(sql, [params])`) instead of template literals, isolating external user inputs from executable SQL statements.
* **Data Types & Casting:** Used PostgreSQL type casting (`start_time::date`) to query by date efficiently without pulling thousands of raw timestamps into Node.js memory.

### 2. Algorithmic Optimization & Software Modeling
* **Sweep-Line / Two-Pointer Efficiency:** Optimized the availability checking algorithm from a nested $O(S \times B)$ loop to an $O(N)$ sweep algorithm, using sorted SQL queries to dramatically reduce processing time.
* **Layered Architecture (OOP):** Applied separation of concerns by isolating database models (`db.js`), business logic (`Services`), HTTP request handling (`Controllers`), and endpoint mapping (`Routes`).

### 3. REST API Design & Client-Server Communication
* **HTTP Semantics:** Mastered the distinction between URL parameters (`req.params`), query strings (`req.query`), and payload bodies (`req.body`) for secure `GET` and `POST` operations.
* **Serialization & Status Codes:** Standardized JSON responses (`res.json()`) and HTTP response status codes (`201 Created`, `404 Not Found`, `409 Conflict`).

### 4. Real-World UX vs. Database Constraints
* Learned how to translate user mental models (e.g., "Find me a room for 4 people at 2 PM") into precise multi-condition SQL queries (`WHERE capacity >= $1 AND library_id = $2`).

---

## **Local Setup & Installation**

### Prerequisites
* Docker & Docker Compose
* Node.js (v18+)

### 1. Database Setup (Docker)
```bash
# Start PostgreSQL Container
docker run --name dibs-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres

# Run Schema & Seed Scripts
psql -h localhost -U postgres -d dibs -f backend/schema.sql
psql -h localhost -U postgres -d dibs -f backend/seed.sql

```
### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
