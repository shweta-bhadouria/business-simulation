const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQF1AQwLaB_DjShOsZ3YbOItVKXs035Y3zP8dpy3dkLjpbY9AwhCwuQfui1a2_HbyN/exec";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/19oOrnAzZ1bcCEglXCMlQwbm_dEXy2ARrtXtYwlwFDHM/edit?usp=sharing";
const ADMIN_PIN = "ADMIN2026";

const TEAM_CODES = ["ALPHA", "BETA", "GAMMA", "DELTA", "OMEGA", "SIGMA"];

const TEAM_NAMES = {
  ALPHA: "Team Alpha",
  BETA: "Team Beta",
  GAMMA: "Team Gamma",
  DELTA: "Team Delta",
  OMEGA: "Team Omega",
  SIGMA: "Team Sigma"
};

const M = ["cash", "revenue", "customer", "morale", "brand", "compliance", "future"];

const L = {
  cash: "Cash Position",
  revenue: "Revenue Growth",
  customer: "Customer Satisfaction",
  morale: "Team Morale",
  brand: "Brand Reputation",
  compliance: "Compliance & Governance",
  future: "Future Readiness"
};

const SRT = {
  cash: "Cash",
  revenue: "Revenue",
  customer: "Customer",
  morale: "Morale",
  brand: "Brand",
  compliance: "Compliance",
  future: "Future"
};

const INIT = {
  cash: 75,
  revenue: 75,
  customer: 75,
  morale: 75,
  brand: 75,
  compliance: 75,
  future: 75
};

