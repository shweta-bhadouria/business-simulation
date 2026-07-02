/**
 * Startup Strategy Simulation storage for GitHub Pages.
 * Stores data in Google Sheets and lets Admin read consolidated results.
 * Deploy as: Web app -> Execute as: Me -> Who has access: Anyone.
 */

const ADMIN_PIN = 'ADMIN2026';
const TEAM_CODES = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA', 'SIGMA'];
const TEAM_NAMES = {
  ALPHA: 'Team Alpha', BETA: 'Team Beta', GAMMA: 'Team Gamma',
  DELTA: 'Team Delta', OMEGA: 'Team Omega', SIGMA: 'Team Sigma'
};
const METRIC_KEYS = ['cash', 'revenue', 'customer', 'morale', 'brand', 'compliance', 'future'];
const METRIC_LABELS = {
  cash: 'Cash Position', revenue: 'Revenue Growth', customer: 'Customer Satisfaction',
  morale: 'Team Morale', brand: 'Brand Reputation', compliance: 'Compliance & Governance', future: 'Future Readiness'
};

function doGet(e) {
  try {
    const p = e.parameter || {};
    const action = String(p.action || '').trim();
    const callback = String(p.callback || 'callback');
    let result;
    if (action === 'save') result = save_(p);
    else if (action === 'results') result = results_(p);
    else if (action === 'getTeam') result = getTeam_(p);
    else result = { ok: false, error: 'Unknown action' };
    return jsonp_(callback, result);
  } catch (err) {
    return jsonp_((e.parameter || {}).callback || 'callback', { ok: false, error: String(err) });
  }
}

function jsonp_(callback, obj) {
  const safe = callback.replace(/[^a-zA-Z0-9_.$]/g, '');
  return ContentService
    .createTextOutput(`${safe}(${JSON.stringify(obj)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function checkPin_(pin) {
  if (String(pin || '') !== ADMIN_PIN) throw new Error('Invalid admin PIN');
}

function ss_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheets_(ss);
  return ss;
}

function ensureSheets_(ss) {
  const summary = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  const events = ss.getSheetByName('Events') || ss.insertSheet('Events');
  const decisions = ss.getSheetByName('Decisions') || ss.insertSheet('Decisions');
  if (summary.getLastRow() === 0) summary.appendRow(['Team Code','Team Name','Phase','Round','Risk Card','Business Health Score','Cash Position','Revenue Growth','Customer Satisfaction','Team Morale','Brand Reputation','Compliance & Governance','Future Readiness','Full State JSON','Updated At']);
  if (events.getLastRow() === 0) events.appendRow(['Timestamp','Team Code','Event Type','Label','Impact','Score After','Explanation']);
  if (decisions.getLastRow() === 0) decisions.appendRow(['Timestamp','Team Code','Round','Round Title','Option','Decision Title','Decision','Strategic Asset/Debt']);
  [summary, events, decisions].forEach(sh => sh.getRange(1,1,1,sh.getLastColumn()).setFontWeight('bold'));
}

function total_(metrics) {
  metrics = metrics || {};
  return METRIC_KEYS.reduce((s, k) => s + Number(metrics[k] || 0), 0);
}

function impactText_(impact) {
  impact = impact || {};
  return Object.keys(impact).map(k => `${METRIC_LABELS[k] || k} ${impact[k] > 0 ? '+' : ''}${impact[k]}`).join(', ');
}

function save_(p) {
  checkPin_(p.pin);
  const code = String(p.teamCode || '').toUpperCase();
  if (!TEAM_CODES.includes(code)) throw new Error('Invalid team code');
  const state = JSON.parse(p.state || '{}');
  const metrics = state.metrics || {};
  const ss = ss_();
  const summary = ss.getSheetByName('Summary');
  const teamRow = findTeamRow_(summary, code);
  const rowData = [
    code,
    TEAM_NAMES[code] || code,
    state.phase === 2 ? 'Phase 2' : 'Phase 1',
    Number(state.round || 0) + 1,
    Number(state.risk || 0) + 1,
    total_(metrics),
    ...METRIC_KEYS.map(k => Number(metrics[k] || 0)),
    JSON.stringify(state),
    new Date()
  ];
  if (teamRow) summary.getRange(teamRow, 1, 1, rowData.length).setValues([rowData]);
  else summary.appendRow(rowData);

  const events = JSON.parse(p.events || '[]');
  if (events.length) {
    const sh = ss.getSheetByName('Events');
    events.forEach(ev => sh.appendRow([new Date(), code, ev.type || '', ev.label || '', impactText_(ev.impact), ev.scoreAfter || total_(metrics), ev.explanation || '']));
  }

  const decisions = JSON.parse(p.decisions || '[]');
  if (decisions.length) {
    const sh = ss.getSheetByName('Decisions');
    decisions.forEach(d => sh.appendRow([new Date(), code, d.round || '', d.roundTitle || '', d.option || '', d.decisionTitle || '', d.decision || '', d.asset || '']));
  }
  return { ok: true, score: total_(metrics), updatedAt: new Date().toISOString() };
}

function findTeamRow_(sheet, code) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const values = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) if (String(values[i][0]).toUpperCase() === code) return i + 2;
  return null;
}

function results_(p) {
  checkPin_(p.pin);
  const ss = ss_();
  const sh = ss.getSheetByName('Summary');
  const last = sh.getLastRow();
  if (last < 2) return { ok: true, results: [] };
  const rows = sh.getRange(2, 1, last - 1, 15).getValues();
  const results = rows.map(r => ({
    teamCode: r[0], teamName: r[1], phase: r[2], round: r[3], risk: r[4], score: r[5],
    metrics: { cash:r[6], revenue:r[7], customer:r[8], morale:r[9], brand:r[10], compliance:r[11], future:r[12] },
    updatedAt: r[14] ? new Date(r[14]).toISOString() : ''
  })).sort((a,b) => Number(b.score || 0) - Number(a.score || 0));
  return { ok: true, results };
}

function getTeam_(p) {
  checkPin_(p.pin);
  const code = String(p.teamCode || '').toUpperCase();
  if (!TEAM_CODES.includes(code)) throw new Error('Invalid team code');
  const ss = ss_();
  const sh = ss.getSheetByName('Summary');
  const row = findTeamRow_(sh, code);
  if (!row) return { ok: true, state: null };
  const state = sh.getRange(row, 14).getValue();
  return { ok: true, state };
}
