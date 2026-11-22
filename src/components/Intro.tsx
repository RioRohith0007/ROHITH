import { useEffect, useRef, useState, type RefObject } from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { profile } from '../data/portfolio';
import { EASE } from './fx';

/**
 * Cinematic title-card intro.
 *
 *  1. Black frame. Letterbox bars slide in, a cold backlight + light shafts rise, "REC" timecode starts.
 *  2. A dark smoke-shadow rolls in from the left, carrying a lit blue mist at its leading edge.
 *  3. ROHITH R flows out of the shadow letter by letter (drifting, un-blurring, tracking tightening).
 *  4. An anamorphic flare rides the front of the shadow, a glint sweeps across the finished title,
 *     the role line draws in, the camera pushes in, cut to the site.
 *
 * Only this file changed — props are identical (`onDone`), so the rest of the site is untouched.
 */

const NAME = 'ROHITH R';
const LETTERS = NAME.split('');
const FONT = 'clamp(3rem, 13vw, 10rem)';
const SW_END = 1.3;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** where the reveal front is, in fractions of the title's width, for shadow progress `s` */
const edgeOf = (s: number) => -0.3 + s * 1.5;
const pad = (n: number) => String(n).padStart(2, '0');

const SILVER = 'linear-gradient(180deg, #ffffff 0%, #dbe8fa 42%, #7f98bb 100%)';

// film grain as an inline SVG noise tile
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// slow floating dust caught in the light
const DUST = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 1 + (i % 3),
  dur: 8 + (i % 7),
  delay: (i % 6) * 0.6,
}));

/* ───────────────────────── smoke shadow (canvas) ───────────────────────── */

type Puff = { back: number; dy: number; r: number; o: number; sp: number; ph: number; ax: number; ay: number };

function makePuffs(): Puff[] {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 42 }, () => ({
    back: rnd() * 0.5,
    dy: (rnd() - 0.5) * 0.5,
    r: 0.1 + rnd() * 0.14,
    o: 0.55 + rnd() * 0.4,
    sp: 0.4 + rnd() * 0.9,
    ph: rnd() * 6.28,
    ax: 10 + rnd() * 40,
    ay: 10 + rnd() * 30,
  }));
}

function makeSprite(stops: [number, string][]) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  return c;
}

