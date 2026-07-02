# Business Decisioning - Simulation v3

GitHub Pages compatible version with Google Sheet storage.

## Requested UI changes included
- Admin app shows only team-wise score and decision summary.
- Admin login cannot access Play mode.
- Admin PIN display removed from login.
- `≈ 6 months` badge removed.
- Team App header shows logged-in team name.
- Team code list removed from Team/Admin screens and login helper text.
- Storage Fix v2 section removed.
- App renamed to **Business Decisioning - Simulation**.

## Install
1. Replace Apps Script code with `apps-script/Code.gs`.
2. Redeploy Apps Script as a new Web App version with access = Anyone.
3. Put the `/exec` URL and Sheet URL in `app.js`.
4. Upload `index.html`, `style.css`, and `app.js` to GitHub Pages.
