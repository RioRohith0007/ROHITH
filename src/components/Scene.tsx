import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE } from './fx';

/** A page section: spacing, the scroll anchor, and a soft rise-into-view as it arrives. */
export default function Scene({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="relative py-16 sm:py-24">
      <motion.div initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.04 }} transition={{ duration: 1, ease: EASE }}>
        {children}
      </motion.div>
    </section>
  );
}
