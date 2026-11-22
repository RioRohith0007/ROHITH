import type { WebEngine } from './engine';

/** Draws the current engine state. Colours are RGB triplets so alpha can vary per element. */
const BLUE = '54,139,255';
const CYAN = '86,216,255';

export function drawWeb(ctx: CanvasRenderingContext2D, e: WebEngine) {
  const { width: W, height: H, x, y, depth, glow, edgeA, edgeB, edgeCount, count } = e;
  ctx.clearRect(0, 0, W, H);
  ctx.lineCap = 'round';

  // Resting edges, drawn as two batched paths (far = fainter, near = stronger) for speed.
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    for (let k = 0; k < edgeCount; k++) {
      const a = edgeA[k];
      const b = edgeB[k];
      if ((depth[a] + depth[b]) * 0.5 >= 0.5 !== (pass === 1)) continue;
      ctx.moveTo(x[a], y[a]);
      ctx.lineTo(x[b], y[b]);
    }
    ctx.lineWidth = pass === 1 ? 1 : 0.8;
    ctx.strokeStyle = `rgba(${BLUE},${pass === 1 ? 0.09 : 0.05})`;
    ctx.stroke();
  }

  // Illuminated edges (wave front or cursor proximity), drawn individually.
  for (let k = 0; k < edgeCount; k++) {
    const a = edgeA[k];
    const b = edgeB[k];
    const g = Math.max(glow[a], glow[b]);
    if (g < 0.03) continue;
    ctx.beginPath();
    ctx.moveTo(x[a], y[a]);
    ctx.lineTo(x[b], y[b]);
    ctx.lineWidth = 1 + g * 1.4;
    ctx.strokeStyle = `rgba(${CYAN},${Math.min(0.9, 0.12 + g * 0.85).toFixed(3)})`;
    ctx.stroke();
  }

  // Nodes.
  for (let i = 0; i < count; i++) {
    const g = glow[i];
    const r = 1.1 + depth[i] * 1.5;
    if (g > 0.04) {
      ctx.beginPath();
      ctx.arc(x[i], y[i], r + 5 + g * 8, 0, 6.2832);
      ctx.fillStyle = `rgba(${CYAN},${(g * 0.16).toFixed(3)})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x[i], y[i], r + g * 1.6, 0, 6.2832);
    ctx.fillStyle = g > 0.04 ? `rgba(${CYAN},${Math.min(1, 0.5 + g).toFixed(3)})` : `rgba(${BLUE},${(0.18 + depth[i] * 0.2).toFixed(3)})`;
    ctx.fill();
  }

  // Floating dust.
  const d = e.dust;
  for (let k = 0; k < d.x.length; k++) {
    ctx.beginPath();
    ctx.arc(d.x[k] * W, d.y[k] * H, 0.5 + d.z[k] * 0.9, 0, 6.2832);
    ctx.fillStyle = `rgba(${CYAN},${(0.12 + d.z[k] * 0.28).toFixed(3)})`;
    ctx.fill();
  }
}