const rounds = [
  [
    "Market Risk & Product Fitment",
    "A well-funded competitor enters with aggressive pricing. Lead conversions drop and the sales team pushes discounts.",
    [
      ["A", "Reduce Pricing", "Match competitor pricing to retain customers.", { cash: -10, revenue: 12, customer: 5, brand: -3 }, "Pricing Pressure", { revenue: -5 }, "Discounting protects short-term revenue but trains the market to expect lower pricing."],
      ["B", "Launch Premium Offering", "Differentiate through premium service and quality.", { cash: -8, revenue: 6, customer: -5, brand: 10 }, "Premium Brand", { brand: 5 }, "Premium positioning compounds as customers associate the company with quality and trust."],
      ["C", "Invest in Customer Experience", "Improve onboarding, service and customer support.", { cash: -8, revenue: 2, customer: 12, brand: 6 }, "Customer Trust", { customer: 5 }, "Better customer experience improves retention, referrals and confidence over time."]
    ]
  ],
  [
    "Cash Flow & Going Concern",
    "Customer collections slow. Sales remain healthy but cash reserves reduce rapidly.",
    [
      ["A", "Working Capital Loan", "Borrow funds to continue growth.", { cash: 15, revenue: 6, brand: -2 }, "Working Capital Loan", { cash: -10 }, "Borrowing allows growth now, but repayment reduces future flexibility."],
      ["B", "Slow Expansion", "Delay expansion to preserve cash.", { cash: 10, revenue: -5, compliance: 4 }, "Financial Discipline", { cash: 5 }, "Disciplined expansion creates resilience when the market becomes uncertain."],
      ["C", "Delay Technology Investment", "Preserve cash by postponing technology upgrades.", { cash: 12, future: -12 }, "Technology Debt", { future: -5 }, "Deferred technology work compounds into slower execution and reduced readiness."]
    ]
  ],
  [
    "Reputation Risk",
    "A dissatisfied customer posts a complaint on social media that gains attention.",
    [
      ["A", "Public Apology & Compensation", "Publicly acknowledge the mistake and compensate the customer.", { cash: -6, customer: 10, brand: 12 }, "Customer Confidence", { brand: 3, customer: 3 }, "Owning the issue visibly strengthens customer confidence and brand trust."],
      ["B", "Resolve Privately", "Resolve directly with the customer without public communication.", { customer: 8, brand: -3 }, "Media Doubt", { brand: -3 }, "Private resolution fixes the customer issue but leaves public uncertainty unresolved."],
      ["C", "Leadership Communication", "Founder openly communicates corrective actions.", { brand: 8, morale: 8 }, "Trusted Leadership", { morale: 5 }, "Transparent leadership calms teams and stakeholders during ambiguity."]
    ]
  ],
  [
    "Technology & Knowledge Upgradation",
    "Competitors are adopting AI and automation. Budget allows only one strategic investment.",
    [
      ["A", "Invest in Technology", "Upgrade AI and automation.", { cash: -12, revenue: 3, future: 18 }, "Digital Advantage", { revenue: 5 }, "Technology capability improves productivity and creates future revenue opportunities."],
      ["B", "Invest in Employee Learning", "Upskill employees.", { cash: -8, morale: 10, future: 12 }, "Learning Culture", { morale: 5, future: 5 }, "A learning culture compounds because people keep adapting after the investment."],
      ["C", "Balanced Investment", "Invest moderately in both.", { cash: -10, revenue: 3, morale: 5, future: 8 }, "Balanced Capability", { future: 3 }, "Balanced investment avoids overconcentration and builds moderate capability."]
    ]
  ],
  [
    "Compliance & Governance",
    "A surprise regulatory audit identifies governance gaps.",
    [
      ["A", "Strong Governance", "Invest in governance systems and SOPs.", { cash: -10, brand: 5, compliance: 18 }, "Audit Ready", { compliance: 5 }, "Strong governance is expensive upfront but protects against future shocks."],
      ["B", "Critical Fixes Only", "Resolve only mandatory issues.", { cash: -4, compliance: 7 }, "Critical Fixes", {}, "Minimum fixes reduce immediate risk but do not create durable advantage."],
      ["C", "Growth First", "Continue prioritising business growth.", { revenue: 12, compliance: -15 }, "Governance Debt", { brand: -5 }, "Ignoring governance may boost growth, but governance debt erodes trust."]
    ]
  ],
  [
    "External Stakeholder Management",
    "A partner generating 35% of business demands exclusivity.",
    [
      ["A", "Accept Exclusivity", "Accept their terms.", { cash: 5, revenue: 12, brand: -2 }, "Dependency Risk", { revenue: 3 }, "Exclusivity boosts near-term revenue but increases dependence."],
      ["B", "Diversify Partners", "Build additional partners.", { revenue: -5, brand: 6, future: 8 }, "Business Resilience", { revenue: 3 }, "Diversification hurts short-term momentum but builds resilience."],
      ["C", "Negotiate", "Reach a balanced agreement.", { cash: 2, revenue: 5, brand: 5 }, "Relationship Builder", { brand: 3 }, "Balanced stakeholder management strengthens relationships without surrendering control."]
    ]
  ],
  [
    "Leadership & Emotional Management",
    "Your highest-performing employee resigns unexpectedly.",
    [
      ["A", "Retention Bonus", "Increase compensation for key employees.", { cash: -8, customer: 5, morale: 12 }, "High Fixed Cost", { cash: -5 }, "Retention spending stabilizes the team but increases fixed cost pressure."],
      ["B", "Hire Quickly", "Recruit replacements immediately.", { revenue: 5, future: 5, morale: -3 }, "Talent Pipeline", { revenue: 5 }, "Fast hiring maintains execution velocity but may create morale concerns."],
      ["C", "Leadership Development", "Build leaders and strengthen culture.", { morale: 10, brand: 6, future: 8 }, "High Trust Culture", { morale: 5, brand: 3 }, "Leadership development compounds through trust, ownership and reduced key-person dependency."]
    ]
  ]
];

