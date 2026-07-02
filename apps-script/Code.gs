/** Startup Strategy Simulation - Apps Script storage v2
 * Fixes: POST writes for large payloads; Summary always upserted; Admin reads all teams.
 * Deploy: Web app -> Execute as Me -> Anyone.
 */
const ADMIN_PIN = 'ADMIN2026';
const TEAM_CODES = ['ALPHA','BETA','GAMMA','DELTA','OMEGA','SIGMA'];
const TEAM_NAMES = {ALPHA:'Team Alpha',BETA:'Team Beta',GAMMA:'Team Gamma',DELTA:'Team Delta',OMEGA:'Team Omega',SIGMA:'Team Sigma'};
const METRIC_KEYS = ['cash','revenue','customer','morale','brand','compliance','future'];
const METRIC_LABELS = {cash:'Cash Position',revenue:'Revenue Growth',customer:'Customer Satisfaction',morale:'Team Morale',brand:'Brand Reputation',compliance:'Compliance & Governance',future:'Future Readiness'};

function doGet(e){
  const p=e.parameter||{};
  try{
    if(p.action==='results') return jsonp_(p.callback, results_(p));
    if(p.action==='getTeam') return jsonp_(p.callback, getTeam_(p));
    return jsonp_(p.callback,{ok:false,error:'Unknown GET action'});
  }catch(err){return jsonp_(p.callback,{ok:false,error:String(err)})}
}

function doPost(e){
  try{
    const p=(e&&e.parameter)||{};
    if(p.action==='save') return json_({ok:true,...save_(p)});
    return json_({ok:false,error:'Unknown POST action'});
  }catch(err){return json_({ok:false,error:String(err)})}
}

function jsonp_(callback,obj){
  const cb=String(callback||'callback').replace(/[^a-zA-Z0-9_.$]/g,'');
  return ContentService.createTextOutput(`${cb}(${JSON.stringify(obj)});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}
function checkPin_(pin){if(String(pin||'')!==ADMIN_PIN) throw new Error('Invalid admin PIN')}
function ss_(){const ss=SpreadsheetApp.getActiveSpreadsheet(); ensure_(ss); return ss}
function ensure_(ss){
  const summary=ss.getSheetByName('Summary')||ss.insertSheet('Summary');
  const events=ss.getSheetByName('Events')||ss.insertSheet('Events');
  const decisions=ss.getSheetByName('Decisions')||ss.insertSheet('Decisions');
  if(summary.getLastRow()===0) summary.appendRow(['Team Code','Team Name','Phase','Round','Risk Card','Business Health Score','Cash Position','Revenue Growth','Customer Satisfaction','Team Morale','Brand Reputation','Compliance & Governance','Future Readiness','Full State JSON','Updated At']);
  if(events.getLastRow()===0) events.appendRow(['Timestamp','Team Code','Event Type','Label','Impact','Score After','Explanation']);
  if(decisions.getLastRow()===0) decisions.appendRow(['Timestamp','Team Code','Round','Round Title','Option','Decision Title','Decision','Strategic Asset/Debt','Immediate Impact','Delayed Impact']);
  [summary,events,decisions].forEach(sh=>sh.getRange(1,1,1,sh.getLastColumn()).setFontWeight('bold'));
}
function total_(m){m=m||{};return METRIC_KEYS.reduce((s,k)=>s+Number(m[k]||0),0)}
function impactText_(o){o=o||{};return Object.keys(o).map(k=>`${METRIC_LABELS[k]||k} ${o[k]>0?'+':''}${o[k]}`).join(', ')}
function findRow_(sheet,code){const last=sheet.getLastRow(); if(last<2)return null; const vals=sheet.getRange(2,1,last-1,1).getValues(); for(let i=0;i<vals.length;i++){if(String(vals[i][0]).toUpperCase()===code)return i+2} return null}
function save_(p){
  checkPin_(p.pin); const code=String(p.teamCode||'').toUpperCase(); if(!TEAM_CODES.includes(code)) throw new Error('Invalid team code');
  const state=JSON.parse(p.state||'{}'); const metrics=state.metrics||{}; const ss=ss_(); const summary=ss.getSheetByName('Summary');
  const row=[code,TEAM_NAMES[code]||code,state.phase===2?'Phase 2':'Phase 1',Number(state.round||0)+1,Number(state.risk||0)+1,total_(metrics),...METRIC_KEYS.map(k=>Number(metrics[k]||0)),JSON.stringify(state),new Date()];
  const existing=findRow_(summary,code); if(existing) summary.getRange(existing,1,1,row.length).setValues([row]); else summary.appendRow(row);
  const events=JSON.parse(p.events||'[]'); if(events.length){const sh=ss.getSheetByName('Events'); events.forEach(ev=>sh.appendRow([new Date(),code,ev.type||'',ev.label||'',impactText_(ev.impact),ev.scoreAfter||total_(metrics),ev.explanation||'']))}
  const decisions=JSON.parse(p.decisions||'[]'); if(decisions.length){const sh=ss.getSheetByName('Decisions'); decisions.forEach(d=>sh.appendRow([new Date(),code,d.round||'',d.roundTitle||'',d.option||'',d.decisionTitle||'',d.decision||'',d.asset||'',impactText_(d.immediate),impactText_(d.delayed)]))}
  SpreadsheetApp.flush(); return {score:total_(metrics),updatedAt:new Date().toISOString()};
}
function results_(p){
  checkPin_(p.pin); const sh=ss_().getSheetByName('Summary'); const last=sh.getLastRow(); if(last<2)return {ok:true,results:[]};
  const rows=sh.getRange(2,1,last-1,15).getValues();
  const results=rows.filter(r=>r[0]).map(r=>({teamCode:r[0],teamName:r[1],phase:r[2],round:r[3],risk:r[4],score:r[5],metrics:{cash:r[6],revenue:r[7],customer:r[8],morale:r[9],brand:r[10],compliance:r[11],future:r[12]},updatedAt:r[14]?new Date(r[14]).toISOString():''})).sort((a,b)=>Number(b.score||0)-Number(a.score||0));
  return {ok:true,results};
}
function getTeam_(p){
  checkPin_(p.pin); const code=String(p.teamCode||'').toUpperCase(); if(!TEAM_CODES.includes(code)) throw new Error('Invalid team code');
  const sh=ss_().getSheetByName('Summary'); const row=findRow_(sh,code); if(!row)return {ok:true,state:null}; return {ok:true,state:sh.getRange(row,14).getValue()};
}
