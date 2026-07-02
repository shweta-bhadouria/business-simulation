
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || 'ADMIN2026';
const DATA_DIR = path.join(__dirname, 'data');
const EXCEL_FILE = path.join(DATA_DIR, 'results.xlsx');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const TEAM_CODES = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA', 'SIGMA'];
const TEAM_NAMES = {
  ALPHA: 'Team Alpha',
  BETA: 'Team Beta',
  GAMMA: 'Team Gamma',
  DELTA: 'Team Delta',
  OMEGA: 'Team Omega',
  SIGMA: 'Team Sigma'
};

const METRIC_KEYS = ['cash', 'revenue', 'customer', 'morale', 'brand', 'compliance', 'future'];
const METRIC_LABELS = {
  cash: 'Cash Position', revenue: 'Revenue Growth', customer: 'Customer Satisfaction', morale: 'Team Morale', brand: 'Brand Reputation', compliance: 'Compliance & Governance', future: 'Future Readiness'
};

let writeQueue = Promise.resolve();
function enqueueWrite(job) {
  writeQueue = writeQueue.then(job).catch(err => console.error('Excel write failed:', err));
  return writeQueue;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function totalScore(metrics = {}) {
  return METRIC_KEYS.reduce((sum, key) => sum + Number(metrics[key] || 0), 0);
}

async function loadWorkbook() {
  ensureDataDir();
  const workbook = new ExcelJS.Workbook();
  if (fs.existsSync(EXCEL_FILE)) {
    await workbook.xlsx.readFile(EXCEL_FILE);
  } else {
    const summary = workbook.addWorksheet('Summary');
    summary.columns = [
      { header: 'Team Code', key: 'teamCode', width: 14 },
      { header: 'Team Name', key: 'teamName', width: 18 },
      { header: 'Phase', key: 'phase', width: 10 },
      { header: 'Round', key: 'round', width: 10 },
      { header: 'Risk Card', key: 'risk', width: 10 },
      { header: 'Business Health Score', key: 'score', width: 22 },
      ...METRIC_KEYS.map(k => ({ header: METRIC_LABELS[k], key: k, width: 20 })),
      { header: 'Updated At', key: 'updatedAt', width: 26 }
    ];

    const events = workbook.addWorksheet('Events');
    events.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 26 },
      { header: 'Team Code', key: 'teamCode', width: 14 },
      { header: 'Team Name', key: 'teamName', width: 18 },
      { header: 'Event Type', key: 'eventType', width: 18 },
      { header: 'Label', key: 'label', width: 32 },
      { header: 'Impact', key: 'impact', width: 40 },
      { header: 'Score After', key: 'scoreAfter', width: 14 },
      { header: 'Narrative / Explanation', key: 'explanation', width: 70 }
    ];

    const decisions = workbook.addWorksheet('Decisions');
    decisions.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 26 },
      { header: 'Team Code', key: 'teamCode', width: 14 },
      { header: 'Round', key: 'round', width: 10 },
      { header: 'Round Title', key: 'roundTitle', width: 34 },
      { header: 'Option', key: 'option', width: 10 },
      { header: 'Decision Title', key: 'decisionTitle', width: 30 },
      { header: 'Decision', key: 'decision', width: 70 },
      { header: 'Strategic Asset/Debt', key: 'asset', width: 30 }
    ];
    await workbook.xlsx.writeFile(EXCEL_FILE);
  }
  return workbook;
}

function applyHeaderStyle(worksheet) {
  const row = worksheet.getRow(1);
  row.font = { bold: true };
  row.alignment = { vertical: 'middle', horizontal: 'center' };
}

function impactToText(impact = {}) {
  return Object.entries(impact).map(([k, v]) => `${METRIC_LABELS[k] || k} ${v > 0 ? '+' : ''}${v}`).join(', ');
}

async function upsertSummary(workbook, payload) {
  const sheet = workbook.getWorksheet('Summary');
  applyHeaderStyle(sheet);
  const code = payload.teamCode;
  const existing = sheet.getRows(2, Math.max(0, sheet.rowCount - 1))?.find(row => row.getCell('teamCode').value === code);
  const rowData = {
    teamCode: code,
    teamName: TEAM_NAMES[code] || payload.teamName || code,
    phase: payload.phase || '',
    round: payload.round ?? '',
    risk: payload.risk ?? '',
    score: totalScore(payload.metrics),
    ...payload.metrics,
    updatedAt: new Date().toISOString()
  };
  if (existing) {
    Object.entries(rowData).forEach(([key, value]) => existing.getCell(key).value = value);
    existing.commit();
  } else {
    sheet.addRow(rowData);
  }
}