const risks = [
  [
    "Industry Rumour",
    "A fake message claims your company is shutting down.",
    { revenue: -8, brand: -12, morale: -5 },
    [
      ["Premium Brand", { brand: 7 }, "Premium Brand reduces reputational damage."],
      ["Customer Trust", { revenue: 5 }, "Customer Trust reduces revenue loss because customers are less likely to churn."],
      ["Trusted Leadership", { morale: 5 }, "Trusted Leadership protects morale during ambiguity."]
    ]
  ],
  [
    "AI Disruption",
    "Competitors launch AI-powered services.",
    { future: -12, revenue: -6 },
    [
      ["Digital Advantage", { future: 12, revenue: 11 }, "Digital Advantage neutralizes the penalty and creates revenue upside."],
      ["Learning Culture", { future: 7 }, "Learning Culture reduces readiness loss because people adapt faster."],
      ["Balanced Capability", { future: 6, revenue: 3 }, "Balanced Capability halves disruption."]
    ]
  ],
  [
    "Economic Slowdown",
    "Customer demand drops significantly.",
    { cash: -10, revenue: -10 },
    [
      ["Financial Discipline", { cash: 10, revenue: 5 }, "Financial Discipline protects cash and reduces revenue loss."],
      ["Working Capital Loan", { cash: -5 }, "Working Capital Loan adds repayment stress."]
    ]
  ],
  [
    "Surprise Regulatory Inspection",
    "Authorities conduct an inspection.",
    { compliance: -15, brand: -6 },
    [
      ["Audit Ready", { compliance: 15, brand: 11 }, "Audit Ready neutralizes compliance penalty and strengthens brand."],
      ["Critical Fixes", { compliance: 8 }, "Critical Fixes reduce compliance loss."],
      ["Governance Debt", { compliance: -8, brand: -5 }, "Governance Debt increases penalties."]
    ]
  ],
  [
    "Major Partner Exit",
    "Largest referral partner exits.",
    { revenue: -12, cash: -5 },
    [
      ["Business Resilience", { revenue: 11, cash: 4 }, "Business Resilience makes the exit almost immaterial."],
      ["Relationship Builder", { revenue: 7 }, "Relationship Builder reduces revenue loss."],
      ["Dependency Risk", { revenue: -8 }, "Dependency Risk increases revenue loss."]
    ]
  ]
];

const G = {
  session: null,
  team: null,
  teams: {},
  adminResults: [],
  tab: "play",
  pick: null,
  error: "",
  status: ""
};

TEAM_CODES.forEach(c => {
  G.teams[c] = newTeam(c);
});

function newTeam(c) {
  return {
    id: c,
    name: TEAM_NAMES[c],
    code: c,
    metrics: { ...INIT },
    visible: null,
    show: false,
    phase: 1,
    round: 0,
    risk: 0,
    decisions: [],
    assets: [],
    delays: [],
    hist: [],
    riskHist: [],
    trend: [],
    pending: false,
    phase1: false,
    delayed: false,
    complete: false,
    lastLT: null,
    lastRisk: null,
    lastSavedAt: ""
  };
}

const $ = id => document.getElementById(id);

const cp = o => JSON.parse(JSON.stringify(o));

const score = m => Object.values(m || {}).reduce((a, b) => a + Number(b || 0), 0);

const fmt = o => Object.entries(o || {})
  .map(([k, v]) => `${SRT[k]} ${v > 0 ? "+" : ""}${v}`)
  .join(", ");

function active() {
  return G.session === "admin"
    ? (G.teams[G.team] || G.teams.ALPHA)
    : G.teams[G.team];
}

function apply(m, o) {
  let n = { ...m };
  Object.entries(o || {}).forEach(([k, v]) => {
    n[k] = Math.max(0, Math.min(100, (n[k] || 0) + v));
  });
  return n;
}

function snap(t, label, m) {
  t.visible = { ...m };
  t.show = true;
  t.trend.push({
    label,
    score: score(m),
    ...cp(m)
  });
}

function toast(msg, type = "ok") {
  G.status = { msg, type };
  render();
  setTimeout(() => {
    G.status = "";
    render();
  }, 3000);
}

function configured() {
  return APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes("PASTE_");
}

function jsonp(action, p = {}) {
  return new Promise((res, rej) => {
    if (!configured()) {
      return rej(new Error("Apps Script URL is not configured"));
    }

    let cb = "cb_" + Date.now() + Math.random().toString(16).slice(2);

    window[cb] = d => {
      delete window[cb];
      s.remove();

      if (d && d.ok !== false) {
        res(d);
      } else {
        rej(new Error(d && d.error ? d.error : "Apps Script error"));
      }
    };

    let qs = new URLSearchParams({
      action,
      callback: cb,
      ...p
    });

    let s = document.createElement("script");
    s.src = APPS_SCRIPT_URL + "?" + qs.toString();

    s.onerror = () => {
      delete window[cb];
      s.remove();
      rej(new Error("Could not reach Apps Script"));
    };

    document.body.appendChild(s);
  });
}

