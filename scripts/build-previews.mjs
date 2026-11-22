// Generates the four project preview images as local SVG files.
// These are original, illustrative interface mockups. They are NOT screenshots of deployed apps.
// Run with: npm run previews
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'projects');
mkdirSync(out, { recursive: true });

const C = { bg: '#071426', panel: '#0B1F3A', deep: '#050E1D', line: '#1B3A66', text: '#F5F7FF', mute: '#9BAAC2', dim: '#5E7191', blue: '#1769FF', blue2: '#368BFF', cyan: '#56D8FF', alert: '#FF6B7A' };
const F = 'Inter, "Segoe UI", Helvetica, Arial, sans-serif';

const rect = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${o.fill ?? C.panel}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw ?? 1}"` : ''} ${o.op ? `opacity="${o.op}"` : ''} ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/>`;
const text = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family='${F}' font-size="${o.size ?? 15}" font-weight="${o.w ?? 500}" fill="${o.fill ?? C.text}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} ${o.ls ? `letter-spacing="${o.ls}"` : ''}>${s}</text>`;
const line = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke ?? C.line}" stroke-width="${o.sw ?? 1}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.op ? `opacity="${o.op}"` : ''} stroke-linecap="round"/>`;
const circ = (x, y, r, o = {}) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill ?? 'none'}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw ?? 1}"` : ''} ${o.op ? `opacity="${o.op}"` : ''}/>`;
const chip = (x, y, w, label, color) => rect(x, y, w, 24, { rx: 12, fill: color, op: 0.16 }) + text(x + w / 2, y + 17, label, { size: 12, w: 600, fill: color, anchor: 'middle' });

function frame(title, right, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800" role="img" aria-label="${title}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A1B33"/><stop offset="1" stop-color="#050E1D"/></linearGradient>
  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.blue2}" stop-opacity="0.45"/><stop offset="1" stop-color="${C.blue2}" stop-opacity="0"/></linearGradient>
  <linearGradient id="cam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0C2342"/><stop offset="1" stop-color="#040B16"/></linearGradient>
</defs>
<rect width="1280" height="800" fill="url(#bg)"/>
<rect x="0" y="0" width="1280" height="56" fill="${C.deep}"/>
<line x1="0" y1="56" x2="1280" y2="56" stroke="${C.line}"/>
${circ(28, 28, 6, { fill: '#2B4A7A' })}${circ(48, 28, 6, { fill: '#2B4A7A' })}${circ(68, 28, 6, { fill: '#2B4A7A' })}
${text(96, 34, title, { size: 16, w: 600 })}
${right}
${body}
</svg>`;
}

