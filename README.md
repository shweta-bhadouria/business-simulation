# GitHub Pages + Google Sheet Storage Fix v2

This package fixes the issues you saw:

1. `Could not reach Apps Script` after a few rounds  
   - Cause: the older version wrote data using JSONP GET URLs. After several rounds, the state became too large for a URL.
   - Fix: writes now use POST (`doPost`) with `no-cors`. Reads still use small JSONP GET requests.

2. Decisions sheet stopped at Round 6  
   - Cause: Round 7 payload was usually the first to exceed URL size limits.
   - Fix: POST writes allow Round 7 and later events to be saved.

3. Admin showed only Alpha / opened in Play mode  
   - Fix: Admin login now opens directly on the Admin tab and reads all teams from the Sheet Summary.

## Files
- `index.html` — GitHub Pages file
- `style.css` — styling
- `app.js` — game + GitHub Pages client logic
- `apps-script/Code.gs` — Google Apps Script backend

## Setup
1. Replace your Apps Script code with `apps-script/Code.gs`.
2. Redeploy Apps Script as a **new version**:
   - Deploy → Manage deployments → Edit → Version: New version → Deploy
   - Execute as: Me
   - Access: Anyone
3. Copy the `/exec` URL.
4. In `app.js`, replace:

```js
const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const SHEET_URL = "PASTE_YOUR_GOOGLE_SHEET_URL_HERE";
```

5. Upload `index.html`, `style.css`, and `app.js` to GitHub Pages.

## Admin
PIN: `ADMIN2026`

Team codes:
- ALPHA
- BETA
- GAMMA
- DELTA
- OMEGA
- SIGMA

## Excel
Open the Google Sheet and use:

File → Download → Microsoft Excel (.xlsx)
