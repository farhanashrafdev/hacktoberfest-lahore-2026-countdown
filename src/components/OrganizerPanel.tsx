import { motion } from 'motion/react'
import {
  Coffee,
  Maximize,
  Minus,
  Pause,
  Play,
  PartyPopper,
  Plus,
  Presentation,
  RotateCcw,
  Timer as TimerIcon,
  Trophy,
  Undo2,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { MINUTE, STATUS_LABELS, type Mode, type Settings, type StatusKey } from '../lib/defaults'
import { msToHoursMinutes, splitHMS, toDatetimeLocal } from '../lib/time'
import type { Timer } from '../hooks/useTimer'

interface Props {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  timer: Timer
  onReset: () => void
  onRestoreDefaults: () => void
  onFullscreen: () => void
  onTestCelebration: () => void
  onClose: () => void
}

const MODES: { value: Mode; label: string; icon: ReactNode }[] = [
  { value: 'auto', label: 'Auto', icon: <Zap size={15} /> },
  { value: 'hacking', label: 'Hacking', icon: <TimerIcon size={15} /> },
  { value: 'demo', label: 'Demo', icon: <Presentation size={15} /> },
  { value: 'break', label: 'Break', icon: <Coffee size={15} /> },
  { value: 'complete', label: 'Complete', icon: <Trophy size={15} /> },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-mist/10 py-4">
      <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-pink">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Label({ text, children }: { text: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-mist/60">{text}</span>
      {children}
    </label>
  )
}

