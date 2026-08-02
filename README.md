<div align="center">

<h1 align="center">
  <b style="font-size: 2.5rem; font-weight: 800; ">Doctor Tracker</b>
</h1>

<h3 align="center"><b>Admin Portal for Healthcare Management</b></h3>

<br />

![Doctor Tracker Dashboard](https://i.ibb.co.com/DPKTMHs8/screencapture-localhost-3000-dashboard-2026-08-02-15-39-33.png)

<br />

</div>

---

> **Doctor Tracker** is a full-stack administrative platform built with **Next.js** and **MongoDB** that gives healthcare administrators a single, blazing-fast interface to manage doctor registrations, patient assignments, and clinical analytics — powered by optimized aggregation pipelines, secure JWT authentication, and a modern responsive UI with real-time data visualization.

---

## ⚡ Quick Start

> **Get the app running locally in under 5 minutes.**

### Prerequisites

| Tool | Version | Check |
|:-----|:--------|:------|
| **Node.js** | v18 or higher | `node -v` |
| **npm** | v9 or higher | `npm -v` |
| **MongoDB** | Atlas cluster _or_ local instance | — |
| **Git** | Any recent version | `git --version` |

<br />

### 1️⃣ Clone & Install

```bash
git clone https://github.com/mahaamudul/doctor-tracker.git
cd doctor-tracker
npm install
```

### 2️⃣ Configure Environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and update the variables:

```env
# MongoDB connection string (Atlas or local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/doctor_tracker?retryWrites=true&w=majority

# NextAuth — generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET=your_super_secret_jwt_key_here
NEXTAUTH_URL=http://localhost:3000

# Admin account created by the seed script
ADMIN_EMAIL=admin@doctortracker.com
ADMIN_PASSWORD=AdminSecurePassword123!
```

### 3️⃣ Seed the Database

This creates the admin user and populates sample doctors & patients:

```bash
npm run seed
```

### 4️⃣ Run the App

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser — you're in! 🎉

<br />

### 🔑 Demo Credentials

| Field | Value |
|:------|:------|
| **Email** | `admin@doctortracker.com` |
| **Password** | `AdminSecurePassword123!` |

---

## 🏗️ System Architecture

> **Three-tier full-stack architecture** — every request flows through authentication, validation, and an optimized service layer before touching the database.

<br />

<div align="center">

[![System Architecture](https://mermaid.ink/img/pako:eNqlVktu40YQvUqDxgxkQJYp6s8AASiS8miijyPJdmasWbTItsSYYhNNMrbG9BmCDIIAySab5A5Z5TC5QHKEVJNsifqNEUQrVrHqdfWrqic-SRa1iaRKdy59sBaYhWhiTNnUQ_B79QqdnZ2h8eRdrzu4QK_R5I3Z50_gFTGWi4PAIHfw4BAvRHeO66onptxROmYxCBm9J-qJrDSreiMzzx4cO1yoiv9YtKhLGbyu1Fta-Ys9SB_PSQbYMTuVNYJ6YrQaDbl-FLBdrVXk1j4gjsLFGtBUTGUDqCt15Thgq1Vul9sHAH0nwzP0jm5uCizXtUpVO4pXrjXlirGPZ89EeRWz2ems4VqVSsU8DldvK2WtmcDt9M78ZmKOBloPmYNJd_Iu3znNXjpe4XYq_fPrD7-lFroKCJtKH05VVU37eQCyZ16bPVRWUWc0HEzMgYEutQtznIcOotmcYX-BOox6IfFslBzz0-9___E90tNB6eEVYagwII9h6dsAab6PRjQKCTuFAgQQ__Xo3PEuYRQAI3lG3IAgKJJPSD7WwMFiRjGzs_i1neSgwogkMx6cHkmnVkhZIJJTC_WxB44lL_r4yZc45NcSucJ8ORnYOUqyoiLtCpYOeqdrk-5wADvY7xpGz7zRRuZBxsfEipgTrlLGf_y0cbxGFzgkD3gV7BDcd2zbhReMF570IOdChbc3E3RNmHPnWHAp6mXc8V3Ko_BGauADDPHI-_oGe4DE9nM-d--Kitqa_hWfLe2yC5WPzdF1Vz8yZG1s3Wcz9tcvP_MREx6eLOYMZA7qOc_mbXfINA-7q9CxAkgBnHNY7HMsfFnxvrM_K7lwOx2Xg8HZOOSi_WxADoa_p_Y1dp-mEjygsbUgS4zA4dhJA6bS83_gsqoiQ5tobW1sgpIPR0dINHCIZzgg6dx8-nPjyAjsU29OjTbSQhCrXfq4bgRG-7YwlW4LiYF06rrESgbmw1Q65be0ZweWTWSJbXsxT6yWSFyv2mczD1PEmUGd3vAG6cPBwNT5jm3xk4vn10JdkDOGk0OCLSGFpC_jcgnpjNhQjYPdIN5I136oUkID_J0zh5UMYMCvHfIACVv6tZ9UKWV6IsiL85K1H19dxwuS4i2h2mGE7yzqwIeA8K3rT9DG0WzphKkzXu-7iBV2Evp1RNhqm4tsRER4ZibRIxJGzMvqhgu9AN4NgoggLktjEgTQiThN3blNqmSXjIbpUIhXWxwD9TkGwcrTk57mWW5kp-fplN47JM7JowDNCSZP4rVS5nwkdizEaJdrkCa-Ylt8b5fGgToktBaoT0IGOhRvydS63Tlfevh8zggfrOSAOLcwm9umjVifm6OAI-ijKwMNfZj0ZNDjjdhtZ4gTM20isB5-FMaZfonY1NoEQkErl2I7PlzMXgf2qtmo6U7O_61nw5RUlObMsSU1ZBEpSkvClpib0hPHmEohaDL8mavwaGN2P5Wm3jPk-Nh7T-lSpDEazReSegcLAFbk85oMB4PiLtdeBrNBmE4jL5RUpdwqSsR2gJV--l2efJ4nwJL6JD1Kar1aajZqsiw3m_VaS5YhYSWptWqpodRk-OqtVZVm87kofUzqkLNguVxu1RrNulJ9_hf57tSu?type=png)](https://mermaid.live/edit#pako:eNqlVktu40YQvUqjjRnYgCyLpCxLDBCAIimPJvo4kmxnxppFm2xLjCm20CRja0yfIcggCJBssknukFUOkwskR0g1yZao3xhBtGIVq15Xv6p64hN2mEuxju989uBMCY_QyBrzcYDg9-oVOj4-RsPRu067d45eo9EbuyuewCtjHJ-EoUXv4MGjQYTuPN_XD-xKS23ZpTDi7J7qBxW1XjXPcvP4wXOjqa7OH0sO8xmH11qtYShfbEHOyYTmgC27pS0R9AOrcXZWqe0FbFZPtUpjG5DE0XQJaKu2ugI01Zq6H7DRUJpKcwfg3MvxLLNl2qsClZqhVY29eMppvaJZ23jurSxPs-ut1hKuoWmavR-u1lQVo57CbfTO_mZkD3pGB9m9UXv0rtg5w515weHNGP_z6w-_ZRa6DCkf4w9Huq5n_dwB2bGv7A5SdNQa9Hsju2ehC-PcHhahw_h2wsl8ilqcBRENXJQe89Pvf__xPTKzQemQBeXosEcfo_K3ITLmczRgcUT5ERQggcSvwyZecAGjABjpMxIGBEGRYkKKsRYJp7eMcDePX9ppDjoc0HTGw6M96cyJGA9lcmahLgnAMRNF7z_5gkTiWjJXmi8nAzt7SVZ1ZFzC0kHvTGPU7vdgB7tty-rY18bA3sn4kDox96JFxviPn1aO1-icRPSBLMINgrue6_rwgovC0x4UXOjw7fUIXVHu3XkOXIoFOXdil4ooopEG-ABDPoq-viEBIPHtnM_dW9NR0zC_ErNlXLSh8qE9uGqbe4asSZz7fMb--uVnMWLSI5LlnIHMQT0n-bxtDpkREH8ReU4IKYBzAot9QqQvL37ubc9KIdzNxmVncD4Oheh5PiA7w98z94r4T2MMD2joTOmMIHB4btqAMX7-D1xWdWQZI6NpDG1Q8v5gD4kWicgtCWk2N5_-XDlyArssmDCriYwIxGqTPqEbodW8ORzjm8PUQCbzfeqkA_NhjI_ELd3bHcsms-S2vZgnV0smLlfts5m7KRLMoFanf43Mfq9nm2LH1vgpxItroTbIGSfpIeGakELSl4lSRianLlTjET9MVtK1HaqWUY98501gJUMY8CuPPkDCmn5tJ2nlXE8keUlRsrbjq8t4SVKyJlQbjIidRS34EJC-Zf0p2jC-nXlR5kyW-y5jpZ2Gfh1TvljnIh8RGZ6bafSARjEP8rrhQi-At8MwpkjI0pCGIXQiyVI3bpMp2QVnUTYU8tUax0B9gUGwivRkpwWOH7vZeSZj9x5NCvIoQQuCKZJErYx7H6mbSDHa5BqkSazYGt_rpQmgFo2cKerSiIMOJWsytWx3wZcdPplwKgYrPSApLMzqtlkjlucWKBAI5uDSQv05THo66MlK7NYz5Im5NlFYj3kcJbl-ydjMWgVCQQufETfZXcxWB7aqWanpRs7_rWfFFC7hCfdcrEc8piU8o3xGhImfBMYYR6DJ8Geuw6NL-P0Yj4NnyJmT4D1jM5nGWTyZYv0OFgCseC5qsjwCijtbejnMBuUmi4MI66pSK2HqesBKN_suTz_PU2CsP-FHrNe0cq122qjXlKqiaY2qVsILrJ-VFbXaqDdqSqNROatV1OcS_phWUinXz06f_wXjBNKE)

</div>

<br />

The architecture follows a **clean three-tier pattern** where the client, server, and database layers are fully decoupled:

| Layer | Responsibility |
|:------|:---------------|
| **Client Browser** | React pages (Home, Login, Dashboard, Doctors, Patients) with Recharts for data visualization |
| **Next.js Server** | Auth Middleware (JWT gate) → REST API routes → Zod schema validation → dedicated Service Layer |
| **MongoDB Atlas** | Three indexed collections — `Users`, `Doctors` (B-Tree), `Patients` (Compound Index) |

<br />

**Data Flow** — User authenticates via NextAuth.js Credentials Provider → JWT token issued → Middleware validates token on every protected route → API routes validate input with Zod → Service layer executes optimized Mongoose queries (`.lean()`, `$facet` aggregation, regex search) → Response rendered via React components.

---

## 🛠️ Technical Decisions

### 1️⃣ Why a Single `$facet` Aggregation Pipeline for Analytics (Instead of Multiple Queries)

**Decision:** All dashboard KPIs and chart data are computed in a single MongoDB `$facet` aggregation call in `analytics.service.js`.

**Rationale:**
- **Reduced round trips:** A single `$facet` pipeline computes total patients, patients-per-doctor distribution, registration trends, and appointment trends in **one database call** instead of 4-5 separate queries. This cuts network latency by ~80% on cold starts.
- **Atomic consistency:** All metrics are computed from the same snapshot of data, preventing inconsistencies between cards and charts.
- **Server-side computation:** Complex grouping, sorting, and lookups happen inside MongoDB's optimized C++ aggregation engine rather than in JavaScript, which is significantly faster for large datasets.

**Trade-off:** The pipeline is more complex to read, but the performance gain (O(1) DB call vs. O(N) calls) is decisive for an analytics dashboard that loads on every visit.

<br />

### 2️⃣ Why a Decoupled Service Layer (Instead of Inline Mongoose Calls in API Routes)

**Decision:** All database logic lives in dedicated service files (`doctor.service.js`, `patient.service.js`, `analytics.service.js`) rather than directly in the Next.js API route handlers.

**Rationale:**
- **Single Responsibility:** API routes focus exclusively on HTTP concerns (parsing params, validating input, returning responses). Services own the query logic. This makes both layers independently testable.
- **Reusability:** The same `getDoctors()` service can be called from multiple API routes (e.g., the main listing and the patient form's doctor dropdown) without duplicating query logic.
- **Cascade safety:** The `deleteDoctor()` service encapsulates the business rule "cannot delete a doctor who has patients" — ensuring this constraint is enforced regardless of which route triggers the deletion.
- **Optimization surface:** All performance-critical patterns (`.lean()`, compound indexes, batch aggregation of patient counts) are centralized in one place, making it easy to audit and optimize queries.

---

## 💻 Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | JavaScript (ES6+) |
| **Database** | MongoDB + Mongoose |
| **Authentication** | NextAuth.js v4 (JWT) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui (base-nova) |
| **Charts** | Recharts |
| **Validation** | Zod |
| **Notifications** | Sonner |
| **Icons** | Lucide React |

---

## 📸 Visual Evidence — Full User Journey

> A complete walkthrough of every screen an admin encounters, from landing to full CRUD operations.

<br />

### 1️⃣ Home Page — `/`

The public landing page introduces the platform. A prominent **"Go to Dashboard"** button lets the user proceed — if not logged in, they're automatically redirected to the login screen.

| Desktop | Mobile |
|:-------:|:------:|
| ![Home Desktop](https://i.ibb.co.com/4k1z3nW/screencapture-localhost-3000-2026-08-02-15-23-44.png) | ![Home Mobile](https://i.ibb.co.com/KcxSStqn/screencapture-localhost-3000-2026-08-02-15-33-45.png) |

---

### 2️⃣ Login Page — `/login`

Secure authentication gate. The admin enters their **email** and **password**. Credentials are verified against bcrypt-hashed records via NextAuth.js Credentials Provider. On success, a JWT session token is issued and the user is redirected to the dashboard.

| Desktop | Mobile |
|:-------:|:------:|
| ![Login Desktop](https://i.ibb.co.com/1JbRZ7kB/screencapture-localhost-3000-login-2026-08-02-15-36-39.png) | ![Login Mobile](https://i.ibb.co.com/d0GgjhdG/screencapture-localhost-3000-login-2026-08-02-15-35-39.png) |

---

### 3️⃣ Dashboard — `/dashboard`

The admin's command center. Real-time analytics at a glance:

- **Stat Cards** — Total Doctors, Total Patients, Patients per Doctor ratio
- **Bar Chart** — Patients per Doctor distribution (Recharts)
- **Area Chart** — Monthly Registration & Appointment Trends
- **Recent Activity** — Latest patient registrations with assigned doctor info

| Desktop | Mobile |
|:-------:|:------:|
| ![Dashboard Desktop](https://i.ibb.co.com/DPKTMHs8/screencapture-localhost-3000-dashboard-2026-08-02-15-39-33.png) | ![Dashboard Mobile](https://i.ibb.co.com/39VXFcDS/screencapture-localhost-3000-dashboard-2026-08-02-15-42-30.png) |

---

### 4️⃣ Doctor Management — `/doctors`

Full CRUD interface for managing the doctor registry:

- **Doctor Table** — Paginated list showing Name, Specialization, Hospital, Phone, Email, and Patient Count
- **Search** — Debounced partial-match search across name, specialization, and hospital
- **Filters** — Specialization dropdown, appointment date range picker, one-click Reset
- **Expand Row** — Click any doctor to reveal their assigned patient roster inline
- **Add Patient Under Doctor** — Quick-add form inside the expanded roster
- **Edit / Delete** — Inline action buttons per doctor row

| Desktop | Mobile |
|:-------:|:------:|
| ![Doctors Desktop](https://i.ibb.co.com/nNG80zcK/screencapture-localhost-3000-doctors-2026-08-02-15-44-56.png) | ![Doctors Mobile](https://i.ibb.co.com/Fqs0nDSZ/screencapture-localhost-3000-doctors-2026-08-02-15-46-43.png) |

<br />

#### ➕ Add Doctor Modal

Click **"+ Add Doctor"** to open a Zod-validated form dialog with fields for Name, Specialization, Hospital, Phone, and Email.

<div align="center">

![Add Doctor Desktop](https://i.ibb.co.com/CpRpv2xR/image.png)

</div>

---

### 5️⃣ Patient Management — `/patients`

Dedicated page for managing all patient records across every doctor:

- **Patient Table** — Paginated list showing Name, Age, Gender, Condition, Appointment Date, and Assigned Doctor
- **Search** — Partial-match search across name and condition
- **Filters** — Condition dropdown, assigned doctor dropdown, appointment date range, one-click Reset
- **Edit / Delete** — Inline action buttons per patient row

| Desktop | Mobile |
|:-------:|:------:|
| ![Patients Desktop](https://i.ibb.co.com/5Wq17vwF/screencapture-localhost-3000-patients-2026-08-02-15-51-01.png) | ![Patients Mobile](https://i.ibb.co.com/Mkw256HM/screencapture-localhost-3000-patients-2026-08-02-15-53-18.png) |

<br />

#### ➕ Add Patient Modal

Click **"+ Add Patient"** to open a Zod-validated form dialog with fields for Name, Age, Gender, Condition, Appointment Date, and Doctor assignment.

<div align="center">

![Add Patient Desktop](https://i.ibb.co.com/zWfnx5kV/image.png)

</div>

---