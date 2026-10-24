import { useMemo, type CSSProperties } from 'react'

const TOKENS = ['{ }', '</>', 'git push', 'git commit', '{ }', '</>', 'git push', '#hacktoberfest']
const SQUARE_COLORS = ['bg-teal', 'bg-teal/60', 'bg-pink', 'bg-sun', 'bg-teal/30']

/** Small deterministic PRNG so decorations stay put between renders. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

export function Background() {
  const { squares, tokens } = useMemo(() => {
    const r = rng(2026)
    const squares = Array.from({ length: 18 }, (_, i) => ({
      left: `${r() * 100}%`,
      size: 10 + Math.round(r() * 18),
      color: SQUARE_COLORS[i % SQUARE_COLORS.length],
      dur: `${28 + r() * 30}s`,
      delay: `${-r() * 50}s`,
      rot: `${Math.round(r() * 180 - 90)}deg`,
      o: (0.18 + r() * 0.25).toFixed(2),
    }))
    const tokens = TOKENS.map((t, i) => ({
      text: t,
      left: `${5 + ((i * 12.5 + r() * 8) % 90)}%`,
      dur: `${40 + r() * 30}s`,
      delay: `${-r() * 60}s`,
      dx: `${Math.round(r() * 120 - 60)}px`,
    }))
    return { squares, tokens }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="bg-grid" />

      {/* Playful geometric brand shapes */}
      <div className="bob absolute -left-[6vw] top-[18vh] h-[22vw] w-[22vw] rounded-full border-[3px] border-pink/25" />
      <div className="absolute -right-[5vw] -top-[8vw] h-[20vw] w-[20vw] rounded-full bg-plum/25" />
      <div className="spin-slow absolute right-[7vw] top-[30vh] h-[5vw] w-[5vw] border-[3px] border-teal/25" />
      <div
        className="bob absolute bottom-[22vh] left-[9vw] h-0 w-0 border-x-[2.4vw] border-b-[4vw] border-x-transparent border-b-sun/20"
        style={{ animationDelay: '-4s' }}
      />
      <div className="absolute -bottom-[9vw] right-[18vw] h-[18vw] w-[18vw] rounded-full border-[3px] border-mist/10" />

      {/* Floating contribution squares */}
      {squares.map((s, i) => (
        <span
          key={i}
          className={`float-up absolute bottom-0 rounded-[3px] ${s.color}`}
          style={
            {
              left: s.left,
              width: s.size,
              height: s.size,
              '--dur': s.dur,
              '--delay': s.delay,
              '--rot': s.rot,
              '--o': s.o,
            } as CSSProperties
          }
        />
      ))}

      {/* Floating code tokens */}
      {tokens.map((t, i) => (
        <span
          key={`t${i}`}
          className="float-up absolute bottom-0 whitespace-nowrap font-mono text-[clamp(12px,1.1vw,22px)] font-bold text-mist"
          style={
            {
              left: t.left,
              '--dur': t.dur,
              '--delay': t.delay,
              '--dx': t.dx,
              '--o': '0.14',
            } as CSSProperties
          }
        >
          {t.text}
        </span>
      ))}

      {/* Vignette keeps the centre crisp for projector glare */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(23_15_30/0.85)_100%)]" />
    </div>
  )
}
