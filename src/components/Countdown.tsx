import { AnimatePresence, motion } from 'motion/react'
import { splitHMS } from '../lib/time'

export type Urgency = 'normal' | 'final' | 'critical'

interface CountdownProps {
  remainingMs: number
  totalMs: number
  urgency: Urgency
  paused: boolean
  /** Changes whenever a warning threshold is crossed → one soft pulse. */
  pulseKey: number
}

const digitColor: Record<Urgency, string> = {
  normal: 'text-mist',
  final: 'text-mist',
  critical: 'text-ember',
}
const accentColor: Record<Urgency, string> = {
  normal: 'text-pink',
  final: 'text-ember',
  critical: 'text-alarm',
}
const barColor: Record<Urgency, string> = {
  normal: 'bg-teal',
  final: 'bg-ember',
  critical: 'bg-alarm',
}

function Digit({ char }: { char: string }) {
  return (
    <span className="relative inline-block w-[1ch] overflow-hidden text-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: '-18%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '18%', opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="inline-block"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Group({ value, label, urgency }: { value: string; label: string; urgency: Urgency }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`flex ${digitColor[urgency]}`}>
        {value.split('').map((c, i) => (
          <Digit key={i} char={c} />
        ))}
      </div>
      <div
        className={`mt-[0.6vh] font-mono text-[clamp(12px,1.15vw,22px)] font-bold tracking-[0.45em] ${accentColor[urgency]}`}
      >
        {label}
      </div>
    </div>
  )
}

export function Countdown({ remainingMs, totalMs, urgency, paused, pulseKey }: CountdownProps) {
  const { h, m, s } = splitHMS(remainingMs)
  const progress = totalMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs)) : 0
  const sep = (
    <span className={`relative -top-[0.08em] px-[0.12em] ${accentColor[urgency]} ${paused ? 'opacity-40' : ''}`}>:</span>
  )

  return (
    <motion.div
      key={pulseKey}
      initial={pulseKey ? { scale: 1.035 } : false}
      animate={{ scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="relative flex flex-col items-center"
      role="timer"
      aria-live="off"
      aria-label={`${h} hours ${m} minutes ${s} seconds remaining`}
    >
      <div
        className={`tabular flex items-start font-mono font-extrabold leading-[0.9] tracking-[-0.02em] transition-opacity ${
          paused ? 'opacity-60' : ''
        }`}
        style={{ fontSize: 'min(15.5vw, 30vh)' }}
      >
        <Group value={h} label="HOURS" urgency={urgency} />
        {sep}
        <Group value={m} label="MINUTES" urgency={urgency} />
        {sep}
        <Group value={s} label="SECONDS" urgency={urgency} />
      </div>

      <div className="mt-[2.2vh] h-[clamp(6px,0.9vh,10px)] w-[min(70vw,1300px)] overflow-hidden rounded-full bg-mist/10">
        <div
          className={`h-full origin-left rounded-full ${barColor[urgency]} transition-transform duration-1000 ease-linear`}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </motion.div>
  )
}