export function OrganizerPanel({
  settings,
  update,
  timer,
  onReset,
  onRestoreDefaults,
  onFullscreen,
  onTestCelebration,
  onClose,
}: Props) {
  const initial = msToHoursMinutes(settings.durationMs)
  const [hours, setHours] = useState(String(initial.hours))
  const [minutes, setMinutes] = useState(String(initial.minutes))
  const [target, setTarget] = useState(() => toDatetimeLocal(Date.now() + settings.durationMs))
  const [note, setNote] = useState('')

  const { h, m, s } = splitHMS(timer.remainingMs)

  const applyDuration = () => {
    const ms = (Math.max(0, Number(hours) || 0) * 60 + Math.max(0, Number(minutes) || 0)) * MINUTE
    if (ms <= 0) return setNote('Duration must be greater than zero.')
    if (timer.status === 'running' && !window.confirm('The timer is running. Replace it with the new duration?')) return
    update({ durationMs: ms })
    timer.reset(ms)
    setNote('Duration applied — press Start (or Space) to begin.')
  }

  const applyTarget = () => {
    const ms = new Date(target).getTime()
    if (Number.isNaN(ms)) return setNote('Pick a valid date & time.')
    if (timer.status === 'running' && !window.confirm('The timer is running. Count down to this new time instead?')) return
    setNote(timer.setTarget(ms) ? 'Counting down to the target time.' : 'Target time must be in the future.')
  }

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="absolute right-0 top-0 z-40 flex h-full w-[min(440px,100vw)] flex-col border-l-2 border-pink/40 bg-void/97 text-sm shadow-2xl"
      role="dialog"
      aria-label="Organizer panel"
    >
      <div className="flex items-center justify-between border-b border-mist/10 px-5 py-4">
        <div>
          <div className="font-display text-lg font-bold">Organizer panel</div>
          <div className="font-mono text-xs text-mist/50">Press O or Esc to close</div>
        </div>
        <button className="btn" onClick={onClose} aria-label="Close panel">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <Section title="Timer">
          <div className="flex items-center justify-between rounded-lg bg-ink px-4 py-3">
            <span className="tabular font-mono text-2xl font-bold">
              {h}:{m}:{s}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-teal">{timer.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {timer.status === 'running' ? (
              <button className="btn btn-primary" onClick={timer.pause}>
                <Pause size={15} /> Pause
              </button>
            ) : (
              <button className="btn btn-primary" onClick={timer.start} disabled={timer.status === 'finished'}>
                <Play size={15} /> {timer.status === 'paused' ? 'Resume' : 'Start'}
              </button>
            )}
            <button className="btn" onClick={onReset}>
              <RotateCcw size={15} /> Reset
            </button>
            <button className="btn" onClick={() => timer.adjust(-5 * MINUTE)}>
              <Minus size={15} /> 5 min
            </button>
            <button className="btn" onClick={() => timer.adjust(5 * MINUTE)}>
              <Plus size={15} /> 5 min
            </button>
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
            <Label text="Hours">
              <input className="field" type="number" min={0} max={48} value={hours} onChange={(e) => setHours(e.target.value)} />
            </Label>
            <Label text="Minutes">
              <input className="field" type="number" min={0} max={59} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </Label>
            <button className="btn" onClick={applyDuration}>
              Set
            </button>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-2">
            <Label text="Or count down to exact time">
              <input className="field" type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
            </Label>
            <button className="btn" onClick={applyTarget}>
              Go
            </button>
          </div>
          {note && <p className="text-xs text-sun">{note}</p>}
        </Section>

        <Section title="Screen mode">
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((mo) => (
              <button
                key={mo.value}
                className={`btn ${settings.mode === mo.value ? 'btn-active' : ''}`}
                onClick={() => update({ mode: mo.value })}
              >
                {mo.icon} {mo.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-mist/50">
            Auto shows the countdown and switches to the celebration when it hits zero. Hacking always shows the countdown.
          </p>
          <Label text="Status pill">
            <select
              className="field"
              value={settings.statusOverride}
              onChange={(e) => update({ statusOverride: e.target.value as StatusKey | 'auto' })}
            >
              <option value="auto">Auto (derived from timer & mode)</option>
              {(Object.keys(STATUS_LABELS) as StatusKey[]).map((k) => (
                <option key={k} value={k}>
                  {STATUS_LABELS[k]}
                </option>
              ))}
            </select>
          </Label>
        </Section>

        <Section title="Break screen">
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <Label text="Back at">
              <input className="field" type="time" value={settings.breakReturn} onChange={(e) => update({ breakReturn: e.target.value })} />
            </Label>
            <Label text="Message">
              <input className="field" value={settings.breakMessage} onChange={(e) => update({ breakMessage: e.target.value })} />
            </Label>
          </div>
        </Section>

        <Section title="Event schedule">
          <div className="grid grid-cols-2 gap-2">
            <Label text="Doors open">
              <input className="field" type="time" value={settings.scheduleStart} onChange={(e) => update({ scheduleStart: e.target.value })} />
            </Label>
            <Label text="Event ends">
              <input className="field" type="time" value={settings.scheduleEnd} onChange={(e) => update({ scheduleEnd: e.target.value })} />
            </Label>
          </div>
        </Section>

        <Section title="Content">
          <Label text="Rotating messages (one per line, `code` allowed)">
            <textarea
              className="field min-h-40 font-mono text-xs"
              value={settings.messages.join('\n')}
              onChange={(e) => update({ messages: e.target.value.split('\n') })}
            />
          </Label>
          <Label text="Challenge ticker (one per line)">
            <textarea
              className="field min-h-20 font-mono text-xs"
              value={settings.ticker.join('\n')}
              onChange={(e) => update({ ticker: e.target.value.split('\n') })}
            />
          </Label>
          <Label text="Attendee hub URL (QR code, hidden if empty)">
            <input
              className="field"
              type="url"
              placeholder="https://…"
              value={settings.hubUrl}
              onChange={(e) => update({ hubUrl: e.target.value.trim() })}
            />
          </Label>
        </Section>

        <Section title="Display">
          <div className="grid grid-cols-2 gap-2">
            <button className={`btn ${settings.sound ? 'btn-active' : ''}`} onClick={() => update({ sound: !settings.sound })}>
              {settings.sound ? <Volume2 size={15} /> : <VolumeX size={15} />} Sound {settings.sound ? 'on' : 'off'}
            </button>
            <button
              className={`btn ${settings.animations ? 'btn-active' : ''}`}
              onClick={() => update({ animations: !settings.animations })}
            >
              <Sparkles size={15} /> Animations {settings.animations ? 'on' : 'off'}
            </button>
            <button className="btn" onClick={onFullscreen}>
              <Maximize size={15} /> Fullscreen
            </button>
            <button className="btn" onClick={onTestCelebration}>
              <PartyPopper size={15} /> Test celebration
            </button>
          </div>
          <button className="btn w-full" onClick={onRestoreDefaults}>
            <Undo2 size={15} /> Restore default settings
          </button>
        </Section>

        <Section title="Shortcuts">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs text-mist/70">
            <li>Space · start / pause</li>
            <li>F · fullscreen</li>
            <li>O · this panel</li>
            <li>Esc · close</li>
            <li>D · demo</li>
            <li>B · break</li>
            <li>H · hacking (auto)</li>
            <li>R · reset</li>
          </ul>
        </Section>
      </div>
    </motion.aside>
  )
}
