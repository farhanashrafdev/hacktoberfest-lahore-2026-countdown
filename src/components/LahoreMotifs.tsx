import { EVENT } from '../lib/defaults'

function onion(cx: number, y: number, w: number, h: number) {
  return `M${cx - w / 2},${y} C${cx - w / 2},${y - h * 0.62} ${cx - w * 0.12},${y - h * 0.72} ${cx},${y - h} C${cx + w * 0.12},${y - h * 0.72} ${cx + w / 2},${y - h * 0.62} ${cx + w / 2},${y}`
}

function minaret(x: number, base: number, top: number, w: number) {
  return (
    <g>
      <path d={`M${x - w / 2},${base} L${x - w / 2},${top} L${x + w / 2},${top} L${x + w / 2},${base}`} />
      <path d={`M${x - w * 0.8},${top} L${x + w * 0.8},${top}`} />
      <path d={`M${x - w * 0.75},${top + (base - top) * 0.35} L${x + w * 0.75},${top + (base - top) * 0.35}`} />
      <path d={`M${x - w * 0.75},${top + (base - top) * 0.65} L${x + w * 0.75},${top + (base - top) * 0.65}`} />
      <path d={onion(x, top, w * 1.3, w * 1.6)} />
    </g>
  )
}

/** Minimal line-art skyline: Minar-e-Pakistan + Badshahi Mosque. */
function Skyline() {
  return (
    <svg
      viewBox="0 0 1600 260"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMax meet"
    >
      <path d="M0,258 L1600,258" />
      {/* Minar-e-Pakistan */}
      <g>
        <path d="M300,258 L300,240 L520,240 L520,258" />
        <path d="M330,240 L330,222 L490,222 L490,240" />
        <path d="M360,222 C380,200 395,190 400,170 M460,222 C440,200 425,190 420,170" />
        <path d="M400,170 L392,40 M420,170 L428,40" />
        <path d="M388,40 L432,40 M392,100 L428,100 M396,140 L424,140" />
        <path d={onion(410, 40, 28, 26)} />
        <path d="M410,14 L410,4" />
      </g>
      {/* Badshahi Mosque */}
      <g>
        <path d="M940,258 L940,190 L1360,190 L1360,258" />
        <path d="M1110,258 L1110,215 C1110,198 1190,198 1190,215 L1190,258" />
        <path d="M1090,190 L1090,165 L1210,165 L1210,190" />
        <path d={onion(1150, 165, 110, 95)} />
        <path d="M1150,70 L1150,56" />
        <path d={onion(1040, 190, 70, 62)} />
        <path d="M1040,128 L1040,118" />
        <path d={onion(1260, 190, 70, 62)} />
        <path d="M1260,128 L1260,118" />
        {minaret(905, 258, 80, 22)}
        {minaret(1395, 258, 80, 22)}
      </g>
    </svg>
  )
}

/** Eight-point star tile inspired by Mughal geometric jaali work. */
function Girih({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="20" y="20" width="60" height="60" />
      <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="12" />
      <path d="M50,8 L50,92 M8,50 L92,50" opacity=".5" />
    </svg>
  )
}

export function LahoreMotifs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 bottom-[9vh] mx-auto h-[19vh] max-w-[1500px] text-mist opacity-[0.09]">
        <Skyline />
      </div>

      <Girih className="spin-slow absolute -left-[3vw] bottom-[-3vw] h-[12vw] w-[12vw] text-pink opacity-[0.12]" />
      <Girih className="absolute right-[2.5vw] top-[16vh] h-[4vw] w-[4vw] text-sun opacity-[0.18]" />

      <div className="absolute left-[1vw] top-1/2 -translate-y-1/2">
        <div className="rotate-180 whitespace-nowrap font-mono text-[clamp(9px,0.7vw,14px)] tracking-[0.3em] text-mist/40 [writing-mode:vertical-rl]">
          <span className="text-pink/70">LAHORE / PK</span> &nbsp;{EVENT.coords}
        </div>
      </div>

      <div className="absolute right-[1vw] top-1/2 -translate-y-1/2">
        <div className="shipping-blink whitespace-nowrap [writing-mode:vertical-rl] font-display text-[clamp(10px,0.85vw,17px)] font-bold tracking-[0.4em] text-teal/60">
          LAHORE IS SHIPPING ●
        </div>
      </div>
    </div>
  )
}
