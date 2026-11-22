/**
 * Spider-web network simulation. Pure TypeScript with no DOM access, so it can be unit-tested.
 *
 * Model
 *  - Nodes sit on a jittered grid (even coverage) and each has a depth (0 = far, 1 = near).
 *  - Edges connect each node to its nearest neighbours.
 *  - Final position = home + ambient drift + pointer offset (spring) + wave offset (analytic).
 *  - Pointer offset springs back to zero when the pointer leaves, and wave offsets are a function of
 *    time since the click, so once every wave has expired the network is exactly back at rest.
 */

export interface WebConfig {
  /** Approximate pixels of screen area per node. */
  areaPerNode: number;
  maxNodes: number;
  /** Radius of pointer influence in px. */
  pointerRadius: number;
  /** Ripple front speed in px/s. */
  waveSpeed: number;
  /** Thickness of the ripple front in px. */
  waveWidth: number;
  /** Lifetime of a ripple in ms. */
  waveLife: number;
  /** Max displacement (px) a ripple adds to a node. */
  waveDisplace: number;
  ambient: boolean;
}

export const DEFAULT_CONFIG: WebConfig = {
  areaPerNode: 15000,
  maxNodes: 150,
  pointerRadius: 170,
  waveSpeed: 560,
  waveWidth: 110,
  waveLife: 2600,
  waveDisplace: 12,
  ambient: true,
};

export interface Pointer {
  id: number;
  x: number;
  y: number;
  pressed: boolean;
}

export interface Wave {
  x: number;
  y: number;
  t0: number;
  strength: number;
}

