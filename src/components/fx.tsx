import type { ReactNode, PointerEvent as RPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Wraps a control so it drifts toward the pointer. Desktop only, off for reduced motion. */
export function Magnetic({ children, strength = 0.3, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  const active = fine && !reduced;

  const onMove = (e: RPointerEvent<HTMLSpanElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className={`inline-flex ${className}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

/** Controlled 3D tilt that follows the pointer by a few degrees. Flat on touch devices and with reduced motion. */
export function Tilt({ children, max = 5, className = '', ...rest }: { children: ReactNode; max?: number; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const active = fine && !reduced;
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 22 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 22 });

  return (
    <motion.div
      {...rest}
      className={className}
      style={active ? { rotateX: rx, rotateY: ry, transformPerspective: 1000 } : undefined}
      onPointerMove={(e) => {
        if (!active) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

const wordVariants = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

/** Word-by-word masked reveal for headings. Plays when scrolled into view. */
export function RevealText({ text, className = '', delay = 0, as = 'span' }: { text: string; className?: string; delay?: number; as?: 'span' | 'h2' | 'h3' | 'p' }) {
  const Tag = motion[as];
  const words = text.split(' ');
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-4% 0px' }} transition={{ staggerChildren: 0.06, delayChildren: delay }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span className="inline-block" variants={wordVariants}>
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Character-by-character masked reveal. Words never break mid-word; plays on mount. */
export function CharReveal({ text, className = '', delay = 0, id }: { text: string; className?: string; delay?: number; id?: string }) {
  const words = text.split(' ');
  let n = 0;
  return (
    <motion.h2 id={id} className={className} initial="hidden" animate="show" transition={{ staggerChildren: 0.022, delayChildren: delay }} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(w).map((ch) => (
            <span key={n++} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className="inline-block" variants={wordVariants}>
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </motion.h2>
  );
}

/** Kicker + title used at the top of every section. */
export function SectionHeading({ kicker, title, aside }: { kicker: string; title: string; aside?: ReactNode }) {
  return (
    <div className="gutter mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
      <div className="min-w-0">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan"
        >
          <motion.span className="h-px w-8 origin-left bg-cyan/70" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }} />
          {kicker}
        </motion.div>
        <RevealText as="h2" text={title} className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] tracking-tight text-bone" />
      </div>
      {aside}
    </div>
  );
}

/** Counts a figure such as "85%" or "4" up from zero once it is on screen. */
export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotionPref();
  const target = m ? parseFloat(m[1]) : 0;
  const [n, setN] = useState(reduced || !m ? target : 0);

  useEffect(() => {
    if (!inView || reduced || !m) return;
    const c = animate(0, target, { duration: 1.8, delay, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (!m) return <span>{value}</span>;
  return (
    <span ref={ref} aria-label={value}>
      {n}
      {m[2]}
    </span>
  );
}

/** Thin progress line along the top edge that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[var(--z-nav)] h-[3px] origin-left bg-gradient-to-r from-azure via-cyan to-azure-2 shadow-[0_0_14px_rgba(86,216,255,0.8)]" style={{ scaleX }} />;
}

/** Soft light that trails the mouse. Desktop only. */
export function CursorGlow() {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const x = useSpring(-400, { stiffness: 90, damping: 20, mass: 0.6 });
  const y = useSpring(-400, { stiffness: 90, damping: 20, mass: 0.6 });
  useEffect(() => {
    if (!fine || reduced) return;
    const on = (e: PointerEvent) => {
      x.set(e.clientX - 260);
      y.set(e.clientY - 260);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [fine, reduced, x, y]);
  if (!fine || reduced) return null;
  return <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[3] h-[520px] w-[520px] rounded-full" style={{ x, y, background: 'radial-gradient(closest-side, rgba(54,139,255,0.16), transparent)' }} />;
}

/** Types a phrase, holds, deletes, then moves to the next. */
export function Typewriter({ phrases, className = '' }: { phrases: string[]; className?: string }) {
  const reduced = useReducedMotionPref();
  const [i, setI] = useState(0);
  const [text, setText] = useState(reduced ? phrases[0] : '');
  useEffect(() => {
    if (reduced) return;
    let n = 0;
    let dir = 1;
    let timer = 0;
    const tick = () => {
      const full = phrases[i % phrases.length];
      n += dir;
      setText(full.slice(0, n));
      if (dir === 1 && n === full.length) {
        dir = -1;
        timer = window.setTimeout(tick, 1700);
      } else if (dir === -1 && n === 0) {
        setI((v) => v + 1);
      } else {
        timer = window.setTimeout(tick, dir === 1 ? 65 : 30);
      }
    };
    timer = window.setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [i, phrases, reduced]);
  return (
    <span className={className} aria-label={phrases.join(', ')}>
      <span aria-hidden>{text}</span>
      <span aria-hidden className="caret" />
    </span>
  );
}