async function postSave(t, events = [], decisions = []) {
  if (!configured()) {
    toast("Apps Script URL is not configured", "err");
    return;
  }

  let body = new URLSearchParams({
    action: "save",
    pin: ADMIN_PIN,
    teamCode: t.code,
    state: JSON.stringify(t),
    events: JSON.stringify(events),
    decisions: JSON.stringify(decisions)
  });

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });

    t.lastSavedAt = new Date().toLocaleTimeString();
    toast("Saved to Google Sheet", "ok");
  } catch (e) {
    toast("Could not send data to Apps Script", "err");
  }
}

async function loadTeam(c) {
  try {
    let d = await jsonp("getTeam", {
      teamCode: c,
      pin: ADMIN_PIN
    });

    if (d.state) {
      G.teams[c] = JSON.parse(d.state);
    }
  } catch (e) {
    toast("Could not load saved state: " + e.message, "err");
  }
}

async function refreshAdmin() {
  try {
    let d = await jsonp("results", {
      pin: ADMIN_PIN
    });

    G.adminResults = d.results || [];
    toast("Admin scores refreshed", "ok");
  } catch (e) {
    toast(e.message, "err");
  }

  render();
}

async function loginTeam() {
  let c = $("code").value.trim().toUpperCase();

  if (!TEAM_CODES.includes(c)) {
    G.error = "Invalid team code";
    render();
    return;
  }

  G.session = "team";
  G.team = c;
  G.tab = "play";
  G.error = "";

  await loadTeam(c);
  render();
}

async function loginAdmin() {
  let p = $("pin").value.trim();

  if (p !== ADMIN_PIN) {
    G.error = "Invalid admin PIN";
    render();
    return;
  }

  G.session = "admin";
  G.team = "ALPHA";
  G.tab = "admin";
  G.error = "";

  await refreshAdmin();
}

function logout() {
  G.session = null;
  G.team = null;
  G.tab = "play";
  G.pick = null;
  render();
}

function choose(x) {
  G.pick = x;
  render();
}

async function confirmChoice() {
  let t = active();
  let r = rounds[t.round];
  let o = r[2].find(a => a[0] === G.pick);

  if (!o) return;

  let d = {
    round: t.round + 1,
    roundTitle: r[0],
    option: o[0],
    decisionTitle: o[1],
    decision: o[2],
    immediate: o[3],
    asset: o[4],
    delayed: o[5],
    explain: o[6]
  };

  t.metrics = apply(t.metrics, o[3]);
  t.decisions.push(d);
  t.assets.push(o[4]);
  t.delays.push({
    round: t.round + 1,
    asset: o[4],
    impact: o[5],
    explain: o[6],
    applied: false
  });

  t.hist.push({
    type: "Immediate",
    label: `Round ${t.round + 1}: ${o[1]}`,
    impact: o[3],
    explain: o[2],
    score: score(t.metrics)
  });

  t.pending = true;
  G.pick = null;

  await postSave(t, [], [d]);
  render();
}

async function nextRound() {
  let t = active();

  t.pending = false;

  if (t.round < 6) {
    t.round++;
  } else {
    t.round = 7;
    t.phase1 = true;
    snap(t, "After Phase 1", t.metrics);

    await postSave(t, [
      {
        type: "Phase 1 Complete",
        label: "After Phase 1",
        impact: {},
        scoreAfter: score(t.metrics),
        explanation: "All seven Phase 1 decisions complete."
      }
    ], []);
  }

  render();
}

async function revealLT() {
  let t = active();
  let i = t.delays.findIndex(d => !d.applied);

  if (i < 0) return;

  let d = t.delays[i];

  t.metrics = apply(t.metrics, d.impact);
  d.applied = true;
  t.delayed = t.delays.every(x => x.applied);
  t.lastLT = {
    ...cp(d),
    score: score(t.metrics)
  };

  let ev = {
    type: "Long-Term",
    label: `Round ${d.round}: ${d.asset}`,
    impact: d.impact,
    scoreAfter: score(t.metrics),
    explanation: d.explain
  };

  t.hist.push({
    type: "Long-Term",
    label: ev.label,
    impact: d.impact,
    explain: d.explain,
    score: score(t.metrics)
  });

  snap(t, `LT R${d.round}`, t.metrics);

  await postSave(t, [ev], []);
  render();
}

