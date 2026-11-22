import { profile } from '../data/portfolio';
import ContactForm, { Marquee } from './ContactForm';
import { Magnetic, RevealText } from './fx';

/** Contact section and footer. */
export default function FinalCTA() {
  const links = [
    { label: 'Email', href: `mailto:${profile.email}`, text: profile.email },
    { label: 'LinkedIn', href: profile.links.linkedin, text: 'linkedin.com' },
    { label: 'GitHub', href: profile.links.github, text: 'github.com' },
  ];
  return (
    <section id="contact" className="relative pt-16 sm:pt-24">
      <div className="gutter mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan">
            <span className="h-px w-8 bg-cyan/70" />
            Contact
          </p>
          <RevealText as="h2" text="Get in touch" className="font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.92] tracking-tight text-bone" />
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist">Open to AI/ML engineering roles. The quickest way to reach me is email.</p>
          <ul className="mt-8 space-y-3">
            {links.map((l) => (
              <li key={l.label}>
                <Magnetic>
                  <a href={l.href} target={l.label === 'Email' ? undefined : '_blank'} rel="noreferrer" className="group flex min-h-12 items-center gap-4 rounded-xl border border-line bg-ink-2 px-5 py-3 transition hover:border-cyan/60 hover:bg-azure/10">
                    <span className="w-20 text-[11px] font-bold tracking-[0.2em] text-cyan">{l.label.toUpperCase()}</span>
                    <span className="min-w-0 break-all text-sm text-bone">{l.text}</span>
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <ContactForm />
        </div>
      </div>

      <div className="mt-20 overflow-hidden border-y border-line py-4" aria-hidden>
        <Marquee />
      </div>
      <footer className="gutter flex flex-wrap items-center justify-between gap-3 py-8 text-xs text-smoke">
        <span className="font-display text-lg text-bone">ROHITH R · <span className="text-xs tracking-[0.2em] text-cyan">AI/ML ENGINEER</span></span>
        <span>© {new Date().getFullYear()} Rohith R</span>
      </footer>
    </section>
  );
}
