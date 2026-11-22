import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { journey } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

/** Education and career as phases. Select a phase to see its milestones. */
export default function Journey() {
  const [active, setActive] = useState(journey.length - 2);
  const phase = journey[active];

  return (
    <>
      <SectionHeading kicker={`${journey.length} phases`} title="Journey" aside={<p className="max-w-xs text-sm leading-relaxed text-mist">Education, research and engineering work in order. Select a phase to see its milestones.</p>} />

      <div className="rail gutter mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Phases">
        {journey.map((s, i) => (
          <button
            key={s.number}
            role="tab"
            id={`phase-tab-${i}`}
            aria-selected={i === active}
            aria-controls="phase-panel"
            type="button"
            onClick={() => setActive(i)}
            className={`relative shrink-0 rounded-xl px-4 py-2.5 text-left transition-colors ${i === active ? 'text-bone' : 'text-mist hover:text-bone'}`}
          >
            {i === active && <motion.span layoutId="phase-pill" className="absolute inset-0 rounded-xl border border-azure-2/50 bg-azure/25" transition={{ duration: 0.45, ease: EASE }} />}
            <span className="relative block text-[10px] font-bold tracking-[0.24em] text-cyan">PHASE {String(s.number).padStart(2, '0')}</span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{s.title}</span>
          </button>
        ))}
      </div>

      <div id="phase-panel" role="tabpanel" aria-labelledby={`phase-tab-${active}`} className="gutter">
        <AnimatePresence mode="wait">
          <motion.div key={phase.number} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-4xl tracking-tight text-bone sm:text-5xl">{phase.title}</h3>
              <span className="text-sm text-mist">
                {phase.period} · {phase.milestones.length} {phase.milestones.length === 1 ? 'milestone' : 'milestones'}
              </span>
            </div>
            <p className="max-w-3xl text-[15px] leading-relaxed text-mist">{phase.synopsis}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {phase.milestones.map((m) => (
                <article key={m.code} className="card flex flex-col rounded-2xl p-5">
                  <div className="mb-3 flex items-center justify-between gap-3 text-[11px]">
                    <span className="rounded-full border border-line bg-ink-3/70 px-2.5 py-1 font-semibold tracking-[0.16em] text-cyan">{m.code}</span>
                    <span className="text-right text-smoke">{m.runtime}</span>
                  </div>
                  <h4 className="font-display text-2xl leading-tight text-bone">{m.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{m.description}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {m.tags.map((t) => (
                      <span key={t} className="rounded-full bg-ink-3/70 px-2.5 py-1 text-[11px] text-mist">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
