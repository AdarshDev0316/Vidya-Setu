# VIDYA-SETU (SIH 2026 - Problem Statement SIH26263)
### APAAR ID-Based Student Data Management and Verification Platform
**Organization:** All India Council for Technical Education (AICTE) · Regulation Bureau  
**Theme:** Smart Automation / Software

---

## 🏛️ Project Overview

**VIDYA-SETU** (*Verified Identity, Data & Yield Analytics — Student Enrollment Tracking Utility*) is an integrated, government-grade digital platform designed for AICTE to establish authentic and verifiable student records linked to the national **APAAR ID** (Automated Permanent Academic Account Registry / One Nation One Student ID).

It bridges the structural gap between institutional admission systems, AICTE approval quotas, national academic identity registries, and authorized verification stakeholders (employers, higher education bodies, accreditation agencies).

---

## 🎨 UI & Theme Specifications

- **Design Reference 1 (Portal & Color Palette):** AICTE National Internship Portal (`internship.aicte-india.org`)
  - Primary CTA Color: **AICTE Saffron / Orange (`#E8571A`)**
  - Secondary / Accent Color: **Government Green (`#1B6B3A`)**
  - National Accent: **Indian Tricolor Banner (`#FF9933`, `#FFFFFF`, `#138808`)**
  - Ashoka Navy: **`#003087`**
  - Background: Clean Government White / Neutral Slate (`#FFFFFF`, `#F5F5F5`)
- **Design Reference 2 (Login Screen):** Modern Government Split-Screen Architecture (TARANG / MoTA Portal standard)
  - Left Panel: Government Green gradient (`#1B6B3A`), emblem area, platform features, trust marks.
  - Right Panel: White portal login form with Role dropdown, email, password, mathematical security CAPTCHA, and role-based redirect.

---

## 📋 Comprehensive Coverage of All 10 SIH Requirements

| Req # | Requirement Name | Platform Route / Component | Technology & Implementation |
|---|---|---|---|
| **R1** | Secure Platform/API for Student Uploads | `/dashboard/upload`, `/api/validate` | 4-step upload wizard supporting bulk CSV/Excel, drag-and-drop, field schema mapping, batch integrity checks. |
| **R2** | Prescribed Intake & Demographics Fields | `/dashboard/students`, Database Schema | Tracks Approved Intake, Actual Enrollment, Supernumerary Seats, NRI, OCI, Foreign National (FN), EWS, SC/ST/OBC. |
| **R3** | Automated Validation & Anomaly Detection | `/dashboard/validation`, `/dashboard/duplicates`, `/dashboard/anomalies` | Multi-stage engine: format checks, intra-batch duplicates, cross-institution concurrent enrollment radar (UGC 2022 compliant), intake ceiling checker. |
| **R4** | Real-Time Dashboards for AICTE & Colleges | `/dashboard` (College), `/dashboard/aicte` (Central) | Role-specific dashboards featuring Recharts visual breakdown, intake utilization gauges, state-wise compliance maps. |
| **R5** | Secure Stakeholder Verification Mechanism | `/dashboard/verify`, `/api/verify` | Purpose-limited, consent-driven verification for employers & universities with masked PII and time-bound authorization. |
| **R6** | Verifiable Student Records & Claims | `/dashboard/verify`, `/api/verify` | Cryptographically hashed credential claims (`SHA256:AICTE:REG`), tamper-evident digital verification tokens. |
| **R7** | External System & ERP Integration | `/dashboard/settings`, API REST Endpoints | Standard RESTful JSON endpoints (`/api/v1/batches`) and ERP API keys for seamless integration with institutional software. |
| **R8** | Security, RBAC, DPDP Consent & Audit Trails | `/dashboard/audit` | Role-Based Access Control (8 roles), student consent ledger under DPDP Act 2023, SHA-256 tamper-evident system audit log. |
| **R9** | Policy-Making, Regulatory & Accreditation Reports | `/dashboard/reports` | Exportable BI reports (PDF/CSV) covering category utilization, state compliance, anomaly frequency, and intake trends. |
| **R10**| Certificate APAAR & Student ID Display | `/dashboard/credentials` | Verifiable graduation certificate generator rendering both APAAR ID and Institutional Student ID, dynamic QR code, and golden AICTE seal. |

---

## 🔌 Real-World Government API Integration Roadmap

When preparing for live national production with AICTE, here is how you connect to official government gateways:

### 1. APAAR / ABC / DigiLocker APIs
- **Provider:** National Academic Depository (NAD) / DigiLocker under National e-Governance Division (NeGD) & Ministry of Education.
- **Portal:** [partners.digitallocker.gov.in](https://partners.digitallocker.gov.in/) and [apaar.education.gov.in](https://apaar.education.gov.in/)
- **Process to obtain:**
  1. The institution or AICTE registers as an authorized **Issuer / Verifier Partner** on DigiLocker Partner Portal.
  2. Complete Org KYC and sign MoU with NeGD.
  3. Obtain OAuth 2.0 Client ID, Client Secret, and X-API-KEY.
  4. Integration endpoints:
     - Pull Student Academic Record: `POST /api/v1/pull/student-record`
     - Verify APAAR Identity: `POST /api/v2/apaar/verify-auth`

### 2. API Setu (Government API Gateway)
- **Portal:** [apisetu.gov.in](https://apisetu.gov.in/)
- **Process to obtain:**
  1. Register on API Setu using government email domain (`@gov.in` or `@nic.in`).
  2. Request subscription to Higher Education APIs (AICTE Institutional Data, AISHE Registry).
  3. Receive HMAC keys and IP whitelisting for backend communication.

*Note for SIH Evaluation: The prototype includes built-in realistic mock adapters and API routes that replicate all payload schemas, status codes, and error conditions expected by these live gateways.*

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js 18+ (tested on Node v20)
- npm or pnpm

### Running Development Server
```bash
cd d:\SIH\apaar-platform
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
cd d:\SIH\apaar-platform
npm run build
npm start
```

---

## 👥 Demo Logins & Roles

Navigate to `/login` and select any role:
- **Institution Admin:** `admin@iitb.ac.in` / `Admin@123` → Accesses Institution Dashboard, batch upload, student records.
- **AICTE Officer / Analyst:** `officer@aicte.gov.in` / `Officer@123` → Accesses AICTE National Monitor, state-wise compliance, policy reports.
- **Employer / Verifier:** `employer@infosys.com` / `Employer@123` → Accesses Authorized Verification portal with masked records.
- **Student:** `student@iitb.ac.in` / `Student@123` → Accesses individual records and credential previews.

*Built with Next.js 14, TypeScript, Tailwind CSS, Recharts, and Lucide React.*
