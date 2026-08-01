# Doctor Tracker — Admin Portal

## Description

Doctor Tracker is a high-performance, full-stack administrative web application built with Next.js that empowers healthcare administrators to efficiently manage doctor registrations, patient assignments, and clinical data. Featuring a responsive, modern dashboard with real-time analytics powered by MongoDB aggregation pipelines, Recharts-based data visualization, and secure JWT-based authentication, the platform delivers an enterprise-grade experience that prioritizes query optimization, clean UX, and scalable architecture — all within a single Next.js application.

---

## Setup Guide

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (Atlas cluster or local instance)
- **npm** or **yarn**

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/doctor-tracker.git
cd doctor-tracker

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and a secure secret key

# 4. Seed the database with sample data
node scripts/seed.js

# 5. Start the development server
npm run dev
```

### Environment Variables (`.env.example`)

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/doctor_tracker?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your_super_secret_jwt_key_here_change_this
NEXTAUTH_URL=http://localhost:3000

# Initial Admin Credentials (for seed script)
ADMIN_EMAIL=admin@doctortracker.com
ADMIN_PASSWORD=AdminSecurePassword123!
```

### Demo Credentials
| Field | Value |
|:------|:------|
| Email | `admin@doctortracker.com` |
| Password | `AdminSecurePassword123!` |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       CLIENT BROWSER                         │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐  │
│  │  Login Page │  │  Dashboard │  │  Doctors / Patients    │  │
│  │  (Auth)     │  │  (Charts)  │  │  (CRUD Tables)         │  │
│  └─────┬──────┘  └─────┬──────┘  └──────────┬─────────────┘  │
│        │               │                    │                │
└────────┼───────────────┼────────────────────┼────────────────┘
         │               │                    │
         ▼               ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                         │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────────────────────┐   │
│  │  Middleware      │  │  API Routes (/api/*)              │   │
│  │  (JWT Auth Gate) │  │  ┌──────────┐ ┌───────────────┐  │   │
│  └─────────────────┘  │  │ Zod      │ │ getServerSess │  │   │
│                        │  │ Validation│ │ (Auth Check)  │  │   │
│                        │  └────┬─────┘ └──────┬────────┘  │   │
│                        │       │              │            │   │
│                        │       ▼              ▼            │   │
│                        │  ┌──────────────────────────┐    │   │
│                        │  │    Service Layer          │    │   │
│                        │  │  doctor.service.js        │    │   │
│                        │  │  patient.service.js       │    │   │
│                        │  │  analytics.service.js     │    │   │
│                        │  └───────────┬──────────────┘    │   │
│                        └──────────────┼───────────────────┘   │
│                                       │                       │
└───────────────────────────────────────┼───────────────────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │     MongoDB Atlas      │
                            │  ┌───────┐ ┌────────┐  │
                            │  │Users  │ │Doctors │  │
                            │  └───────┘ └────────┘  │
                            │  ┌────────────────────┐ │
                            │  │Patients            │ │
                            │  │(text + compound    │ │
                            │  │ indexes)           │ │
                            │  └────────────────────┘ │
                            └───────────────────────┘
```

**Data Flow:**
1. User authenticates via NextAuth.js Credentials Provider → JWT session token issued
2. Middleware validates JWT on every protected route request
3. Client pages fetch data from REST API routes (`/api/doctors`, `/api/patients`, `/api/analytics`)
4. API routes validate input with Zod schemas, verify session, then delegate to service layer
5. Service layer executes optimized Mongoose queries (`.lean()`, text indexes, `$facet` aggregation)
6. Response flows back through API → client → rendered via React components + Recharts

---

## Technical Decisions

### 1. Why a Single `$facet` Aggregation Pipeline for Analytics (Instead of Multiple Queries)

**Decision:** All dashboard KPIs and chart data are computed in a single MongoDB `$facet` aggregation call in `analytics.service.js`.

**Rationale:**
- **Reduced round trips:** A single `$facet` pipeline computes total patients, patients-per-doctor distribution, registration trends, and appointment trends in **one database call** instead of 4-5 separate queries. This cuts network latency by ~80% on cold starts.
- **Atomic consistency:** All metrics are computed from the same snapshot of data, preventing inconsistencies between cards and charts.
- **Server-side computation:** Complex grouping, sorting, and lookups happen inside MongoDB's optimized C++ aggregation engine rather than in JavaScript, which is significantly faster for large datasets.

**Trade-off:** The pipeline is more complex to read, but the performance gain (O(1) DB call vs. O(N) calls) is decisive for an analytics dashboard that loads on every visit.

### 2. Why a Decoupled Service Layer (Instead of Inline Mongoose Calls in API Routes)

**Decision:** All database logic lives in dedicated service files (`doctor.service.js`, `patient.service.js`, `analytics.service.js`) rather than directly in the Next.js API route handlers.

**Rationale:**
- **Single Responsibility:** API routes focus exclusively on HTTP concerns (parsing params, validating input, returning responses). Services own the query logic. This makes both layers independently testable.
- **Reusability:** The same `getDoctors()` service can be called from multiple API routes (e.g., the main listing and the patient form's doctor dropdown) without duplicating query logic.
- **Cascade safety:** The `deleteDoctor()` service encapsulates the business rule "cannot delete a doctor who has patients" — ensuring this constraint is enforced regardless of which route triggers the deletion.
- **Optimization surface:** All performance-critical patterns (`.lean()`, compound indexes, batch aggregation of patient counts) are centralized in one place, making it easy to audit and optimize queries.

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (ES6+) |
| Database | MongoDB + Mongoose |
| Authentication | NextAuth.js v4 (JWT) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (base-nova) |
| Charts | Recharts |
| Validation | Zod |
| Notifications | Sonner |
| Icons | Lucide React |

---

## Visual Evidence

### 1. Landing Page (`/`)
- **Desktop View:** Public entrance featuring hero title, system capabilities overview, feature cards, and dynamic authentication-aware "Go to Dashboard" CTA.
- **Mobile View:** Fully responsive single-column layout with touch-friendly navigation controls.

### 2. Admin Analytics Dashboard (`/dashboard`)
- **KPI Stat Cards:** Real-time metrics for Total Doctors, Total Patients, and Patients per Doctor ratio.
- **Data Visualizations:** Recharts BarChart (Patients per Doctor) and AreaChart with custom gradients (Monthly Registration & Appointment Trends).
- **Recent Activity:** Live feed of recently assigned patient records and doctor references.

### 3. Doctor Management (`/doctors`)
- **Data Table & Pagination:** Paginated doctor records displaying Name, Specialization, Hospital, Contact Info, and Patient Count badge.
- **Expandable Rosters:** Clickable table rows that expand inline patient rosters with quick-add patient forms and direct deletion.
- **Search & Filters:** Debounced full-text search, specialization dropdown filter, date range filter, and reset action.

### 4. Dedicated Patient Management (`/patients`)
- **Data Table & Pagination:** Comprehensive patient directory displaying Age, Gender, Condition, Appointment Date, and Assigned Doctor.
- **Multi-Param Filtering:** Filter by Medical Condition, Assigned Doctor, Date Range, or Text Search.
- **CRUD Modals:** Zod-validated dialogs for creating, editing, and deleting patient records.