/** Dark drifting smoke that rides the reveal front, with a lit mist and an anamorphic flare on its edge. */
function Smoke({ sw, power, box, active }: { sw: MotionValue<number>; power: MotionValue<number>; box: RefObject<HTMLDivElement>; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || !active) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const K = 0.5; // render at half resolution — smoke is soft, and this keeps it cheap
    const dark = makeSprite([
      [0, 'rgba(0,0,0,0.95)'],
      [0.45, 'rgba(2,6,16,0.65)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
    const blue = makeSprite([
      [0, 'rgba(130,195,255,0.65)'],
      [0.4, 'rgba(40,120,255,0.25)'],
      [1, 'rgba(23,105,255,0)'],
    ]);
    const puffs = makePuffs();

    const resize = () => {
      cv.width = Math.ceil(window.innerWidth * K);
      cv.height = Math.ceil(window.innerHeight * K);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const frame = (now: number) => {
      const w = cv.width;
      const h = cv.height;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);

      const el = box.current;
      const s = sw.get();
      const pw = power.get();
      if (el && pw > 0.01) {
        const r = el.getBoundingClientRect();
        const t = now / 1000;
        const frontX = (r.left + edgeOf(s) * r.width) * K;
        const cy = (r.top + r.height * 0.52) * K;
        const fade = pw * (1 - smooth(1.0, SW_END, s));
        const big = Math.max(w, h);

        // lit mist + flare on the leading edge
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = pw * (1 - smooth(1.05, SW_END, s));
        const mist = h * 0.55;
        ctx.drawImage(blue, frontX - mist * 0.4, cy - mist / 2, mist, mist);

        const life = Math.sin(Math.PI * clamp01(s / 1.2));
        if (life > 0.01) {
          const len = w * 0.32;
          const gr = ctx.createLinearGradient(frontX - len, 0, frontX + len, 0);
          gr.addColorStop(0, 'rgba(120,200,255,0)');
          gr.addColorStop(0.5, 'rgba(190,230,255,0.95)');
          gr.addColorStop(1, 'rgba(120,200,255,0)');
          ctx.globalAlpha = life * pw;
          ctx.fillStyle = gr;
          ctx.fillRect(frontX - len, cy - 1.4, len * 2, 2.8);
          ctx.drawImage(blue, frontX - 30, cy - 30, 60, 60);
        }

        // the shadow body
        ctx.globalCompositeOperation = 'source-over';
        for (const p of puffs) {
          const x = frontX - p.back * w + Math.sin(t * p.sp + p.ph) * p.ax * K;
          const y = cy + p.dy * h + Math.cos(t * p.sp * 0.8 + p.ph) * p.ay * K;
          const rad = p.r * big * 1.6;
          ctx.globalAlpha = fade * p.o;
          ctx.drawImage(dark, x - rad, y - rad * 0.8, rad * 2, rad * 1.6);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active, sw, power, box]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}

/* ───────────────────────── one letter of the title ───────────────────────── */

function Letter({ ch, i, edge }: { ch: string; i: number; edge: MotionValue<number> }) {
  const f = (i + 0.5) / LETTERS.length;
  const p = useTransform(edge, (e) => clamp01((e - f) / 0.3));
  const x = useTransform(p, (v) => `${(1 - v) * -0.32}em`);
  const y = useTransform(p, (v) => `${(1 - v) * 0.05}em`);
  const filter = useTransform(p, (v) => `blur(${((1 - v) * 12).toFixed(2)}px)`);
  return (
    <motion.span
      className="inline-block"
      style={{
        opacity: p,
        x,
        y,
        filter,
        backgroundImage: SILVER,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {ch === ' ' ? '\u00A0' : ch}
    </motion.span>
  );
}

/* ───────────────────────── the intro ───────────────────────── */

export default function Intro({ onDone }: { onDone: () => void }) {
  const done = useRef(onDone);
  done.current = onDone;
  const [fired, setFired] = useState(false);
  const firedRef = useRef(false);

  const nameBox = useRef<HTMLDivElement>(null);
  const [subtitle, setSubtitle] = useState(false);
  const [pre, setPre] = useState(false);
  const [smokeOn, setSmokeOn] = useState(true);

  // animated values
  const bars = useMotionValue(0); // letterbox height in vh
  const sw = useMotionValue(0); // shadow progress, 0 → 1.3
  const power = useMotionValue(0); // shadow opacity
  const haze = useMotionValue(0);
  const rim = useMotionValue(0);
  const glint = useMotionValue(0);
  const zoom = useMotionValue(1.06);
  const clock = useMotionValue(0);

  const barH = useTransform(bars, (v) => `${v}vh`);
  const barsOp = useTransform(bars, [6, 11], [0, 1]);
  const edge = useTransform(sw, edgeOf);
  const tracking = useTransform(sw, [0, SW_END], ['0.24em', '0.1em']);
  const glowMask = useTransform(edge, (e) => {
    const p = e * 100;
    return `linear-gradient(90deg, #000 ${p - 60}%, transparent ${p - 5}%)`;
  });
  const glowOp = useTransform(sw, [0, 0.4, 1.3], [0, 0.9, 0.55]);
  const glintBg = useTransform(glint, (g) => {
    const p = g * 150 - 25;
    return `linear-gradient(105deg, transparent ${p - 14}%, rgba(255,255,255,0.95) ${p}%, transparent ${p + 14}%)`;
  });
  const glintOp = useTransform(glint, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const timecode = useTransform(clock, (v) => `TC 00:00:${pad(Math.floor(v))}:${pad(Math.floor((v % 1) * 24))}`);

  const finish = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setFired(true);
    done.current();
  };

  useEffect(() => {
    let cancelled = false;
    const alive = () => !cancelled && !firedRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // make sure the portrait is cached before the site shows
    let imgReady = false;
    const img = new Image();
    img.onload = img.onerror = () => {
      imgReady = true;
    };
    img.src = profile.portrait.src;

    const waitForImage = async () => {
      const t0 = performance.now();
      while (!imgReady && performance.now() - t0 < 2500 && alive()) await sleep(80);
    };

    const run = async () => {
      if (reduce) {
        // no motion: show the finished title card briefly, then continue
        setSmokeOn(false);
        bars.set(11);
        sw.set(SW_END);
        haze.set(1);
        zoom.set(1);
        setPre(true);
        setSubtitle(true);
        await sleep(700);
        await waitForImage();
        if (alive()) finish();
        return;
      }

      // 1. black → letterbox, backlight, timecode
      await sleep(300);
      if (!alive()) return;
      animate(bars, 11, { duration: 1.4, ease: [0.65, 0, 0.35, 1] });
      animate(haze, 1, { duration: 2.4, ease: 'easeInOut' });
      animate(rim, [0, 0.5, 0.3], { duration: 2.8, ease: 'easeInOut' });
      animate(clock, 12, { duration: 12, ease: 'linear' });
      await sleep(800);
      if (!alive()) return;
      setPre(true);
      await sleep(900);
      if (!alive()) return;

      // 2–3. the shadow rolls across and the name flows out of it
      animate(power, 1, { duration: 0.9 });
      const flow = animate(sw, SW_END, { duration: 5, ease: [0.35, 0.02, 0.55, 1] });
      animate(zoom, 1, { duration: 6, ease: 'easeOut' });
      await sleep(3200);
      if (!alive()) return;
      setSubtitle(true);
      await sleep(800);
      if (!alive()) return;
      animate(glint, 1, { duration: 1.8, ease: 'easeInOut' });
      await flow;
      if (!alive()) return;

      // 4. hold, push in, cut
      await sleep(1000);
      if (!alive()) return;
      animate(zoom, 1.1, { duration: 1.1, ease: 'easeIn' });
      await sleep(800);
      await waitForImage();
      if (alive()) finish();
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[var(--z-loader)] flex flex-col items-center justify-center overflow-hidden bg-ink px-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(18px)' }}
      transition={{ duration: 1, ease: EASE }}
      role="status"
      aria-label="Rohith R, AI/ML Engineer"
    >
      {/* slow push-in on the atmosphere */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" initial={{ scale: 1 }} animate={{ scale: 1.12 }} transition={{ duration: 12, ease: 'linear' }}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_52%,rgba(11,31,58,0.7),transparent_75%)]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[46vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(23,105,255,0.22), transparent 78%)', filter: 'blur(36px)', opacity: rim }}
        />
      </motion.div>

      {/* light shafts from above, swaying slowly */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: haze }}>
        <motion.div
          className="absolute left-1/2 top-[-10%] h-[120%] w-[140vw] -translate-x-1/2"
          style={{
            background:
              'conic-gradient(from 180deg at 50% 0%, transparent 154deg, rgba(86,170,255,0.10) 170deg, transparent 178deg, rgba(86,170,255,0.07) 186deg, transparent 192deg, rgba(86,170,255,0.09) 204deg, transparent 214deg)',
            filter: 'blur(10px)',
            transformOrigin: '50% 0%',
          }}
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* blue backlight band the shadow passes through, so it reads as a silhouette */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: haze }}>
        <div className="absolute left-0 top-[46%] h-[46vh] w-full -translate-y-1/2 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(54,139,255,0.3),transparent_100%)]" />
        <motion.div
          className="absolute left-1/2 top-[46%] h-[2px] w-[90vw] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(160,215,255,0.75) 50%, transparent)', filter: 'blur(2px)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 0.6, ease: EASE }}
        />
      </motion.div>

      {/* floating dust */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {DUST.map((d, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#bfe3ff]"
            style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, filter: 'blur(0.5px)' }}
            animate={{ y: [0, -46, 0], x: [0, 16, 0], opacity: [0, 0.55, 0] }}
            transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* pre-title line */}
      <motion.p
        aria-hidden
        className="mb-6 text-[10px] font-semibold text-azure-2/80 sm:text-xs"
        initial={{ opacity: 0, letterSpacing: '0.2em', y: 6 }}
        animate={pre ? { opacity: 1, letterSpacing: '0.55em', y: 0 } : { opacity: 0, letterSpacing: '0.2em', y: 6 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        A PORTFOLIO ORIGINAL
      </motion.p>

      {/* the title, flowing out of the shadow */}
      <motion.div style={{ scale: zoom }} className="relative">
        <div ref={nameBox} className="relative select-none">
          {/* blue glow behind the letters (blur lives on the wrapper so the reveal mask can't clip it into a box) */}
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ filter: 'blur(20px)', opacity: glowOp }}>
            <motion.h1
              className="whitespace-pre font-display font-semibold leading-none"
              style={{
                fontSize: FONT,
                letterSpacing: tracking,
                fontKerning: 'none',
                color: 'rgba(23,105,255,0.9)',
                maskImage: glowMask,
                WebkitMaskImage: glowMask,
              }}
            >
              {NAME}
            </motion.h1>
          </motion.div>

          {/* letters, each drifting into focus */}
          <motion.h1
            aria-hidden
            className="relative flex whitespace-pre font-display font-semibold leading-none"
            style={{ fontSize: FONT, letterSpacing: tracking, fontKerning: 'none', filter: 'drop-shadow(0 10px 26px rgba(23,105,255,0.45))' }}
          >
            {LETTERS.map((ch, i) => (
              <Letter key={i} ch={ch} i={i} edge={edge} />
            ))}
          </motion.h1>

          {/* glint sweeping across the finished title */}
          <motion.h1
            aria-hidden
            className="pointer-events-none absolute inset-0 whitespace-pre font-display font-semibold leading-none"
            style={{
              fontSize: FONT,
              letterSpacing: tracking,
              fontKerning: 'none',
              backgroundImage: glintBg,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              opacity: glintOp,
            }}
          >
            {NAME.replace(' ', '\u00A0')}
          </motion.h1>
        </div>
      </motion.div>

      {/* role, set like a title card with hairlines either side */}
      <div className="mt-7 flex items-center gap-5">
        <motion.span
          aria-hidden
          className="block h-px bg-azure-2/70"
          initial={{ width: 0, opacity: 0 }}
          animate={subtitle ? { width: 'clamp(28px, 6vw, 80px)', opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <motion.p
          className="h-5 text-xs font-bold text-azure-2 sm:text-sm"
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={subtitle ? { opacity: 1, letterSpacing: '0.6em' } : { opacity: 0, letterSpacing: '0.2em' }}
          transition={{ duration: 1.6, ease: EASE }}
          aria-hidden
        >
          AI/ML ENGINEER
        </motion.p>
        <motion.span
          aria-hidden
          className="block h-px bg-azure-2/70"
          initial={{ width: 0, opacity: 0 }}
          animate={subtitle ? { width: 'clamp(28px, 6vw, 80px)', opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </div>

      {/* the flowing smoke shadow — drawn over the title so the name emerges from it */}
      <Smoke sw={sw} power={power} box={nameBox} active={smokeOn} />

      {/* vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

      {/* film grain */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-1/2 opacity-[0.09] mix-blend-screen"
        style={{ backgroundImage: GRAIN, backgroundSize: '220px 220px' }}
        animate={{ x: ['0%', '-4%', '3%', '-2%', '0%'], y: ['0%', '3%', '-4%', '2%', '0%'] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear', times: [0, 0.25, 0.5, 0.75, 1] }}
      />

      {/* letterbox bars */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 bg-black" style={{ height: barH }} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 bg-black" style={{ height: barH }} />

      {/* camera readout, living inside the letterbox bars */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-4 z-[5] flex items-center justify-between px-5 text-[10px] font-semibold tracking-[0.25em] text-smoke sm:px-8"
        style={{ opacity: barsOp }}
      >
        <span className="flex items-center gap-2">
          <motion.i className="block h-1.5 w-1.5 rounded-full bg-[#ff3b3b]" animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          REC
        </span>
        <motion.span className="tabular-nums">{timecode}</motion.span>
      </motion.div>

      <button
        type="button"
        onClick={finish}
        disabled={fired}
        className="absolute bottom-6 right-6 z-10 rounded-full border border-line px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-smoke transition hover:border-cyan hover:text-bone"
      >
        SKIP
      </button>
    </motion.div>
  );
}
