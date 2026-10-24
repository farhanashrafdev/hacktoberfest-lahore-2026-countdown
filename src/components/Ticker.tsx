export function Ticker({ items }: { items: string[] }) {
  const list = items.filter((t) => t.trim())
  if (!list.length) return null
  const row = (
    <div className="flex shrink-0 items-center">
      {list.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-[1.6vw]">{t}</span>
          <span className="inline-block h-[0.55em] w-[0.55em] rotate-45 bg-pink" aria-hidden />
        </span>
      ))}
    </div>
  )
  // Repeat enough copies so the strip is always wider than the screen.
  const copies = Math.max(2, Math.ceil(8 / list.length))
  return (
    <div className="relative flex min-w-0 flex-1 items-center overflow-hidden rounded-full border-2 border-mist/15 bg-ink/80 py-[0.7vh]">
      <span className="z-10 shrink-0 rounded-full bg-sun px-[1em] py-[0.25em] font-mono text-[clamp(10px,0.8vw,16px)] font-bold tracking-[0.2em] text-void ml-[0.5vw]">
        CHALLENGES
      </span>
      <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
        <div
          className="marquee flex w-max font-mono text-[clamp(12px,1.05vw,21px)] font-bold tracking-[0.12em] text-mist"
          style={{ ['--marquee-dur' as string]: `${copies * list.length * 5}s` }}
        >
          {Array.from({ length: copies }, (_, i) => (
            <div key={i} className="flex">{row}</div>
          ))}
          {Array.from({ length: copies }, (_, i) => (
            <div key={`b${i}`} className="flex" aria-hidden>
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
