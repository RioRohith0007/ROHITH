import { skillCategories } from '../data/portfolio';

const all = skillCategories.flatMap((c) => c.skills.map((s) => s.name));
const rowA = all.filter((_, i) => i % 2 === 0);
const rowB = all.filter((_, i) => i % 2 === 1);

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-wrap overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className={`marquee ${reverse ? 'marquee-rev' : ''} gap-3`} style={{ animationDuration: reverse ? '44s' : '38s' }}>
        {loop.map((t, i) => (
          <span key={`${t}-${i}`} className="chip-glide shrink-0 rounded-full border border-line bg-ink-3/60 px-5 py-2 text-sm font-semibold tracking-wide text-mist">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two slow tickers of the tech stack, running in opposite directions. */
export default function TechMarquee() {
  return (
    <div aria-hidden className="relative z-[var(--z-card)] -mt-6 pb-4 sm:-mt-10">
      <Row items={rowA} />
      <Row items={rowB} reverse />
    </div>
  );
}