/** Small deterministic PRNG so the layout is stable between renders and tests. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class WebEngine {
  cfg: WebConfig;
  width = 0;
  height = 0;
  count = 0;
  /** Resting positions. */
  hx = new Float32Array(0);
  hy = new Float32Array(0);
  /** Current rendered positions (after all offsets). */
  x = new Float32Array(0);
  y = new Float32Array(0);
  /** Pointer spring state. */
  px = new Float32Array(0);
  py = new Float32Array(0);
  vx = new Float32Array(0);
  vy = new Float32Array(0);
  depth = new Float32Array(0);
  phase = new Float32Array(0);
  /** 0..1 illumination: wave + pointer proximity. */
  glow = new Float32Array(0);
  edgeA = new Uint16Array(0);
  edgeB = new Uint16Array(0);
  edgeCount = 0;
  /** Parallax offset that makes the whole web gently follow the cursor. */
  parX = 0;
  parY = 0;
  waves: Wave[] = [];
  pointers = new Map<number, Pointer>();
  private targetParX = 0;
  private targetParY = 0;
  /** Floating dust particles, normalised 0..1 positions. */
  dust = { x: new Float32Array(0), y: new Float32Array(0), vx: new Float32Array(0), vy: new Float32Array(0), z: new Float32Array(0) };

  constructor(cfg: Partial<WebConfig> = {}) {
    this.cfg = { ...DEFAULT_CONFIG, ...cfg };
  }

  /** (Re)build the node and edge layout for a viewport. */
  resize(width: number, height: number, seed = 7) {
    this.width = width;
    this.height = height;
    const rand = mulberry32(seed);
    const target = Math.min(this.cfg.maxNodes, Math.max(18, Math.round((width * height) / this.cfg.areaPerNode)));
    const aspect = width / Math.max(1, height);
    const rows = Math.max(3, Math.round(Math.sqrt(target / aspect)));
    const cols = Math.max(3, Math.round(target / rows));
    const cw = width / cols;
    const ch = height / rows;
    const n = rows * cols;
    this.count = n;
    this.hx = new Float32Array(n);
    this.hy = new Float32Array(n);
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.px = new Float32Array(n);
    this.py = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.depth = new Float32Array(n);
    this.phase = new Float32Array(n);
    this.glow = new Float32Array(n);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Jitter up to 38% of a cell in each direction, which breaks the grid look but keeps coverage.
        this.hx[i] = (c + 0.5 + (rand() - 0.5) * 0.76) * cw;
        this.hy[i] = (r + 0.5 + (rand() - 0.5) * 0.76) * ch;
        this.depth[i] = rand();
        this.phase[i] = rand() * Math.PI * 2;
        this.x[i] = this.hx[i];
        this.y[i] = this.hy[i];
        i++;
      }
    }
    this.buildEdges(Math.hypot(cw, ch) * 1.35);

    const m = Math.round(Math.min(60, n * 0.4));
    this.dust = { x: new Float32Array(m), y: new Float32Array(m), vx: new Float32Array(m), vy: new Float32Array(m), z: new Float32Array(m) };
    for (let k = 0; k < m; k++) {
      this.dust.x[k] = rand();
      this.dust.y[k] = rand();
      this.dust.vx[k] = (rand() - 0.5) * 0.00002;
      this.dust.vy[k] = -(0.00001 + rand() * 0.00003);
      this.dust.z[k] = rand();
    }
  }

  /** Connect each node to its nearest neighbours within maxDist, using a spatial hash. */
  private buildEdges(maxDist: number) {
    const cell = maxDist;
    const gw = Math.ceil(this.width / cell) + 1;
    const grid = new Map<number, number[]>();
    for (let i = 0; i < this.count; i++) {
      const key = Math.floor(this.hy[i] / cell) * gw + Math.floor(this.hx[i] / cell);
      const list = grid.get(key);
      if (list) list.push(i);
      else grid.set(key, [i]);
    }
    const seen = new Set<number>();
    const a: number[] = [];
    const b: number[] = [];
    const K = 3;
    for (let i = 0; i < this.count; i++) {
      const cx = Math.floor(this.hx[i] / cell);
      const cy = Math.floor(this.hy[i] / cell);
      const near: { j: number; d: number }[] = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const list = grid.get((cy + dy) * gw + (cx + dx));
          if (!list) continue;
          for (const j of list) {
            if (j === i) continue;
            const d = Math.hypot(this.hx[i] - this.hx[j], this.hy[i] - this.hy[j]);
            if (d <= maxDist) near.push({ j, d });
          }
        }
      }
      near.sort((p, q) => p.d - q.d);
      for (let k = 0; k < Math.min(K, near.length); k++) {
        const j = near[k].j;
        const lo = Math.min(i, j);
        const hi = Math.max(i, j);
        const key = lo * 65536 + hi;
        if (seen.has(key)) continue;
        seen.add(key);
        a.push(lo);
        b.push(hi);
      }
    }
    this.edgeA = Uint16Array.from(a);
    this.edgeB = Uint16Array.from(b);
    this.edgeCount = a.length;
  }

  setPointer(id: number, x: number, y: number, pressed: boolean) {
    this.pointers.set(id, { id, x, y, pressed });
  }

  removePointer(id: number) {
    this.pointers.delete(id);
  }

  /** Start a disturbance at (x, y). `now` is a timestamp in ms. */
  ripple(x: number, y: number, now: number, strength = 1) {
    this.waves.push({ x, y, t0: now, strength });
    if (this.waves.length > 8) this.waves.shift();
  }

  /** True while anything is still moving because of user input. */
  get active() {
    if (this.waves.length > 0 || this.pointers.size > 0) return true;
    if (Math.abs(this.parX) + Math.abs(this.parY) > 0.05) return true;
    for (let i = 0; i < this.count; i++) {
      if (Math.abs(this.px[i]) + Math.abs(this.py[i]) > 0.02 || this.glow[i] > 0.01) return true;
    }
    return false;
  }

  /** Advance the simulation. dt in ms (clamped), now in ms. */
  step(dt: number, now: number) {
    dt = Math.min(Math.max(dt, 0), 50);
    const s = dt / 16.667; // frame-rate independent scale where 1 = one 60 Hz frame
    const { pointerRadius: R, waveSpeed, waveWidth, waveLife, waveDisplace, ambient } = this.cfg;

    // Drop expired waves.
    this.waves = this.waves.filter((w) => now - w.t0 < waveLife);

    // Whole-web parallax towards the primary pointer.
    let leadX = 0;
    let leadY = 0;
    let hasLead = false;
    for (const p of this.pointers.values()) {
      leadX = (p.x / Math.max(1, this.width) - 0.5) * 2;
      leadY = (p.y / Math.max(1, this.height) - 0.5) * 2;
      hasLead = true;
      break;
    }
    this.targetParX = hasLead ? -leadX * 14 : 0;
    this.targetParY = hasLead ? -leadY * 14 : 0;
    const pk = 1 - Math.pow(1 - 0.05, s);
    this.parX += (this.targetParX - this.parX) * pk;
    this.parY += (this.targetParY - this.parY) * pk;
    if (!hasLead && Math.abs(this.parX) + Math.abs(this.parY) < 0.02) {
      this.parX = 0;
      this.parY = 0;
    }

    const spring = 0.06 * s;
    const damp = Math.pow(0.86, s);

    for (let i = 0; i < this.count; i++) {
      // ---- pointer force: nodes lean toward nearby pointers, more when pressed (drag)
      let fx = 0;
      let fy = 0;
      let near = 0;
      const nx = this.hx[i] + this.px[i];
      const ny = this.hy[i] + this.py[i];
      for (const p of this.pointers.values()) {
        const dx = p.x - nx;
        const dy = p.y - ny;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.001) {
          const f = 1 - d / R;
          const k = f * f * (p.pressed ? 0.05 : 0.016) * (0.55 + 0.9 * this.depth[i]);
          fx += dx * k * s;
          fy += dy * k * s;
          if (f > near) near = f;
        }
      }
      this.vx[i] = (this.vx[i] + fx - this.px[i] * spring) * damp;
      this.vy[i] = (this.vy[i] + fy - this.py[i] * spring) * damp;
      this.px[i] += this.vx[i] * s;
      this.py[i] += this.vy[i] * s;
      if (this.pointers.size === 0 && Math.abs(this.px[i]) + Math.abs(this.py[i]) + Math.abs(this.vx[i]) + Math.abs(this.vy[i]) < 0.003) {
        this.px[i] = this.py[i] = this.vx[i] = this.vy[i] = 0;
      }

      // ---- wave: radial propagation from each click
      let wx = 0;
      let wy = 0;
      let wGlow = 0;
      for (const w of this.waves) {
        const age = now - w.t0;
        const front = (age / 1000) * waveSpeed;
        const dx = nx - w.x;
        const dy = ny - w.y;
        const d = Math.hypot(dx, dy);
        const delta = (d - front) / waveWidth;
        if (delta < -2.5 || delta > 2.5) continue;
        const envelope = Math.exp(-delta * delta);
        const life = 1 - age / waveLife; // fade out over the wave's life
        const amp = envelope * life * life * w.strength;
        // A travelling crest: push outward ahead of the front, pull back behind it.
        const dirx = d > 0.001 ? dx / d : 0;
        const diry = d > 0.001 ? dy / d : 0;
        const sign = delta < 0 ? -0.6 : 1;
        const mag = amp * waveDisplace * sign * (0.6 + 0.8 * this.depth[i]);
        wx += dirx * mag;
        wy += diry * mag;
        if (amp > wGlow) wGlow = amp;
      }

      // ---- ambient float
      let ax = 0;
      let ay = 0;
      if (ambient) {
        const t = now * 0.00045;
        const amp = 2.2 + 3.2 * this.depth[i];
        ax = Math.sin(t + this.phase[i]) * amp;
        ay = Math.cos(t * 0.9 + this.phase[i] * 1.3) * amp;
      }

      // Nearer nodes shift more with the parallax, which gives the web depth.
      const par = 0.35 + 0.65 * this.depth[i];
      this.x[i] = this.hx[i] + this.px[i] + wx + ax + this.parX * par;
      this.y[i] = this.hy[i] + this.py[i] + wy + ay + this.parY * par;

      // Glow decays smoothly, and is pushed up by the wave and by pointer proximity.
      const target = Math.max(wGlow, near * 0.6);
      const g = this.glow[i];
      this.glow[i] = target > g ? g + (target - g) * Math.min(1, 0.5 * s) : g * Math.pow(0.93, s);
      if (this.glow[i] < 0.004) this.glow[i] = 0;
    }

    // dust
    const d = this.dust;
    for (let k = 0; k < d.x.length; k++) {
      d.x[k] += d.vx[k] * dt * (0.5 + d.z[k]);
      d.y[k] += d.vy[k] * dt * (0.5 + d.z[k]);
      if (d.y[k] < -0.02) {
        d.y[k] = 1.02;
        d.x[k] = (d.x[k] * 9301 + 0.37) % 1;
      }
      if (d.x[k] < -0.02) d.x[k] = 1.02;
      if (d.x[k] > 1.02) d.x[k] = -0.02;
    }
  }
}
