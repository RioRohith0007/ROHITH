import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';
import { projectDetails } from '../data/projectDetails';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE, SectionHeading } from './fx';
import ProjectImage from './ProjectImage';

const N = projects.length;
const STEP = 360 / N;
const rad = (d: number) => (d * Math.PI) / 180;
const mod = (n: number, m: number) => ((n % m) + m) % m;
/** Signed angular distance of a card from the front, in degrees (-180..180). */
const wrap = (d: number) => mod(d + 180, 360) - 180;

function useCardWidth() {
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1200 : window.innerWidth));
  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return { vw, cardW: Math.round(Math.max(270, Math.min(420, vw * 0.76))) };
}

/**
 * Projects as a rotating wardrobe rack: cards hang around a turntable.
 * Drag or swipe to spin it, use the arrows or keyboard, or tap a side card to bring it round.
 */
export default function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const { vw, cardW } = useCardWidth();
  const radius = Math.round(cardW * (vw < 640 ? 0.95 : 1.2));
  const reduced = useReducedMotionPref();

  const angle = useMotionValue(0);
  const smooth = useSpring(angle, { stiffness: 80, damping: 18, mass: 0.9 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(angle, 'change', (v) => setActive(mod(Math.round(v / STEP), N)));

  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.35 });
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const turn = useCallback(
    (delta: number) => {
      angle.set(Math.round(angle.get() / STEP) * STEP + delta * STEP);
    },
    [angle],
  );

  const select = useCallback(
    (i: number) => {
      const cur = Math.round(angle.get() / STEP);
      let diff = i - mod(cur, N);
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      angle.set((cur + diff) * STEP);
    },
    [angle],
  );

  // gentle auto-rotation while the rack is on screen and untouched
  useEffect(() => {
    if (reduced || !inView || hover || focused || dragging) return;
    const id = window.setInterval(() => turn(1), 4800);
    return () => window.clearInterval(id);
  }, [reduced, inView, hover, focused, dragging, turn]);

  // drag / swipe
  const drag = useRef({ down: false, moved: false, x0: 0, a0: 0, lastX: 0, lastT: 0, vx: 0 });
  const suppressClick = useRef(false);
  const pxPerStep = cardW * 0.85;

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { down: true, moved: false, x0: e.clientX, a0: angle.get(), lastX: e.clientX, lastT: performance.now(), vx: 0 };
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x0;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.vx = 0.8 * d.vx + 0.2 * ((e.clientX - d.lastX) / dt);
    d.lastX = e.clientX;
    d.lastT = now;
    angle.set(d.a0 - (dx / pxPerStep) * STEP);
  };
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (!d.moved) return;
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 0);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    const fling = -(d.vx / pxPerStep) * STEP * 260; // degrees carried by the flick
    angle.set(Math.round((angle.get() + fling) / STEP) * STEP);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') (e.preventDefault(), turn(1));
    else if (e.key === 'ArrowLeft') (e.preventDefault(), turn(-1));
  };

  const spin = useTransform(smooth, (a) => -a);
  const current = projects[active];

  return (
    <>
      <SectionHeading
        kicker={`${projects.length} projects`}
        title="Selected Work"
        aside={<p className="max-w-xs text-sm leading-relaxed text-mist">Spin the rack: drag, swipe or use the arrows. Open the front project for its architecture, workflow and results.</p>}
      />

      <div
        ref={stage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects, rotating rack"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`relative isolate mx-auto h-[36.5rem] max-w-[1500px] overflow-hidden touch-pan-y select-none sm:h-[39rem] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ perspective: 1700, perspectiveOrigin: '50% 38%' }}
      >
        {/* turntable floor */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: radius * 3.4, height: radius * 3.4 * 0.42 }}>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              rotateX: 74,
              rotateZ: spin,
              transformPerspective: 1500,
              background:
                'repeating-conic-gradient(from 0deg, rgba(86,216,255,0.55) 0deg 0.5deg, transparent 0.5deg 7.5deg), radial-gradient(closest-side, rgba(23,105,255,0.20), transparent 70%)',
              WebkitMaskImage: 'radial-gradient(closest-side, transparent 52%, #000 56%, #000 70%, transparent 72%)',
              maskImage: 'radial-gradient(closest-side, transparent 52%, #000 56%, #000 70%, transparent 72%)',
              boxShadow: '0 0 80px rgba(23,105,255,0.35)',
            }}
          />
          <div className="absolute inset-x-[18%] bottom-[16%] h-10 rounded-full bg-azure/25 blur-3xl" />
        </div>

        {projects.map((p, i) => (
          <RackCard key={p.id} project={p} index={i} smooth={smooth} cardW={cardW} radius={radius} isFront={i === active} onOpen={() => !suppressClick.current && onOpen(p)} onSelect={() => !suppressClick.current && select(i)} />
        ))}
      </div>

      {/* caption + controls */}
      <div className="gutter mx-auto mt-6 flex max-w-[1400px] flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <div className="min-h-[3.2rem] text-center sm:text-left" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={current.id} initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }} transition={{ duration: 0.4, ease: EASE }}>
              <span className="mr-3 font-display text-3xl text-cyan">{String(active + 1).padStart(2, '0')}</span>
              <span className="font-display text-2xl text-bone sm:text-3xl">{current.title}</span>
              <span className="ml-3 text-xs tracking-[0.2em] text-smoke">/ {String(N).padStart(2, '0')}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => turn(-1)} aria-label="Previous project" className="flex h-11 w-11 items-center justify-center rounded-full border border-azure-2/50 text-bone transition hover:border-cyan hover:bg-azure/20 active:scale-90">
            ←
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose project">
            {projects.map((p, i) => (
              <button key={p.id} type="button" role="tab" aria-selected={i === active} aria-label={p.title} onClick={() => select(i)} className="flex h-6 items-center">
                <motion.span className="block h-1.5 rounded-full bg-cyan" animate={{ width: i === active ? 28 : 8, opacity: i === active ? 1 : 0.35 }} transition={{ duration: 0.4, ease: EASE }} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => turn(1)} aria-label="Next project" className="flex h-11 w-11 items-center justify-center rounded-full border border-azure-2/50 text-bone transition hover:border-cyan hover:bg-azure/20 active:scale-90">
            →
          </button>
        </div>
      </div>
    </>
  );
}