/* ---------- 1. Construction ERP ---------- */
function erp() {
  let b = '';
  b += rect(1000, 16, 252, 26, { rx: 13, fill: C.cyan, op: 0.14 }) + circ(1020, 29, 5, { fill: C.cyan }) + text(1034, 34, 'OFFLINE · 12 records queued', { size: 12.5, w: 600, fill: C.cyan });
  b += rect(0, 57, 230, 743, { rx: 0, fill: C.deep });
  ['Attendance', 'Wages', 'Advances', 'Settlements', 'Audit reports'].forEach((m, i) => {
    const y = 90 + i * 52;
    if (i === 0) b += rect(14, y - 6, 202, 40, { rx: 9, fill: C.blue, op: 0.28, stroke: C.blue2 });
    b += rect(30, y + 4, 16, 16, { rx: 4, fill: i === 0 ? C.cyan : C.dim, op: 0.9 }) + text(58, y + 18, m, { size: 15, w: i === 0 ? 600 : 500, fill: i === 0 ? C.text : C.mute });
  });
  b += text(30, 770, 'Site: Block A · Shift 1', { size: 12.5, fill: C.dim });
  // KPIs
  [['Present today', '46', C.cyan], ['Absent', '6', C.mute], ['Queued to sync', '12', C.blue2], ['Last synced', '08:42', C.mute]].forEach(([k, v, c], i) => {
    const x = 256 + i * 190;
    b += rect(x, 84, 176, 96, { stroke: C.line }) + text(x + 18, 114, k, { size: 13, fill: C.mute }) + text(x + 18, 160, v, { size: 36, w: 700, fill: c });
  });
  // table
  b += rect(256, 204, 744, 560, { stroke: C.line });
  b += text(278, 240, 'Muster · Today', { size: 17, w: 600 }) + chip(900, 222, 80, 'Offline', C.cyan);
  ['Worker', 'Trade', 'In', 'Out', 'Hours', 'Status'].forEach((h, i) => (b += text([278, 430, 540, 620, 700, 800][i], 276, h.toUpperCase(), { size: 11.5, w: 600, fill: C.dim, ls: 1 })));
  b += line(272, 288, 984, 288);
  const trades = ['Mason', 'Carpenter', 'Helper', 'Electrician', 'Helper', 'Mason', 'Bar bender', 'Helper'];
  trades.forEach((t, i) => {
    const y = 320 + i * 54;
    const absent = i === 3 || i === 6;
    b += text(278, y, `Worker ${String(i + 1).padStart(2, '0')}`, { size: 15, w: 600 }) + text(430, y, t, { size: 14, fill: C.mute });
    b += text(540, y, absent ? '—' : '07:58', { size: 14, fill: C.mute }) + text(620, y, absent ? '—' : '17:02', { size: 14, fill: C.mute }) + text(700, y, absent ? '0.0' : '9.0', { size: 14 });
    b += rect(800, y - 17, 70 + (absent ? 0 : 30), 24, { rx: 12, fill: absent ? C.alert : C.blue2, op: 0.16 }) + text(835 + (absent ? 0 : 15), y, absent ? 'Absent' : 'Present', { size: 12, w: 600, fill: absent ? C.alert : C.blue2, anchor: 'middle' });
    b += line(272, y + 20, 984, y + 20, { op: 0.5 });
  });
  // sync flow
  b += rect(1024, 84, 228, 266, { stroke: C.line }) + text(1044, 116, 'Synchronization', { size: 16, w: 600 });
  const steps = [['Device', 'local storage'], ['Queue', '12 pending'], ['Server', 'Node.js']];
  steps.forEach(([a, s], i) => {
    const y = 150 + i * 62;
    b += rect(1044, y, 188, 46, { rx: 9, fill: C.deep, stroke: i === 1 ? C.cyan : C.line }) + text(1060, y + 21, a, { size: 14, w: 600 }) + text(1060, y + 37, s, { size: 11.5, fill: C.mute });
    if (i < 2) b += line(1138, y + 46, 1138, y + 62, { stroke: C.cyan, dash: '3 4' });
  });
  // chart
  b += rect(1024, 374, 228, 390, { stroke: C.line }) + text(1044, 406, 'Weekly attendance', { size: 16, w: 600 });
  [38, 44, 46, 41, 47, 30, 12].forEach((v, i) => {
    const h = v * 6.2;
    b += rect(1046 + i * 28, 740 - h, 18, h, { rx: 4, fill: i === 2 ? C.cyan : C.blue2, op: i === 2 ? 0.95 : 0.55 });
    b += text(1055 + i * 28, 758, 'MTWTFSS'[i], { size: 11, fill: C.dim, anchor: 'middle' });
  });
  b += text(1044, 436, 'Records captured on device', { size: 12, fill: C.mute });
  return frame('Workforce ERP — Site Attendance', b.split('\n')[0] ? '' : '', b);
}