async function appendEvents(workbook, payload) {
  const sheet = workbook.getWorksheet('Events');
  applyHeaderStyle(sheet);
  const events = Array.isArray(payload.events) ? payload.events : [];
  for (const event of events) {
    sheet.addRow({
      timestamp: new Date().toISOString(),
      teamCode: payload.teamCode,
      teamName: TEAM_NAMES[payload.teamCode] || payload.teamName || payload.teamCode,
      eventType: event.type || '',
      label: event.label || '',
      impact: impactToText(event.impact || {}),
      scoreAfter: event.scoreAfter ?? totalScore(payload.metrics),
      explanation: event.explanation || ''
    });
  }
}

async function appendDecisions(workbook, payload) {
  const sheet = workbook.getWorksheet('Decisions');
  applyHeaderStyle(sheet);
  const decisions = Array.isArray(payload.decisions) ? payload.decisions : [];
  for (const d of decisions) {
    sheet.addRow({
      timestamp: new Date().toISOString(),
      teamCode: payload.teamCode,
      round: d.round,
      roundTitle: d.roundTitle || d.title || '',
      option: d.option || '',
      decisionTitle: d.decisionTitle || d.optionTitle || '',
      decision: d.decision || '',
      asset: d.asset || ''
    });
  }
}

app.get('/api/teams', (req, res) => {
  res.json({ teams: TEAM_CODES.map(code => ({ code, name: TEAM_NAMES[code] })) });
});

app.post('/api/login/team', (req, res) => {
  const code = String(req.body.teamCode || '').trim().toUpperCase();
  if (!TEAM_CODES.includes(code)) return res.status(401).json({ error: 'Invalid team code' });
  res.json({ ok: true, teamCode: code, teamName: TEAM_NAMES[code] });
});

app.post('/api/login/admin', (req, res) => {
  if (String(req.body.pin || '') !== ADMIN_PIN) return res.status(401).json({ error: 'Invalid admin PIN' });
  res.json({ ok: true });
});

app.post('/api/results', async (req, res) => {
  const payload = req.body || {};
  const code = String(payload.teamCode || '').trim().toUpperCase();
  if (!TEAM_CODES.includes(code)) return res.status(400).json({ error: 'Invalid team code' });
  payload.teamCode = code;

  await enqueueWrite(async () => {
    const workbook = await loadWorkbook();
    await upsertSummary(workbook, payload);
    await appendEvents(workbook, payload);
    await appendDecisions(workbook, payload);
    await workbook.xlsx.writeFile(EXCEL_FILE);
  });

  res.json({ ok: true, score: totalScore(payload.metrics), updatedAt: new Date().toISOString() });
});

app.get('/api/admin/results', async (req, res) => {
  if (String(req.query.pin || '') !== ADMIN_PIN) return res.status(401).json({ error: 'Invalid admin PIN' });
  const workbook = await loadWorkbook();
  const sheet = workbook.getWorksheet('Summary');
  const rows = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    rows.push({
      teamCode: row.getCell('teamCode').value,
      teamName: row.getCell('teamName').value,
      phase: row.getCell('phase').value,
      round: row.getCell('round').value,
      risk: row.getCell('risk').value,
      score: row.getCell('score').value,
      metrics: Object.fromEntries(METRIC_KEYS.map(k => [k, row.getCell(k).value || 0])),
      updatedAt: row.getCell('updatedAt').value
    });
  });
  res.json({ results: rows.sort((a, b) => Number(b.score || 0) - Number(a.score || 0)) });
});

app.get('/api/admin/download-excel', async (req, res) => {
  if (String(req.query.pin || '') !== ADMIN_PIN) return res.status(401).send('Invalid admin PIN');
  await loadWorkbook();
  res.download(EXCEL_FILE, 'startup-strategy-results.xlsx');
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Startup simulation running on port ${PORT}`));