async function startPhase2() {
  let t = active();

  t.phase = 2;
  t.lastLT = null;

  await postSave(t, [
    {
      type: "Phase 2 Start",
      label: "Start Phase 2",
      impact: {},
      scoreAfter: score(t.metrics),
      explanation: "All long-term impacts revealed."
    }
  ], []);

  render();
}

async function revealRisk() {
  let t = active();
  let r = risks[t.risk];

  let afterDef = apply(t.metrics, r[2]);
  let final = cp(afterDef);
  let tr = [];

  r[3].forEach(p => {
    if (t.assets.includes(p[0])) {
      final = apply(final, p[1]);
      tr.push({
        asset: p[0],
        impact: p[1],
        note: p[2]
      });
    }
  });

  t.metrics = final;

  let rec = {
    title: r[0],
    narrative: r[1],
    def: r[2],
    triggered: tr,
    afterDef,
    finalScore: score(final)
  };

  t.riskHist.push(rec);
  t.lastRisk = {
    ...rec,
    cardId: t.risk + 1
  };

  let ev = {
    type: "Risk Card",
    label: r[0],
    impact: r[2],
    scoreAfter: score(final),
    explanation: tr.length
      ? tr.map(x => `${x.asset}: ${x.note}`).join(" | ")
      : "No protection activated."
  };

  t.hist.push({
    type: "Risk Card",
    label: r[0],
    impact: r[2],
    explain: ev.explanation,
    score: score(final)
  });

  snap(t, `Risk ${t.risk + 1}`, final);

  await postSave(t, [ev], []);
  render();
}

async function nextRisk() {
  let t = active();

  t.lastRisk = null;

  if (t.risk < 4) {
    t.risk++;
  } else {
    t.complete = true;
  }

  await postSave(t, [
    {
      type: t.complete ? "Complete" : "Next Risk",
      label: t.complete ? "Simulation Complete" : `Next Risk ${t.risk + 1}`,
      impact: {},
      scoreAfter: score(t.metrics),
      explanation: ""
    }
  ], []);

  render();
}