/* ---------- 2. Safety monitoring ---------- */
function skeleton(cx, top, s, color) {
  const P = {
    head: [cx, top], neck: [cx, top + 34 * s], ls: [cx - 28 * s, top + 44 * s], rs: [cx + 28 * s, top + 44 * s],
    le: [cx - 38 * s, top + 100 * s], re: [cx + 38 * s, top + 100 * s], lw: [cx - 34 * s, top + 150 * s], rw: [cx + 34 * s, top + 150 * s],
    lh: [cx - 18 * s, top + 126 * s], rh: [cx + 18 * s, top + 126 * s], lk: [cx - 20 * s, top + 190 * s], rk: [cx + 20 * s, top + 190 * s],
    la: [cx - 22 * s, top + 250 * s], ra: [cx + 22 * s, top + 250 * s],
  };
  const bones = [['neck', 'ls'], ['neck', 'rs'], ['ls', 'le'], ['le', 'lw'], ['rs', 're'], ['re', 'rw'], ['neck', 'lh'], ['neck', 'rh'], ['lh', 'rh'], ['lh', 'lk'], ['lk', 'la'], ['rh', 'rk'], ['rk', 'ra']];
  let g = bones.map(([a, b]) => line(...P[a], ...P[b], { stroke: color, sw: 3 })).join('');
  g += circ(P.head[0], P.head[1] + 6, 17 * s, { stroke: color, sw: 3 });
  g += Object.values(P).map(([x, y]) => circ(x, y, 4.5, { fill: color })).join('');
  return g;
}
function safety() {
  let b = '';
  b += rect(1010, 16, 242, 26, { rx: 13, fill: C.cyan, op: 0.14 }) + circ(1030, 29, 5, { fill: C.cyan }) + text(1044, 34, 'Live · 3 detection layers', { size: 12.5, w: 600, fill: C.cyan });
  // camera
  b += rect(24, 76, 836, 650, { rx: 12, fill: 'url(#cam)', stroke: C.line });
  for (let i = 0; i <= 9; i++) b += line(24 + i * 93, 726, 442, 330, { stroke: C.blue2, op: 0.14 });
  for (let i = 0; i < 7; i++) b += line(24, 330 + i * i * 9 + i * 20, 860, 330 + i * i * 9 + i * 20, { stroke: C.blue2, op: 0.12 });
  b += `<polygon points="470,430 780,430 840,690 410,690" fill="${C.alert}" fill-opacity="0.07" stroke="${C.alert}" stroke-width="2" stroke-dasharray="10 8"/>` + text(700, 458, 'RESTRICTED ZONE', { size: 11, w: 700, fill: C.alert, ls: 1.5 });
  // person A (safe)
  b += skeleton(220, 330, 1.25, C.cyan) + rect(160, 316, 120, 380, { rx: 6, fill: 'none', stroke: C.cyan, sw: 2 }) + rect(160, 290, 166, 24, { rx: 4, fill: C.cyan }) + text(170, 307, 'person · pose ok', { size: 13, w: 700, fill: '#04101F' });
  // person B (in zone)
  b += skeleton(620, 340, 1.3, C.alert) + rect(552, 322, 136, 390, { rx: 6, fill: 'none', stroke: C.alert, sw: 2 }) + rect(552, 296, 196, 24, { rx: 4, fill: C.alert }) + text(562, 313, 'person · in boundary', { size: 13, w: 700, fill: '#2A0610' });
  b += rect(40, 92, 150, 28, { rx: 8, fill: '#000', op: 0.45 }) + circ(56, 106, 5, { fill: C.alert }) + text(70, 111, 'CAM 01 · LIVE', { size: 12.5, w: 700 });
  // timeline
  b += rect(24, 740, 836, 40, { stroke: C.line });
  for (let i = 0; i < 40; i++) b += rect(40 + i * 20, 756 - ((i * 7) % 11), 10, 8 + ((i * 7) % 11) * 1.2, { rx: 2, fill: i > 28 && i < 33 ? C.alert : C.blue2, op: 0.6 });
  // side panel
  b += rect(884, 76, 368, 704, { stroke: C.line }) + text(906, 112, 'Safety analysis', { size: 18, w: 600 });
  [['Pose estimation', 'YOLOv8 keypoints', true], ['Idle-state analysis', 'worker activity', true], ['Virtual boundary', 'restricted zones', true]].forEach(([a, s, on], i) => {
    const y = 134 + i * 70;
    b += rect(906, y, 324, 58, { rx: 10, fill: C.deep, stroke: C.line }) + text(924, y + 25, a, { size: 15, w: 600 }) + text(924, y + 44, s, { size: 12.5, fill: C.mute });
    b += rect(1176, y + 19, 38, 20, { rx: 10, fill: on ? C.cyan : C.dim, op: on ? 0.9 : 0.4 }) + circ(1204, y + 29, 7, { fill: '#04101F' });
  });
  b += text(906, 376, 'EVENTS', { size: 11.5, w: 700, fill: C.dim, ls: 2 });
  [['Boundary violation', 'person entered restricted zone', C.alert], ['Idle detected', 'no movement from worker', C.blue2], ['Pose normal', 'posture within limits', C.cyan]].forEach(([a, s, c], i) => {
    const y = 392 + i * 78;
    b += rect(906, y, 324, 66, { rx: 10, fill: C.deep, stroke: c, op: 1 }) + rect(906, y, 5, 66, { rx: 2, fill: c }) + text(926, y + 28, a, { size: 15, w: 600 }) + text(926, y + 49, s, { size: 12.5, fill: C.mute });
  });
  b += text(906, 650, 'DETECTION CONFIDENCE', { size: 11.5, w: 700, fill: C.dim, ls: 2 });
  [0.9, 0.82, 0.7].forEach((v, i) => (b += rect(906, 668 + i * 30, 324, 12, { rx: 6, fill: C.deep }) + rect(906, 668 + i * 30, 324 * v, 12, { rx: 6, fill: i === 0 ? C.cyan : C.blue2 })));
  return frame('Safety Monitoring — Camera 01', '', b);
}

