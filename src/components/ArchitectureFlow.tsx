import { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FLOW_H, FLOW_W, NODE_H, NODE_W, type FlowEdge, type FlowNode } from '../data/projectDetails';

type Pt = { x: number; y: number };

/** Edge path between two node boxes, leaving from the side or the top/bottom that faces the target. */
function edgePath(a: FlowNode, b: FlowNode): { d: string; from: Pt; to: Pt } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let from: Pt;
  let to: Pt;
  let d: string;
  if (Math.abs(dx) >= Math.abs(dy) * 0.9 && Math.abs(dx) > NODE_W * 0.6) {
    const s = dx > 0 ? 1 : -1;
    from = { x: a.x + (s * NODE_W) / 2, y: a.y };
    to = { x: b.x - (s * NODE_W) / 2, y: b.y };
    const mx = (from.x + to.x) / 2;
    d = `M${from.x} ${from.y} C${mx} ${from.y} ${mx} ${to.y} ${to.x} ${to.y}`;
  } else {
    const s = dy > 0 ? 1 : -1;
    from = { x: a.x, y: a.y + (s * NODE_H) / 2 };
    to = { x: b.x, y: b.y - (s * NODE_H) / 2 };
    const my = (from.y + to.y) / 2;
    d = `M${from.x} ${from.y} C${from.x} ${my} ${to.x} ${my} ${to.x} ${to.y}`;
  }
  return { d, from, to };
}

/**
 * Interactive architecture diagram. Hover or focus a component to highlight its connections,
 * click (or press Enter/Space) to inspect it. Packets travel along every connection to show data flow.
 */
export default function ArchitectureFlow({ nodes, edges }: { nodes: FlowNode[]; edges: FlowEdge[] }) {
  const [selected, setSelected] = useState(nodes[0].id);
  const [hover, setHover] = useState<string | null>(null);
  const uid = useId().replace(/:/g, '');
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const focus = hover ?? selected;
  const active = byId[selected];
  const paths = useMemo(() => edges.map(([a, b]) => ({ a, b, ...edgePath(byId[a], byId[b]) })), [edges, byId]);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="overflow-x-auto overscroll-x-contain p-3 [scrollbar-width:thin]" tabIndex={0} role="region" aria-label="Architecture diagram, scrolls sideways on small screens">
        <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`} className="block h-auto w-full min-w-[760px]" role="group" aria-label="System architecture">
          <defs>
            <marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="#56D8FF" />
            </marker>
          </defs>
          {paths.map((p, i) => {
            const on = focus === p.a || focus === p.b;
            return (
              <g key={p.a + p.b}>
                <path d={p.d} fill="none" className="flow-edge" stroke={on ? '#56D8FF' : 'rgba(54,139,255,0.4)'} strokeWidth={on ? 2.4 : 1.4} markerEnd={on ? `url(#arrow-${uid})` : undefined} style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }} />
                <circle r={on ? 5 : 3.5} fill="#56D8FF" className="flow-packet" opacity={on ? 1 : 0.55}>
                  <animateMotion dur={`${2.6 + (i % 3) * 0.4}s`} begin={`${(i * 0.45).toFixed(2)}s`} repeatCount="indefinite" path={p.d} />
                </circle>
              </g>
            );
          })}
          {nodes.map((n) => {
            const isSel = selected === n.id;
            const isFocus = focus === n.id || paths.some((p) => (p.a === focus && p.b === n.id) || (p.b === focus && p.a === n.id));
            return (
              <g
                key={n.id}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${n.label}. ${n.detail}`}
                className="cursor-pointer outline-none"
                onClick={() => setSelected(n.id)}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(n.id);
                  }
                }}
              >
                <rect x={n.x - NODE_W / 2} y={n.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={12} fill={isSel ? '#1769FF' : '#071426'} stroke={isSel ? '#56D8FF' : isFocus ? '#368BFF' : 'rgba(80,145,255,0.35)'} strokeWidth={isSel ? 2 : 1.2} style={{ transition: 'fill 0.25s, stroke 0.25s' }} />
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={600} fill="#F5F7FF" fontFamily="Inter, system-ui, sans-serif">
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="border-t border-line p-5" aria-live="polite">
        <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="font-display text-2xl text-bone">{active.label}</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-mist">{active.detail}</p>
        </motion.div>
        <p className="mt-3 text-[11px] tracking-[0.18em] text-smoke">CLICK A COMPONENT TO INSPECT IT · SCROLL SIDEWAYS ON SMALL SCREENS</p>
      </div>
    </div>
  );
}
