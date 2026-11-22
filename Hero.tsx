import { motion } from 'framer-motion';
import { education, profile, projects } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { CountUp, EASE, Magnetic, Tilt, Typewriter } from './fx';
import PortraitFrame from './PortraitFrame';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } };
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

const CHIPS = [
  { t: 'YOLOv8', pos: '-left-3 top-[14%] sm:-left-6' },
  { t: 'PyTorch', pos: '-right-2 top-[46%] sm:-right-6' },
  { t: 'OpenCV', pos: 'bottom-[22%] -left-2 sm:-left-8' },
];

const FOCUS = ['Python', 'PyTorch', 'TensorFlow', 'YOLOv8', 'OpenCV', 'Docker'];

export default function Hero({ onResume }: { onResume: () => void }) {
  const { scrollTo } = useSmoothScroll();
  const facts = [
    { v: '85%', l: 'model accuracy on real-world data' },
    { v: '30%', l: 'faster automated data pipelines' },
    { v: String(projects.length), l: 'ML, vision and full-stack projects' },
  ];

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center pb-16 pt-28 sm:pt-32">
      <div className="gutter mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <motion.div variants={stagger} initial="hidden" animate="show" className="min-w-0">
          <motion.p variants={rise} className="mb-5 flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-cyan">
            <span className="h-px w-8 bg-cyan/70" />
            {profile.location.toUpperCase()}
          </motion.p>
          <h1 className="name-shimmer font-display leading-[0.88] tracking-tight" style={{ fontSize: 'clamp(2.8rem, 8.4vw, 8.5rem)' }}>
            <span className="block overflow-hidden whitespace-nowrap pb-[0.08em]">
              <motion.span className="block" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}>
                ROHITH R
              </motion.span>
            </span>
          </h1>
          <motion.p variants={rise} className="mt-4 text-sm font-bold tracking-[0.5em] text-azure-2 sm:text-base">
            AI/ML ENGINEER
          </motion.p>
          <motion.p variants={rise} className="mt-3 h-7 text-lg font-semibold text-bone sm:text-xl">
            <Typewriter phrases={['Computer Vision', 'Deep Learning', 'LLM Applications', 'Edge AI Deployment', 'Real-time ML Systems']} />
          </motion.p>

          <motion.p variants={rise} className="mt-7 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base">
            {profile.intro}
          </motion.p>

          <motion.ul variants={rise} className="mt-6 flex flex-wrap gap-2" aria-label="Core stack">
            {FOCUS.map((t) => (
              <li key={t} className="rounded-full border border-line bg-ink-2/80 px-3 py-1.5 text-xs font-medium text-bone">
                {t}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button type="button" onClick={() => scrollTo('#projects', { offset: -84 })} className="cta-pulse relative flex min-h-12 items-center gap-2 rounded-full bg-azure px-7 text-[15px] font-semibold text-white shadow-[0_0_40px_-8px_rgba(23,105,255,0.8)] transition hover:bg-azure-2 active:scale-[0.97]">
                View projects <span aria-hidden>→</span>
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={onResume} className="flex min-h-12 items-center rounded-full border border-azure-2/50 px-7 text-[15px] font-semibold text-bone transition hover:border-cyan hover:bg-azure/15 active:scale-[0.97]">
                View resume
              </button>
            </Magnetic>
          </motion.div>

          <motion.dl variants={rise} className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
            {facts.map((f) => (
              <div key={f.l}>
                <dt className="font-display text-3xl leading-none text-cyan sm:text-4xl"><CountUp value={f.v} delay={1.1} /></dt>
                <dd className="mt-2 text-[11px] leading-snug text-mist sm:text-xs">{f.l}</dd>
              </div>
            ))}
          </motion.dl>
          <motion.p variants={rise} className="mt-6 text-xs text-smoke">
            B.Tech, Artificial Intelligence & Data Science · {education[0].school} · {education[0].score}
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease: EASE, delay: 0.5 }} className="relative z-[var(--z-card)] mx-auto w-full max-w-[min(100%,26rem)] lg:max-w-none">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="relative mx-auto w-full lg:max-w-[28rem]">
            <Tilt max={6}>
              <PortraitFrame eager sizes="(max-width: 1024px) 80vw, 34vw" className="w-full" />
            </Tilt>
            {CHIPS.map((c, i) => (
              <motion.span
                key={c.t}
                aria-hidden
                className={`glass absolute z-[2] rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] text-bone shadow-[0_12px_30px_-10px_rgba(23,105,255,0.7)] ${c.pos}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, y: [0, i % 2 ? 10 : -10, 0] }}
                transition={{ opacity: { delay: 1.2 + i * 0.2, duration: 0.6 }, scale: { delay: 1.2 + i * 0.2, duration: 0.6, ease: EASE }, y: { duration: 4.5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 } }}
              >
                {c.t}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
