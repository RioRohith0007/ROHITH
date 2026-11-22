import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';
import { projectDetails } from '../data/projectDetails';
import { useScrollLock } from '../hooks/smoothScroll';
import ArchitectureFlow from './ArchitectureFlow';
import { CharReveal, EASE, Magnetic } from './fx';
import ProjectImage from './ProjectImage';
import Workflow from './Workflow';

const block = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

function Heading({ n, children }: { n: string; children: string }) {
  return (
    <h3 className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-cyan">
      <span className="text-smoke">{n}</span>
      {children}
      <span className="h-px flex-1 bg-line" />
    </h3>
  );
}

/** Full-screen project case study. Escape closes, arrow keys switch project, Tab stays inside. */
export default function ProjectModal({ project, onClose, onNavigate }: { project: Project; onClose: () => void; onNavigate: (p: Project) => void }) {
  useScrollLock(true);
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [openNote, setOpenNote] = useState(0);

  const index = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const d = projectDetails[project.id];

  const go = useCallback((p: Project) => onNavigate(p), [onNavigate]);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    return () => prevFocus?.focus?.({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && !(e.target instanceof HTMLInputElement)) {
        go(next);
      } else if (e.key === 'ArrowLeft' && !(e.target instanceof HTMLInputElement)) {
        go(prev);
      } else if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')).filter((el) => el.offsetParent !== null || el === document.activeElement);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, go, next, prev]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    setOpenNote(0);
  }, [project.id]);

  const titleId = `project-title-${project.id}`;

  return (
    <motion.div className="fixed inset-0 z-[var(--z-modal)]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      {/* background: a circular reveal that opens from the centre, with the web still faintly visible */}
      <motion.div
        className="absolute inset-0 bg-ink/90 backdrop-blur-[3px]"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        transition={{ duration: 0.8, ease: EASE }}
        onClick={onClose}
      />
      <div ref={scroller} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain" onClick={onClose}>
        <motion.div
          ref={panel}
          className="relative mx-auto min-h-full w-full max-w-6xl border-x border-line bg-ink-2 shadow-[0_0_120px_-20px_rgba(23,105,255,0.35)] sm:my-6 sm:min-h-0 sm:rounded-3xl sm:border"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, transition: { duration: 0.25 } }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          {/* top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-ink-2/95 px-4 py-3 backdrop-blur sm:rounded-t-3xl sm:px-8">
            <p className="min-w-0 truncate text-xs font-semibold tracking-[0.2em] text-mist">
              <span className="text-cyan">{String(index + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')} · {project.category.toUpperCase()}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => go(prev)} aria-label={`Previous project: ${prev.title}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone transition hover:border-cyan hover:bg-azure/20">
                ‹
              </button>
              <button type="button" onClick={() => go(next)} aria-label={`Next project: ${next.title}`} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone transition hover:border-cyan hover:bg-azure/20">
                ›
              </button>
              <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close project (Escape)" className="flex h-10 w-10 items-center justify-center rounded-full bg-azure text-lg text-white transition hover:bg-azure-2">
                ✕
              </button>
            </div>
          </div>

          <div key={project.id} className="px-4 pb-14 pt-8 sm:px-8 sm:pt-10 lg:px-12">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-azure-2">{project.year}</p>
            <CharReveal id={titleId} text={project.title} delay={0.35} className="font-display text-[clamp(2.2rem,6.2vw,4.8rem)] leading-[1] tracking-tight text-bone" />

            {/* preview expands in with a clip reveal */}
            <motion.div
              className="mt-8 overflow-hidden rounded-2xl border border-line"
              initial={{ clipPath: 'inset(14% 14% 14% 14% round 28px)', scale: 1.06, opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 16px)', scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.25 }}
            >
              <ProjectImage src={d.preview.src} alt={d.preview.alt} title={project.title} priority />
            </motion.div>
            <p className="mt-2 text-right text-[11px] tracking-[0.16em] text-smoke">ILLUSTRATIVE INTERFACE MOCKUP · NOT A SCREENSHOT OF A DEPLOYED APP</p>

            <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.09, delayChildren: 0.7 }} className="mt-10 space-y-14">
              <motion.section variants={block} className="grid gap-10 lg:grid-cols-[3fr_2fr]">
                <div>
                  <Heading n="01">Overview</Heading>
                  <p className="text-[17px] leading-relaxed text-bone/90">{d.overview}</p>
                  <div className="mt-8">
                    <Heading n="02">Problem statement</Heading>
                    <p className="text-[15px] leading-relaxed text-mist">{d.problem}</p>
                  </div>
                </div>
                <div>
                  <Heading n="03">Technical stack</Heading>
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <li key={t} className="rounded-full border border-line bg-ink-3/70 px-3.5 py-1.5 text-sm font-medium text-bone transition hover:border-cyan hover:text-cyan">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-6 space-y-2.5">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-mist">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              <motion.section variants={block}>
                <Heading n="04">System architecture</Heading>
                <ArchitectureFlow key={project.id} nodes={d.architecture.nodes} edges={d.architecture.edges} />
              </motion.section>

              <motion.section variants={block}>
                <Heading n="05">Processing workflow</Heading>
                <Workflow key={project.id} steps={d.workflow} />
              </motion.section>

              <motion.section variants={block}>
                <Heading n="06">Key implementation details</Heading>
                <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                  {d.implementation.map((n, i) => {
                    const open = openNote === i;
                    return (
                      <div key={n.title} className="bg-ink-2">
                        <button type="button" aria-expanded={open} onClick={() => setOpenNote(open ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-ink-3/50">
                          <span className="text-[15px] font-semibold text-bone">{n.title}</span>
                          <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-2xl leading-none text-cyan" aria-hidden>
                            +
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                              <p className="px-5 pb-5 text-sm leading-relaxed text-mist">{n.body}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.section>

              <motion.section variants={block}>
                <Heading n="07">Engineering challenges</Heading>
                <div className="grid gap-4 md:grid-cols-3">
                  {d.challenges.map((c) => (
                    <div key={c.title} className="rounded-2xl border border-line bg-ink-3/40 p-5 transition hover:border-cyan/50">
                      <p className="font-display text-xl leading-tight text-bone">{c.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-mist">{c.body}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={block}>
                <Heading n="08">Results</Heading>
                <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                  {project.metrics.map((m, i) => (
                    <div key={m.label} className="bg-ink-2 p-5 sm:p-6">
                      <p className={`font-display text-4xl leading-none sm:text-5xl ${i === 0 ? 'text-cyan' : 'text-bone'}`}>{m.value}</p>
                      <p className="mt-2 text-xs leading-snug text-mist">{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={block}>
                <Heading n="09">Links</Heading>
                {project.github || project.live ? (
                  <div className="flex flex-wrap gap-3">
                    {project.github && (
                      <Magnetic>
                        <a href={project.github} target="_blank" rel="noreferrer" className="flex min-h-12 items-center rounded-full bg-azure px-6 text-sm font-semibold text-white transition hover:bg-azure-2">
                          GitHub ↗
                        </a>
                      </Magnetic>
                    )}
                    {project.live && (
                      <Magnetic>
                        <a href={project.live} target="_blank" rel="noreferrer" className="flex min-h-12 items-center rounded-full border border-azure-2/60 px-6 text-sm font-semibold text-bone transition hover:border-cyan">
                          Live demo ↗
                        </a>
                      </Magnetic>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-mist">No public repository or live demo is linked for this project.</p>
                )}
              </motion.section>
            </motion.div>

            {/* previous / next */}
            <div className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              {[
                { p: prev, label: '← Previous project' },
                { p: next, label: 'Next project →' },
              ].map(({ p, label }, k) => (
                <button key={p.id + k} type="button" onClick={() => go(p)} className={`group rounded-2xl border border-line p-5 transition hover:border-cyan/60 hover:bg-azure/10 ${k === 1 ? 'sm:text-right' : 'text-left'}`}>
                  <span className="block text-[11px] font-semibold tracking-[0.2em] text-cyan">{label.toUpperCase()}</span>
                  <span className="mt-2 block font-display text-2xl leading-tight text-bone">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
