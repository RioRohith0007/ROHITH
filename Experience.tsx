import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { experience } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

/** Experience as a glass timeline. Tap a card to open the full list of what was done. */
export default function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <SectionHeading kicker="Experience" title="Where I’ve Worked" />
      <div className="gutter relative mx-auto grid max-w-4xl gap-4">
        <span aria-hidden className="absolute bottom-8 left-[calc(var(--gutter)+5px)] top-8 hidden w-px bg-gradient-to-b from-azure-2/70 via-azure/30 to-transparent sm:block" />
        {experience.map((e, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={e.company + e.role}
              className="relative sm:pl-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            >
              <span aria-hidden className="absolute left-0 top-8 hidden h-3.5 w-3.5 rounded-full bg-azure-2 shadow-[0_0_0_6px_rgba(47,107,255,0.25)] sm:block" />
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="glass block w-full rounded-2xl p-5 text-left transition hover:bg-white/[0.07] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-azure-2">{e.period}</p>
                    <h3 className="mt-1 font-display text-3xl leading-tight text-bone sm:text-4xl">
                      {e.role} · {e.company}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{e.points[0]}</p>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-3xl leading-none text-mist" aria-hidden>
                    +
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && e.points.length > 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                        {e.points.slice(1).map((p) => (
                          <li key={p} className="flex gap-3 text-sm leading-relaxed text-bone/90">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure-2" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
