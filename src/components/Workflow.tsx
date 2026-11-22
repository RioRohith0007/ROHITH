import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Step } from '../data/projectDetails';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE } from './fx';

/** Animated processing workflow. Steps light up in sequence; click any step to take over. */
export default function Workflow({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const reduced = useReducedMotionPref();
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!inView || manual || reduced) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % steps.length), 2200);
    return () => window.clearInterval(t);
  }, [inView, manual, reduced, steps.length]);

  const pct = steps.length > 1 ? (i / (steps.length - 1)) * 100 : 100;

  return (
    <div ref={ref} className="glass rounded-2xl p-5 sm:p-7">
      <div className="relative">
        <div aria-hidden className="absolute left-[18px] right-[18px] top-[18px] hidden h-px bg-line md:block" />
        <motion.div aria-hidden className="absolute left-[18px] top-[18px] hidden h-px bg-cyan md:block" style={{ right: 18 }} animate={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} transition={{ duration: 0.6, ease: EASE }} />
        <ol className="relative grid gap-3 md:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] md:gap-4" style={{ ['--n' as string]: steps.length }}>
          {steps.map((s, k) => {
            const done = k < i;
            const on = k === i;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  aria-current={on ? 'step' : undefined}
                  onClick={() => {
                    setManual(true);
                    setI(k);
                  }}
                  className="flex w-full items-start gap-3 rounded-xl p-1 text-left md:flex-col md:gap-4"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 ${on ? 'border-cyan bg-cyan text-ink' : done ? 'border-azure-2 bg-azure/30 text-bone' : 'border-line bg-ink-2 text-mist'}`}>{k + 1}</span>
                  <span className="min-w-0">
                    <span className={`block text-[15px] font-semibold transition-colors duration-300 ${on ? 'text-bone' : 'text-mist'}`}>{s.title}</span>
                    <span className={`mt-1 block text-[13px] leading-relaxed text-mist md:hidden ${on ? '' : 'hidden'}`}>{s.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-5 hidden border-t border-line pt-5 md:block" aria-live="polite">
        <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-3xl text-[15px] leading-relaxed text-bone/90">
          <span className="mr-2 font-semibold text-cyan">Step {i + 1}.</span>
          {steps[i].text}
        </motion.p>
      </div>
    </div>
  );
}