function dash(t) {
  let m = t.visible || (G.session === "admin" ? t.metrics : null);
  let show = G.session === "admin" || (t.show && t.visible);

  if (!show) {
    return `
      <div class="card pad">
        <h2>Business Health Hidden</h2>
        <p class="muted">Dashboard unlocks after Phase 1.</p>
      </div>
    `;
  }

  return `
    <div class="card">
      <div class="pad row">
        <div>
          <b>Active Team: ${t.name}</b>
          <h2>Business Health Dashboard</h2>
          <p class="muted small">Updated at reveal points only. Last saved: ${t.lastSavedAt || "not yet"}</p>
        </div>
        <div class="box ${score(m) >= 520 ? "green" : "amber"}">
          <div class="small"><b>OVERALL BUSINESS HEALTH</b></div>
          <div class="score">${score(m)} <span class="small">/ 700</span></div>
        </div>
      </div>
      <div class="pad grid g4">
        ${M.map(k => `
          <div class="metric">
            <div class="row">
              <span class="small muted">${L[k]}</span>
              <b>${m[k]}</b>
            </div>
            <div class="bar">
              <div class="fill" style="width:${m[k]}%"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function play(t) {
  let r = rounds[t.round];

  if (!t.phase1 && r) {
    if (t.pending) {
      let d = t.decisions.at(-1);

      return `
        <div class="card pad">
          <span class="badge blue">Round ${d.round} Decision Locked</span>
          <h2>${d.decisionTitle}</h2>
          <p>${d.decision}</p>
          <div class="box blue">Decision recorded. Impact will be revealed after all Phase 1 rounds.</div>
          <button class="btn bluebtn" onclick="nextRound()">Next Round →</button>
        </div>
      `;
    }

    return `
      <div class="card pad">
        <div class="row">
          <span class="badge blue">Phase 1 · Round ${t.round + 1} of 7</span>
        </div>
        <h2>${r[0]}</h2>
        <div class="box">${r[1]}</div>
        <div class="grid g3">
          ${r[2].map(o => `
            <div class="card pad option ${G.pick === o[0] ? "sel" : ""}" onclick="choose('${o[0]}')">
              <span class="badge">${o[0]}</span>
              <div class="optionTitle">${o[1]}</div>
              <p class="small muted">${o[2]}</p>
            </div>
          `).join("")}
        </div>
        <div class="row" style="margin-top:15px">
          <p class="small muted">Select one strategic choice.</p>
          <button class="btn bluebtn" ${!G.pick ? "disabled" : ""} onclick="confirmChoice()">Confirm Decision</button>
        </div>
      </div>
    `;
  }

  if (t.phase1 && t.phase === 1) {
    let pending = t.delays.find(d => !d.applied);

    return `
      <div class="card pad">
        <span class="badge purple">End of Phase 1</span>
        <h2>Long-Term Impact Reveal</h2>
        <p class="muted">Reveal each delayed consequence. The final impact stays visible before Phase 2 starts.</p>

        ${t.lastLT ? `
          <div class="box green">
            <h3>Revealed: Round ${t.lastLT.round} — ${t.lastLT.asset}</h3>
            <p><b>Impact:</b> ${fmt(t.lastLT.impact) || "No score change"}</p>
            <p>${t.lastLT.explain}</p>
            <p><b>Updated Business Health:</b> ${t.lastLT.score} / 700</p>
          </div>
        ` : ""}

        <div>
          ${t.delays.map(d => `
            <div class="item">
              <div class="row">
                <b>Round ${d.round}: ${d.asset}</b>
                ${d.applied ? '<span class="green badge">Applied</span>' : '<span class="badge">Pending</span>'}
              </div>
              ${d.applied ? `
                <p class="small">${fmt(d.impact) || "No score change"}</p>
                <p class="small muted">${d.explain}</p>
              ` : ""}
            </div>
          `).join("")}
        </div>

        ${pending
          ? '<button class="btn greenbtn" onclick="revealLT()">Reveal Next Long-Term Impact</button>'
          : '<button class="btn bluebtn" onclick="startPhase2()">Next: Start Phase 2 →</button>'
        }
      </div>
    `;
  }

  if (t.phase === 2 && !t.complete) {
    if (t.lastRisk) {
      return `
        <div class="card pad">
          <span class="badge amber">Risk Impact Revealed</span>
          <h2>${t.lastRisk.title}</h2>
          <p>${t.lastRisk.narrative}</p>

          <div class="box amber">
            <b>Default Impact:</b> ${fmt(t.lastRisk.def)}
            <br>
            <b>Score after default:</b> ${score(t.lastRisk.afterDef)} / 700
          </div>

          <div class="box ${t.lastRisk.triggered.length ? "green" : "red"}">
            <h3>Resilience Check</h3>
            ${t.lastRisk.triggered.length
              ? t.lastRisk.triggered.map(p => `
                <p><b>${p.asset}</b>: ${fmt(p.impact)} — ${p.note}</p>
              `).join("")
              : "<p>No protection activated. The team absorbed the full shock.</p>"
            }
            <p><b>Final Business Health:</b> ${t.lastRisk.finalScore} / 700</p>
          </div>

          <button class="btn bluebtn" onclick="nextRisk()">
            ${t.risk < 4 ? "Next Risk Card →" : "Finish Simulation →"}
          </button>
        </div>
      `;
    }

    let risk = risks[t.risk];

    return `
      <div class="card pad">
        <span class="badge amber">Phase 2 · Risk Card ${t.risk + 1} of 5</span>
        <h2>⚠ ${risk[0]}</h2>
        <div class="box amber">${risk[1]}</div>
        <button class="btn amberbtn" onclick="revealRisk()">Reveal Risk Impact</button>
      </div>
    `;
  }

  return `
    <div class="card pad">
      <span class="badge green">Complete</span>
      <h2>Simulation Complete</h2>
      <p>${t.name} finished with <b>${score(t.visible || t.metrics)} / 700</b>.</p>
    </div>
  `;
}

function admin() {
  return `
    <div class="card pad">
      <div class="row">
        <h3>Admin Dashboard</h3>
        <button class="btn light" onclick="refreshAdmin()">Refresh Scores</button>
        ${SHEET_URL.includes("PASTE_") ? "" : `${SHEET_URL}Open Sheet / Download Excel</a>`}
      </div>

      <p class="muted small">
        Team-wise score, decision summary, long-term impacts and risk card impacts.
        Admin cannot play the simulation.
      </p>

      <div class="grid g2">
        ${
          G.adminResults.map(r => {
            let st = null;

            try {
              st = r.state ? JSON.parse(r.state) : null;
            } catch (e) {
              st = null;
            }

            let dec = st && st.decisions ? st.decisions : [];
            let lt = st && st.hist ? st.hist.filter(h => h.type === "Long-Term") : [];
            let rk = st && st.hist ? st.hist.filter(h => h.type === "Risk Card") : [];

            return `
              <div class="item">
                <div class="row">
                  <div>
                    <b>${r.teamName || r.teamCode}</b>
                    <div class="small muted">
                      ${r.phase || ""} · Round ${r.round || ""} · Risk ${r.risk || ""}
                    </div>
                  </div>
                  <div class="score">${r.score || 0}</div>
                </div>

                <h4>Decision Summary</h4>
                ${
                  dec.length
                    ? `
                      <ol class="small">
                        ${
                          dec.map(d => `
                            <li>
                              <b>R${d.round}:</b> ${d.decisionTitle || d.title || ""}
                              ${
                                d.asset
                                  ? `<div class="muted">Asset/Debt: ${d.asset}</div>`
                                  : ""
                              }
                            </li>
                          `).join("")
                        }
                      </ol>
                    `
                    : `<p class="small muted">No decisions recorded yet.</p>`
                }

                <h4>Long-Term Impacts Applied</h4>
                ${
                  lt.length
                    ? `
                      <ol class="small">
                        ${
                          lt.map(h => `
                            <li>
                              <b>${h.label || "Long-Term Impact"}:</b> ${fmt(h.impact) || "No score change"}
                              <div class="muted">${h.explain || h.explanation || ""}</div>
                              <div><b>Score after impact:</b> ${h.score || ""}</div>
                            </li>
                          `).join("")
                        }
                      </ol>
                    `
                    : `<p class="small muted">No long-term impacts applied yet.</p>`
                }

                <h4>Risk Card Impacts</h4>
                ${
                  rk.length
                    ? `
                      <ol class="small">
                        ${
                          rk.map(h => `
                            <li>
                              <b>${h.label || "Risk Card"}:</b> ${fmt(h.impact) || "No score change"}
                              <div class="muted">${h.explain || h.explanation || ""}</div>
                              <div><b>Score after risk:</b> ${h.score || ""}</div>
                            </li>
                          `).join("")
                        }
                      </ol>
                    `
                    : `<p class="small muted">No risk card impacts applied yet.</p>`
                }

                <p class="small muted">Updated ${r.updatedAt || ""}</p>
              </div>
            `;
          }).join("") || '<p class="muted">No results yet. Ask teams to play, then refresh.</p>'
        }
      </div>
    </div>
  `;
}

function history(t) {
  return `
    <div class="grid g2">
      <div class="card pad">
        <h3>Impact History</h3>
        ${
          t.hist
            .filter(h => G.session === "admin" || h.type !== "Immediate")
            .map(h => `
              <div class="item">
                <span class="badge">${h.type}</span>
                <b style="float:right">Score: ${h.score}</b>
                <h4>${h.label}</h4>
                <p>${fmt(h.impact) || "No score change"}</p>
                <p class="muted small">${h.explain}</p>
              </div>
            `).join("") || '<p class="muted">No visible history yet.</p>'
        }
      </div>

      <div class="card pad">
        <h3>Risk History</h3>
        ${
          t.riskHist.map(r => `
            <div class="item">
              <b>${r.title}</b>
              <p>Default: ${fmt(r.def)}</p>
              ${
                r.triggered.length
                  ? r.triggered.map(p => `
                    <div class="box green"><b>${p.asset}</b>: ${p.note}</div>
                  `).join("")
                  : '<div class="box red">No protection activated.</div>'
              }
              <b>Score: ${r.finalScore}</b>
            </div>
          `).join("") || '<p class="muted">Risk cards appear in Phase 2.</p>'
        }
      </div>
    </div>
  `;
}

function analytics(t) {
  let m = t.visible;

  if (!m) {
    return `<div class="card pad">Analytics unlock after Phase 1.</div>`;
  }

  return `
    <div class="card pad">
      <h3>Current Metrics</h3>
      <div class="grid g4">
        ${
          M.map(k => `
            <div class="metric">
              <div class="row">
                <span>${SRT[k]}</span>
                <b>${m[k]}</b>
              </div>
              <div class="bar">
                <div class="fill" style="width:${m[k]}%"></div>
              </div>
            </div>
          `).join("")
        }
      </div>

      <h3>Score Progression</h3>
      ${
        t.trend.map(x => `
          <span class="badge" style="margin:3px">${x.label}: ${x.score}</span>
        `).join("") || '<p class="muted">No revealed score yet.</p>'
      }
    </div>
  `;
}

function report() {
  return `
    <div class="card pad">
      <h3>Report</h3>
      <p class="muted small">Admin results are saved in Google Sheet and can be downloaded as Excel.</p>
    </div>
  `;
}

function side(t) {
  return `
    <div class="card pad">
      <h3>Strategic Assets</h3>
      ${
        (G.session === "admin" || t.phase1) && t.assets.length
          ? t.assets.map(a => `<span class="badge" style="margin:3px">${a}</span>`).join("")
          : '<p class="muted small">Hidden until Phase 1 is complete.</p>'
      }
    </div>

    <div class="card pad dark">
      <h3>Simulation Flow</h3>
      <ol class="small muted">
        <li>Phase 1 - Choose A / B / C for each round.</li>
        <li>Every option is good, but in a different way.</li>
        <li>There is no universally correct answer, which mirrors real business decisions.</li>
      </ol>
    </div>
  `;
}

function loginScreen() {
  document.getElementById("app").innerHTML = `
    <div class="login">
      <div class="wrap">
        <div style="text-align:center;margin-bottom:36px">
          <span class="badge blue">eMSME Offsite - Badlapur July 2026</span>
          <h1 style="font-size:52px">Business Decisioning - Simulation</h1>
          <p>Welcome to your startup journey. Every decision from here shapes your future.</p>
        </div>

        <div class="grid g2">
          <div class="card pad">
            <h2>Team Login</h2>
            <input id="code" class="input" placeholder="Team code">
            <button class="btn bluebtn" style="width:100%;margin-top:12px" onclick="loginTeam()">Enter Team App</button>
          </div>

          <div class="card pad">
            <h2>Admin Login</h2>
            <input id="pin" type="password" class="input" placeholder="Admin PIN">
            <button class="btn greenbtn" style="width:100%;margin-top:12px" onclick="loginAdmin()">Enter Admin App</button>
          </div>
        </div>

        ${
          G.error
            ? `<div class="box red" style="max-width:520px;margin:18px auto;text-align:center">${G.error}</div>`
            : ""
        }
      </div>
    </div>
    ${status()}
  `;
}

function status() {
  return G.status
    ? `<div class="status ${G.status.type === "err" ? "err" : "ok"}">${G.status.msg}</div>`
    : "";
}

function render() {
  if (!G.session) {
    return loginScreen();
  }

  let t = active();
  let tabs = G.session === "admin"
    ? ["admin", "report"]
    : ["play", "analytics", "history", "report"];

  document.getElementById("app").innerHTML = `
    <div class="hero">
      <div class="wrap row">
        <div>
          <span class="badge blue">${G.session === "admin" ? "Admin App" : "Team App"}</span>
          <span class="badge green">${G.session === "admin" ? "Administrator" : t.name}</span>
          <h1>Business Decisioning - Simulation</h1>
          <p>This is a business simulation game for learning purposes. Outcomes and score impacts are simplified and may vary from actual business decisions.</p>
        </div>
        <div>
          <button class="btn light" onclick="logout()">Logout</button>
        </div>
      </div>
    </div>

    <div class="layout wrap">
      <main>
        ${G.session === "admin" ? "" : dash(t)}
        ${G.session === "admin" ? "" : '<div style="height:16px"></div>'}

        <div class="tabs">
          ${
            tabs.map(x => `
              <div class="tab ${G.tab === x ? "on" : ""}" onclick="G.tab='${x}';render()">
                ${x === "admin" ? "Admin" : x[0].toUpperCase() + x.slice(1)}
              </div>
            `).join("")
          }
        </div>

        ${
          G.tab === "play"
            ? play(t)
            : G.tab === "analytics"
            ? analytics(t)
            : G.tab === "history"
            ? history(t)
            : G.tab === "admin"
            ? admin()
            : report(t)
        }
      </main>

      <aside>
        ${side(t)}
      </aside>
    </div>

    ${status()}
  `;
}

render();
