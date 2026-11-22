import { useState, type ChangeEvent, type FormEvent } from 'react';
import { profile } from '../data/portfolio';

type F = { n: string; e: string; s: string; m: string };
const FIELDS: { k: keyof F; label: string; type?: string }[] = [
  { k: 'n', label: 'Name' },
  { k: 'e', label: 'Email', type: 'email' },
  { k: 's', label: 'Subject' },
];

/**
 * Validated contact form. Messages are delivered straight to profile.email through FormSubmit
 * (no server of your own needed). If the network request fails, it falls back to the visitor's email app.
 */
export default function ContactForm() {
  const [f, setF] = useState<F>({ n: '', e: '', s: '', m: '' });
  const [err, setErr] = useState<Partial<F>>({});
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const set = (k: keyof F) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: ev.target.value }));

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (sending) return;
    const er: Partial<F> = {};
    if (!f.n.trim()) er.n = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.e.trim())) er.e = 'Enter a valid email address.';
    if (!f.s.trim()) er.s = 'Add a subject.';
    if (f.m.trim().length < 10) er.m = 'Write at least 10 characters.';
    setErr(er);
    if (Object.keys(er).length) {
      setNote('');
      return;
    }
    setSending(true);
    setNote('Sending your message…');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: f.n.trim(),
          email: f.e.trim(),
          message: f.m.trim(),
          _subject: `Portfolio: ${f.s.trim()}`,
          _replyto: f.e.trim(),
          _template: 'table',
          _captcha: 'false',
          _honey: '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === 'false' || data.success === false) throw new Error('send failed');
      setF({ n: '', e: '', s: '', m: '' });
      setNote('Thank you! Your message has been sent. I will reply soon.');
    } catch {
      // fallback so a message is never lost
      const body = `${f.m.trim()}\n\n${f.n.trim()} (${f.e.trim()})`;
      window.location.assign(`mailto:${profile.email}?subject=${encodeURIComponent(f.s.trim())}&body=${encodeURIComponent(body)}`);
      setNote('Could not send directly, so your email app is opening with the message ready.');
    } finally {
      setSending(false);
    }
  };

  const input = 'w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-azure-2 focus:outline-none';
  return (
    <form onSubmit={submit} noValidate className="glass relative mx-auto mt-12 grid w-full max-w-xl gap-3 rounded-3xl p-5 text-left sm:p-7" aria-label="Contact form">
      <h3 className="font-display text-3xl text-bone">Send a message</h3>
      {FIELDS.map((x) => (
        <div key={x.k}>
          <input className={input} type={x.type ?? 'text'} placeholder={x.label} aria-label={x.label} aria-invalid={!!err[x.k]} value={f[x.k]} onChange={set(x.k)} />
          {err[x.k] && <p role="alert" className="mt-1 text-xs text-azure-2">{err[x.k]}</p>}
        </div>
      ))}
      <div>
        <textarea className={input} rows={4} placeholder="Message" aria-label="Message" aria-invalid={!!err.m} value={f.m} onChange={set('m')} />
        {err.m && <p role="alert" className="mt-1 text-xs text-azure-2">{err.m}</p>}
      </div>
      <button type="submit" disabled={sending} className="disabled:opacity-60 justify-self-start rounded-full bg-azure px-7 py-3 text-sm font-bold tracking-[0.1em] text-white shadow-[0_0_40px_rgba(47,107,255,0.45)] transition hover:bg-azure-2">
        {sending ? 'SENDING…' : 'SEND MESSAGE'}
      </button>
      {note && <p className="text-xs text-mist" role="status">{note}</p>}
    </form>
  );
}

const TERMS = ['Computer vision', 'Deep learning', 'Data pipelines', 'Docker deployment', 'Full-stack apps', 'Offline-first PWAs'];

export function Marquee() {
  const row = [...TERMS, ...TERMS].map((t, i) => (
    <span key={i} className="mx-5 font-display text-3xl text-white/25 sm:text-5xl">
      {t} <span className="text-azure-2/60">·</span>
    </span>
  ));
  return (
    <div aria-hidden className="relative mt-14 w-full overflow-hidden">
      <div className="marquee">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
}
