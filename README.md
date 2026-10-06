# Vikas Track Ledger

Build a full-stack web application called “Vikas-Track: Shadow Blockchain Transparency Engine” based strictly on the provided frontend HTML files (project_report_vikas_track.html and ui_ux_design_specification.html) and backend logic described in the VIKAS_TRACK REPORT.

PURPOSE:
A CSR (Corporate Social Responsibility) fund tracking platform that ensures transparency using a lightweight “Shadow Blockchain” system.

TECH STACK:
Frontend: Use the uploaded HTML UI as base (convert to React + Bootstrap 5 components)
Backend: Python Flask REST API
Database: MongoDB (NoSQL)
Charts: Chart.js

CORE FEATURES:
1. Public Landing Page:
- Hero section, stats bar, navigation tiles, impact meter
- Live stats fetched from backend API

2. Corporate Dashboard:
- Deposit CSR funds (₹ → Vikas Tokens 1:1)
- View transactions in table
- Generate blockchain blocks on deposit

3. NGO Dashboard:
- Upload invoice (PDF)
- Generate SHA-256 hash of invoice
- Add transaction as blockchain block

4. Public Ledger (Block Explorer):
- Show all blocks
- Search by company, NGO, project ID, or hash
- Display block cards and modal with full JSON

5. Impact Dashboard:
- KPI tiles
- Charts (sector allocation, monthly flow, top companies)

BACKEND LOGIC:
- Implement Blockchain class:
  - create_genesis_block()
  - create_block(data, previous_hash)
  - hash_block(data + previous_hash using SHA-256)

- MongoDB schema:
  {
    index,
    timestamp,
    data: { company, ngo, amount, project_id, invoice_hash },
    previous_hash,
    current_hash
  }

API ROUTES:
- POST /deposit → create new block
- POST /upload_invoice → hash PDF + create block
- GET /blocks → fetch blockchain
- GET /stats → return dashboard stats

USER FLOWS:
- Corporate logs in → deposits funds → block created
- NGO uploads invoice → hash generated → block added
- Public views ledger → verifies transparency

DESIGN REQUIREMENTS:
- Follow UI/UX spec: minimal light theme, civic teal (#0A7E8C), deep navy header
- Use Poppins + Inter fonts
- CSR.gov.in-inspired layout

EXTRA:
- Add status tags: Verified, Pending, Flagged
- Include mock authentication (no real auth needed)
- Responsive design (desktop, tablet, mobile)

OUTPUT:
A fully working deployable full-stack app with frontend + backend + database integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/677b4e79-dcc4-4c18-9d4c-aacd9e86fb42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
