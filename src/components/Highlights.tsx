import { motion } from 'framer-motion';
import { highlights } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

/** Measured results and credentials from the resume, as a grid of figures. */
export default function Highlights() {
  return (
    <>
      <SectionHeading kicker="From the resume" title="Highlights" />
      <div className="gutter mx-auto grid max-w-[1400px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {highlights.map((h, i) => (
          <motion.div key={h.title + h.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-6% 0px' }} transition={{ duration: 0.6, ease: EASE, delay: (i % 5) * 0.05 }} className="card flex min-w-0 flex-col rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-smoke">{h.label}</p>
            <p className="mt-4 break-words font-display text-3xl leading-none text-cyan sm:text-4xl">{h.title}</p>
            <p className="mt-3 text-xs leading-relaxed text-mist">{h.detail}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
}
