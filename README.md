# Startup Strategy Simulation — GitHub Pages + Google Sheet Excel Storage

This version works on **GitHub Pages** because the app is static HTML/JS. It does **not** use localStorage. Data is saved into a Google Sheet through Google Apps Script.

## Important reality
GitHub Pages cannot directly write to a real `.xlsx` file because it is static hosting. This solution stores results in a Google Sheet, which Admin can download as **Microsoft Excel (.xlsx)** via **File → Download → Microsoft Excel (.xlsx)**.

## Team codes
- ALPHA
- BETA
- GAMMA
- DELTA
- OMEGA
- SIGMA

## Admin PIN
Default: `ADMIN2026`

## Setup

### 1. Create Google Sheet
Create a new Google Sheet. Rename it something like `Startup Strategy Results`.

### 2. Add Apps Script
In Google Sheet:
- Extensions → Apps Script
- Delete any existing code
- Paste `apps-script/Code.gs`
- Save

### 3. Deploy Apps Script
- Deploy → New deployment
- Type: Web app
- Execute as: Me
- Who has access: Anyone
- Deploy
- Copy the `/exec` Web App URL

### 4. Configure index.html
Open `index.html` and replace:

```js
const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const SHEET_URL = "PASTE_YOUR_GOOGLE_SHEET_URL_HERE";
```

### 5. Deploy to GitHub Pages
Upload `index.html` to your GitHub repository and enable Pages from the repository settings.

## Admin workflow
- Login as Admin using `ADMIN2026`
- Click **Refresh Scores**
- Click **Open Sheet / Download Excel**
- In Google Sheets: File → Download → Microsoft Excel (.xlsx)

## Notes
- This is safe for GitHub Pages because no secret service token is embedded.
- The Admin PIN is visible in static code, so it is a facilitation PIN, not enterprise-grade security.
- If you need strong security, you need a backend or authenticated Google workspace flow.