function RackCard({ project: p, index, smooth, cardW, radius, isFront, onOpen, onSelect }: { project: Project; index: number; smooth: MotionValue<number>; cardW: number; radius: number; isFront: boolean; onOpen: () => void; onSelect: () => void }) {
  const d = projectDetails[p.id];
  const key = p.metrics[0];
  const base = index * STEP;

  const rel = useTransform(smooth, (a) => wrap(base - a));
  const x = useTransform(rel, (r) => Math.sin(rad(r)) * radius);
  const z = useTransform(rel, (r) => (Math.cos(rad(r)) - 1) * radius);
  const rotateY = useTransform(rel, (r) => r * 0.58);
  const abs = useTransform(rel, (r) => Math.abs(r));
  const scale = useTransform(abs, (a) => 1 - 0.1 * Math.min(1, a / 90));
  const opacity = useTransform(abs, (a) => (a <= 100 ? 1 - 0.45 * (a / 100) : Math.max(0, 0.55 * (1 - (a - 100) / 60))));
  const filter = useTransform(abs, (a) => `brightness(${1 - 0.5 * Math.min(1, a / 90)})`);
  const zIndex = useTransform(abs, (a) => Math.round(100 - a / 2));
  const pointerEvents = useTransform(abs, (a) => (a < 105 ? 'auto' : 'none'));

  return (
    <motion.div className="absolute top-3 will-change-transform" style={{ left: '50%', marginLeft: -cardW / 2, width: cardW, x, z, rotateY, scale, opacity, filter, zIndex, pointerEvents }} aria-hidden={!isFront}>
      <article className="card group flex h-[34rem] flex-col overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgba(0,10,60,0.9)] sm:h-[36rem]" onClick={isFront ? undefined : onSelect}>
        <button type="button" tabIndex={isFront ? 0 : -1} onClick={isFront ? onOpen : undefined} aria-label={`Open case study: ${p.title}`} className="relative block w-full text-left focus-visible:outline-offset-[-3px]">
          <div className="overflow-hidden">
            <div className="transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.05]">
              <ProjectImage src={d.preview.src} alt={d.preview.alt} title={p.title} priority />
            </div>
          </div>
        </button>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3 text-[11px] font-semibold tracking-[0.2em]">
            <p className="min-w-0 text-azure-2">
              <span className="mr-2 text-cyan">{String(index + 1).padStart(2, '0')}</span>
              {p.year} · {p.category.toUpperCase()}
            </p>
            <span className="shrink-0 text-[10px] tracking-[0.16em] text-smoke">MOCKUP</span>
          </div>
          <h3 className="mt-2 font-display text-[1.8rem] leading-[1.05] text-bone">{p.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">{p.logline}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.stack.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full border border-line bg-ink-3/60 px-2.5 py-1 text-[11px] text-mist">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <p className="min-w-0">
              <span className="block font-display text-3xl leading-none text-cyan">{key.value}</span>
              <span className="mt-1 block text-xs text-mist">{key.label}</span>
            </p>
            <button type="button" tabIndex={isFront ? 0 : -1} onClick={isFront ? onOpen : undefined} className="shrink-0 rounded-full border border-azure-2/50 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-bone transition hover:border-cyan hover:bg-azure/20">
              CASE STUDY →
            </button>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
