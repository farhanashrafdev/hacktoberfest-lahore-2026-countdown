import { STATUS_LABELS, type StatusKey } from '../lib/defaults'

const styles: Record<StatusKey, { dot: string; ring: string }> = {
  ready: { dot: 'bg-sun', ring: 'border-sun/70 text-sun' },
  hacking: { dot: 'bg-teal', ring: 'border-teal/70 text-teal' },
  closing: { dot: 'bg-ember', ring: 'border-ember/80 text-ember' },
  demo: { dot: 'bg-pink', ring: 'border-pink/80 text-pink' },
  break: { dot: 'bg-sun', ring: 'border-sun/70 text-sun' },
  complete: { dot: 'bg-pink', ring: 'border-pink/80 text-pink' },
}

export function StatusPill({ status, paused }: { status: StatusKey; paused?: boolean }) {
  const st = styles[status]
  return (
    <div
      className={`inline-flex items-center gap-[0.7em] rounded-full border-2 bg-void/70 px-[1.1em] py-[0.45em] font-mono text-[clamp(13px,1.15vw,22px)] font-bold tracking-[0.18em] ${st.ring}`}
    >
      <span className={`h-[0.7em] w-[0.7em] rounded-full ${st.dot} ${paused ? '' : 'live-dot'}`} />
      {STATUS_LABELS[status]}
      {paused && <span className="text-mist/70">· PAUSED</span>}
    </div>
  )
}