/* ---------- 3. Emotion recognition ---------- */
function emotion() {
  let b = '';
  b += rect(1010, 16, 242, 26, { rx: 13, fill: C.cyan, op: 0.14 }) + circ(1030, 29, 5, { fill: C.cyan }) + text(1044, 34, 'Audio + Video · fused', { size: 12.5, w: 600, fill: C.cyan });
  // video
  b += rect(24, 76, 560, 400, { rx: 12, fill: 'url(#cam)', stroke: C.line }) + text(44, 106, 'VIDEO STREAM', { size: 11.5, w: 700, fill: C.dim, ls: 2 });
  b += `<clipPath id="vclip"><rect x="24" y="76" width="560" height="400" rx="12"/></clipPath><g clip-path="url(#vclip)"><ellipse cx="304" cy="290" rx="86" ry="108" fill="#16335C" stroke="${C.blue2}" stroke-opacity="0.5"/><ellipse cx="304" cy="440" rx="150" ry="80" fill="#10284A"/></g>`;
  b += rect(206, 170, 196, 240, { rx: 6, fill: 'none', stroke: C.cyan, sw: 2.5 }) + rect(206, 144, 130, 24, { rx: 4, fill: C.cyan }) + text(216, 161, 'MTCNN · face', { size: 13, w: 700, fill: '#04101F' });
  [[270, 262], [338, 262], [304, 304], [276, 350], [332, 350]].forEach(([x, y]) => (b += circ(x, y, 5, { fill: C.cyan }) + circ(x, y, 10, { stroke: C.cyan, op: 0.4 })));
  b += line(276, 350, 332, 350, { stroke: C.cyan, sw: 2 });
  // audio
  b += rect(24, 496, 560, 130, { stroke: C.line }) + text(44, 524, 'AUDIO WAVEFORM', { size: 11.5, w: 700, fill: C.dim, ls: 2 });
  for (let i = 0; i < 64; i++) { const h = 8 + Math.abs(Math.sin(i * 0.5) * Math.cos(i * 0.13)) * 62; b += rect(44 + i * 8.4, 575 - h / 2, 5, h, { rx: 2.5, fill: i < 44 ? C.blue2 : C.dim, op: i < 44 ? 0.9 : 0.4 }); }
  b += rect(24, 640, 560, 140, { stroke: C.line }) + text(44, 668, 'MEL FEATURES', { size: 11.5, w: 700, fill: C.dim, ls: 2 });
  for (let r = 0; r < 6; r++) for (let c = 0; c < 44; c++) { const v = (Math.sin(c * 0.4 + r) + Math.cos(c * 0.17 * (r + 1))) / 2 + 0.5; b += rect(44 + c * 12.2, 682 + r * 15, 10, 12, { rx: 2, fill: C.cyan, op: (0.08 + v * 0.7).toFixed(2) }); }
  // pipeline
  b += rect(608, 76, 644, 704, { stroke: C.line }) + text(632, 112, 'Multimodal pipeline', { size: 18, w: 600 });
  const box = (x, y, w, t, s, hi) => rect(x, y, w, 62, { rx: 10, fill: C.deep, stroke: hi ? C.cyan : C.line }) + text(x + 16, y + 28, t, { size: 14.5, w: 600 }) + text(x + 16, y + 48, s, { size: 12, fill: C.mute });
  b += box(632, 140, 190, 'Video frames', 'MTCNN + CNN') + box(632, 240, 190, 'Facial features', 'CNN embeddings');
  b += box(632, 400, 190, 'Audio signal', 'speech input') + box(632, 500, 190, 'Audio features', 'sentiment cues');
  b += line(727, 202, 727, 240, { stroke: C.cyan, dash: '3 4' }) + line(727, 462, 727, 500, { stroke: C.cyan, dash: '3 4' });
  b += `<path d="M822 271 C 900 271 900 400 960 400" fill="none" stroke="${C.cyan}" stroke-width="2" stroke-dasharray="5 6"/><path d="M822 531 C 900 531 900 400 960 400" fill="none" stroke="${C.cyan}" stroke-width="2" stroke-dasharray="5 6"/>`;
  b += rect(960, 358, 260, 84, { rx: 12, fill: C.blue, op: 0.3, stroke: C.blue2 }) + text(1090, 394, 'Multimodal fusion', { size: 17, w: 700, anchor: 'middle' }) + text(1090, 418, 'feature-level combination', { size: 12.5, fill: C.mute, anchor: 'middle' });
  b += line(1090, 442, 1090, 486, { stroke: C.cyan, sw: 2 });
  // prediction bars
  b += rect(944, 486, 292, 270, { rx: 12, fill: C.deep, stroke: C.line }) + text(964, 516, 'PREDICTION', { size: 11.5, w: 700, fill: C.dim, ls: 2 });
  [['Happy', 0.72], ['Neutral', 0.14], ['Surprise', 0.07], ['Sad', 0.04], ['Angry', 0.03]].forEach(([n, v], i) => {
    const y = 540 + i * 41;
    b += text(964, y + 14, n, { size: 13.5, w: i === 0 ? 700 : 500, fill: i === 0 ? C.text : C.mute }) + rect(1040, y, 180, 16, { rx: 8, fill: '#0A1830' }) + rect(1040, y, 180 * v, 16, { rx: 8, fill: i === 0 ? C.cyan : C.blue2, op: i === 0 ? 1 : 0.6 });
  });
  return frame('Multimodal Emotion Recognition', '', b);
}

