# Startup Strategy Simulation — Excel Storage Version

This version is designed for deployment from GitHub to a Node hosting platform such as Render, Railway, Azure App Service, or any VM/container that supports persistent file storage.

> Important: GitHub Pages is static and cannot write to Excel. This package uses a Node/Express backend to write `data/results.xlsx`.

## Team Codes
- ALPHA
- BETA
- GAMMA
- DELTA
- OMEGA
- SIGMA

## Admin
- Default Admin PIN: `ADMIN2026`
- Override with environment variable: `ADMIN_PIN`

## Run locally
```bash
npm install
npm start
```
Open: http://localhost:3000

## Admin Excel
- Admin app shows server-side scores.
- Download Excel from Admin tab.
- Direct download: `/api/admin/download-excel?pin=ADMIN2026`

## Excel sheets
- `Summary`: latest score for each team
- `Events`: long-term reveals, risk reveals, phase changes
- `Decisions`: decisions selected by each team

## Deployment note
Use a deployment service with persistent disk/storage if you want the Excel file to survive restarts. If persistent disk is unavailable, replace the Excel file storage with a database or cloud storage.
