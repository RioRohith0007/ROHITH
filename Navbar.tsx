import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sections, type SectionId } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic } from './fx';

const LINKS: { id: SectionId | 'contact'; label: string }[] = [...sections.map((s) => ({ id: s.id, label: s.nav })), { id: 'contact', label: 'Contact' }];

/** Floating navigation: animated active indicator on desktop, a drop-down panel on small screens. */
export default function Navbar() {
  const [active, setActive] = useState<string>('top');
  const [open, setOpen] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', ...LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`, { offset: id === 'top' ? 0 : -84 });
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-nav)] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        className="pointer-events-auto w-full max-w-[1180px] rounded-2xl border border-line bg-ink/80 shadow-[0_18px_50px_-24px_rgba(23,105,255,0.55)] backdrop-blur-xl"
      >
        <div className="flex h-14 items-center justify-between gap-4 pl-4 pr-2 sm:pl-5">
          <button type="button" onClick={() => go('top')} className="shrink-0 text-left" aria-label="ROHITH R, back to top">
            <span className="block font-display text-xl leading-none tracking-wide text-bone">ROHITH R</span>
            <span className="block text-[9px] font-semibold tracking-[0.28em] text-cyan">AI/ML ENGINEER</span>
          </button>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Sections">
            {LINKS.map((l) => (
              <button key={l.id} type="button" onClick={() => go(l.id)} aria-current={active === l.id ? 'true' : undefined} className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${active === l.id ? 'text-bone' : 'text-mist hover:text-bone'}`}>
                {active === l.id && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full border border-azure-2/40 bg-azure/25" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Magnetic>
              <a href="#contact" onClick={(e) => { e.preventDefault(); go('contact'); }} className="rounded-full bg-azure px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-azure-2">
                Get in touch
              </a>
            </Magnetic>
          </div>

          <button type="button" className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)}>
            <motion.span className="block h-0.5 w-5 bg-bone" animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }} />
            <motion.span className="block h-0.5 w-5 bg-bone" animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }} />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              aria-label="Sections"
              className="overflow-hidden border-t border-line lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <ul className="max-h-[70svh] overflow-y-auto p-3">
                {LINKS.map((l) => (
                  <li key={l.id}>
                    <button type="button" onClick={() => go(l.id)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-lg font-medium ${active === l.id ? 'bg-azure/20 text-bone' : 'text-mist'}`}>
                      {l.label}
                      {active === l.id && <span className="h-1.5 w-1.5 rounded-full bg-cyan" />}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