/* ---------- 4. Sales dashboard ---------- */
function sales() {
  let b = '';
  b += rect(1000, 16, 252, 26, { rx: 13, fill: C.blue2, op: 0.16 }) + text(1126, 34, 'FY view · All regions', { size: 12.5, w: 600, fill: C.blue2, anchor: 'middle' });
  [['Revenue', '₹ 4.82 Cr', '+12.4%', C.cyan], ['Orders', '18,240', '+6.1%', C.blue2], ['Avg. order value', '₹ 2,640', '+2.8%', C.blue2], ['Forecast (next Q)', '₹ 1.46 Cr', 'SQL + DAX', C.cyan]].forEach(([k, v, d, c], i) => {
    const x = 24 + i * 308;
    b += rect(x, 76, 292, 108, { stroke: C.line }) + text(x + 20, 106, k, { size: 13.5, fill: C.mute }) + text(x + 20, 150, v, { size: 32, w: 700 }) + text(x + 20, 172, d, { size: 13, w: 600, fill: c });
    const pts = Array.from({ length: 8 }, (_, j) => `${x + 200 + j * 11},${150 - Math.sin(j * 0.9 + i) * 10 - j * 1.4}`).join(' ');
    b += `<polyline points="${pts}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
  });
  // revenue chart
  b += rect(24, 204, 800, 380, { stroke: C.line }) + text(46, 238, 'Revenue trend and forecast', { size: 17, w: 600 }) + chip(640, 220, 80, 'Actual', C.blue2) + chip(730, 220, 82, 'Forecast', C.cyan);
  for (let i = 0; i < 5; i++) b += line(46, 280 + i * 62, 804, 280 + i * 62, { op: 0.6 });
  const act = [190, 176, 182, 160, 150, 158, 132, 124, 130, 108, 100, 92];
  const px = (i) => 56 + i * 43.5;
  const ap = act.map((v, i) => `${px(i)},${v + 200}`);
  b += `<polygon points="${ap.join(' ')} ${px(11)},530 ${px(0)},530" fill="url(#area)"/>` + `<polyline points="${ap.join(' ')}" fill="none" stroke="${C.blue2}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const fc = [92, 84, 78, 70, 62, 54];
  const fp = fc.map((v, i) => `${px(11 + i)},${v + 200}`);
  const upper = fc.map((v, i) => `${px(11 + i)},${v + 200 - 10 - i * 6}`);
  const lower = fc.map((v, i) => `${px(11 + i)},${v + 200 + 10 + i * 6}`).reverse();
  b += `<polygon points="${upper.join(' ')} ${lower.join(' ')}" fill="${C.cyan}" fill-opacity="0.12"/>` + `<polyline points="${fp.join(' ')}" fill="none" stroke="${C.cyan}" stroke-width="3.5" stroke-dasharray="9 7" stroke-linecap="round"/>`;
  b += line(px(11), 262, px(11), 530, { stroke: C.cyan, dash: '3 5', op: 0.5 });
  ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May'].forEach((m, i) => (b += text(px(i * 2), 562, m, { size: 11.5, fill: C.dim, anchor: 'middle' })));
  // regions
  b += rect(848, 204, 408, 380, { stroke: C.line }) + text(870, 238, 'Sales by region', { size: 17, w: 600 });
  [['South', 0.92], ['West', 0.74], ['North', 0.61], ['East', 0.43], ['Central', 0.3]].forEach(([n, v], i) => {
    const y = 272 + i * 58;
    b += text(870, y + 17, n, { size: 14, fill: C.mute }) + rect(950, y, 280, 22, { rx: 6, fill: '#0A1830' }) + rect(950, y, 280 * v, 22, { rx: 6, fill: i === 0 ? C.cyan : C.blue2, op: i === 0 ? 1 : 0.65 });
  });
  // customers + table
  b += rect(24, 604, 400, 176, { stroke: C.line }) + text(46, 636, 'Customer segments', { size: 16, w: 600 });
  const arcs = [[0.5, C.cyan], [0.3, C.blue2], [0.2, C.blue]];
  let a0 = -Math.PI / 2;
  arcs.forEach(([f, c]) => { const a1 = a0 + f * Math.PI * 2; const r = 50, cx = 120, cy = 710; const L = f > 0.5 ? 1 : 0; b += `<path d="M${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${L} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}" fill="none" stroke="${c}" stroke-width="18"/>`; a0 = a1; });
  [['Repeat', C.cyan], ['New', C.blue2], ['Lapsed', C.blue]].forEach(([n, c], i) => (b += circ(220, 676 + i * 30, 6, { fill: c }) + text(236, 681 + i * 30, n, { size: 14, fill: C.mute })));
  b += rect(448, 604, 808, 176, { stroke: C.line }) + text(470, 636, 'Top products', { size: 16, w: 600 });
  ['PRODUCT', 'UNITS', 'REVENUE', 'TREND'].forEach((h, i) => (b += text([470, 790, 920, 1090][i], 666, h, { size: 11, w: 700, fill: C.dim, ls: 1 })));
  ['Product A', 'Product B', 'Product C'].forEach((p, i) => {
    const y = 698 + i * 28;
    b += text(470, y, p, { size: 14, w: 600 }) + text(790, y, ['5,420', '4,180', '3,260'][i], { size: 14, fill: C.mute }) + text(920, y, ['₹ 1.2 Cr', '₹ 0.9 Cr', '₹ 0.7 Cr'][i], { size: 14 });
    b += `<polyline points="${Array.from({ length: 8 }, (_, j) => `${1090 + j * 14},${y - 4 - Math.sin(j + i) * 4 - j * (1.2 - i * 0.4)}`).join(' ')}" fill="none" stroke="${C.cyan}" stroke-width="2"/>`;
  });
  return frame('Sales and Forecasting Dashboard', '', b);
}

const files = { 'construction-erp': erp(), 'safety-monitoring': safety(), 'emotion-recognition': emotion(), 'sales-dashboard': sales() };
for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(out, `${name}.svg`), svg);
  console.log('wrote', `public/assets/projects/${name}.svg`, `${(svg.length / 1024).toFixed(1)} KB`);
}
