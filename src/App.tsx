import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Settings as SettingsIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Background } from './components/Background'
import { BreakScreen } from './components/BreakScreen'
import { Celebration } from './components/Celebration'
import { Countdown, type Urgency } from './components/Countdown'
import { DemoScreen } from './components/DemoScreen'
import { Header } from './components/Header'
import { LahoreMotifs } from './components/LahoreMotifs'
import { MessageRotator } from './components/MessageRotator'
import { OrganizerPanel } from './components/OrganizerPanel'
import { StatusPill } from './components/StatusPill'
import { Ticker } from './components/Ticker'
import { useIdle } from './hooks/useIdle'
import { useKeyboard } from './hooks/useKeyboard'
import { usePersistentState } from './hooks/usePersistentState'
import { useTimer } from './hooks/useTimer'
import {
  DEFAULT_SETTINGS,
  EVENT,
  FINAL_PUSH_MS,
  LAST_COMMIT_MS,
  MINUTE,
  STORAGE_KEYS,
  WARNING_MINUTES,
  type Mode,
  type Settings,
  type StatusKey,
} from './lib/defaults'
import { playChime, playFanfare } from './lib/sound'
import { formatClock } from './lib/time'

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen()
  else void document.documentElement.requestFullscreen?.().catch(() => {})
}

export default function App() {
  const [settings, setSettings] = usePersistentState<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), [setSettings])
  const timer = useTimer(settings.durationMs)

  const [panelOpen, setPanelOpen] = useState(false)
  const [testCelebration, setTestCelebration] = useState(false)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const [pulseKey, setPulseKey] = useState(0)
  const idle = useIdle(2500)

  const { status, remainingMs } = timer
  const active = status === 'running' || status === 'paused'
  const urgency: Urgency =
    active && remainingMs <= LAST_COMMIT_MS ? 'critical' : active && remainingMs <= FINAL_PUSH_MS ? 'final' : 'normal'

  const view: Exclude<Mode, 'auto'> =
    settings.mode === 'auto' ? (status === 'finished' ? 'complete' : 'hacking') : settings.mode
  const celebrating = view === 'complete' || testCelebration

  const derivedStatus: StatusKey =
    view === 'demo'
      ? 'demo'
      : view === 'break'
        ? 'break'
        : view === 'complete' || status === 'finished'
          ? 'complete'
          : status === 'idle'
            ? 'ready'
            : urgency !== 'normal'
              ? 'closing'
              : 'hacking'
  const pillStatus = settings.statusOverride === 'auto' ? derivedStatus : settings.statusOverride

  // ---- warnings at 30 / 15 / 10 / 5 minutes (only on live crossings, not on reload)
  const prevRemaining = useRef<number | null>(null)
  useEffect(() => {
    const prev = prevRemaining.current
    prevRemaining.current = status === 'running' ? remainingMs : null
    if (prev == null || status !== 'running') return
    const crossed = WARNING_MINUTES.find((min) => prev > min * MINUTE && remainingMs <= min * MINUTE)
    if (crossed == null) return
    setToast({ id: Date.now(), text: `${crossed} MINUTES LEFT` })
    setPulseKey((k) => k + 1)
    if (settings.sound) playChime()
  }, [remainingMs, status, settings.sound])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 6000)
    return () => window.clearTimeout(id)
  }, [toast])

  // ---- completion sound when the celebration appears
  const wasCelebrating = useRef(celebrating)
  useEffect(() => {
    if (celebrating && !wasCelebrating.current && settings.sound) playFanfare()
    wasCelebrating.current = celebrating
  }, [celebrating, settings.sound])

  useEffect(() => {
    if (!testCelebration) return
    const id = window.setTimeout(() => setTestCelebration(false), 12000)
    return () => window.clearTimeout(id)
  }, [testCelebration])

  const confirmReset = useCallback(() => {
    if (window.confirm('Reset the countdown? This cannot be undone.')) timer.reset(settings.durationMs)
  }, [timer, settings.durationMs])

  const restoreDefaults = useCallback(() => {
    if (window.confirm('Restore all organizer settings to their defaults? (The timer keeps running.)')) {
      setSettings(DEFAULT_SETTINGS)
    }
  }, [setSettings])

  const toggleMode = (mode: Mode) => update({ mode: settings.mode === mode ? 'auto' : mode })

  useKeyboard({
    ' ': () => timer.toggle(),
    f: toggleFullscreen,
    o: () => setPanelOpen((o) => !o),
    escape: () => {
      setPanelOpen(false)
      setTestCelebration(false)
    },
    d: () => toggleMode('demo'),
    b: () => toggleMode('break'),
    h: () => update({ mode: 'auto' }),
    r: confirmReset,
  })

  const headline =
    status === 'finished'
      ? "TIME'S UP. KEYBOARDS DOWN."
      : urgency === 'critical'
        ? 'ONE LAST COMMIT.'
        : urgency === 'final'
          ? 'FINAL PUSH, LAHORE.'
          : status === 'idle'
            ? 'THE HACK STARTS SOON.'
            : 'THE HACK IS ON.'
  const headlineColor = urgency === 'critical' ? 'text-alarm' : urgency === 'final' ? 'text-ember' : 'text-pink'

  const hideCursor = idle && !panelOpen

  return (
    <MotionConfig reducedMotion={settings.animations ? 'user' : 'always'}>
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden bg-void ${settings.animations ? '' : 'no-anim'} ${
          hideCursor ? 'cursor-hidden' : ''
        }`}
      >
        <Background />
        <LahoreMotifs />
        {urgency !== 'normal' && (
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
              urgency === 'critical'
                ? 'bg-[radial-gradient(ellipse_at_center,rgb(255_90_77/0.16),transparent_65%)]'
                : 'bg-[radial-gradient(ellipse_at_center,rgb(255_139_61/0.12),transparent_65%)]'
            }`}
            aria-hidden
          />
        )}

        <Header />

        <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {view === 'demo' ? (
              <DemoScreen key="demo" />
            ) : view === 'break' ? (
              <BreakScreen key="break" returnAt={settings.breakReturn} message={settings.breakMessage} />
            ) : (
              <motion.div
                key="hacking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex w-full flex-col items-center"
              >
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={headline}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    className={`mb-[1.2vh] font-display text-[clamp(22px,3vw,60px)] font-bold uppercase tracking-tight ${headlineColor}`}
                  >
                    {headline}
                  </motion.h2>
                </AnimatePresence>

                <Countdown
                  remainingMs={remainingMs}
                  totalMs={timer.totalMs}
                  urgency={urgency}
                  paused={status === 'paused'}
                  pulseKey={pulseKey}
                />

                <div className="mt-[2.6vh] flex items-center gap-[2vw]">
                  <span className="font-display text-[clamp(16px,1.9vw,38px)] font-bold tracking-tight text-mist">
                    BUILD. BREAK. FIX. <span className="text-teal">SHIP.</span>
                  </span>
                  <StatusPill status={pillStatus} paused={status === 'paused'} />
                </div>

                <div className="mt-[2.4vh] w-full px-[4vw]">
                  <MessageRotator messages={settings.messages} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {view !== 'hacking' && settings.statusOverride !== 'auto' && (
            <div className="mt-[3vh]">
              <StatusPill status={pillStatus} />
            </div>
          )}
        </main>

        <footer className="relative z-10 flex items-end gap-[2vw] px-[3vw] pb-[2.6vh]">
          <div className="shrink-0">
            <div className="font-display text-[clamp(20px,2.2vw,44px)] font-bold leading-none tracking-tight">
              <span className="bg-sun px-[0.25em] text-void">AI</span> FOR EVERYONE
            </div>
            <div className="mt-[0.8vh] font-mono text-[clamp(10px,0.85vw,17px)] tracking-wider text-mist/75">{EVENT.date}</div>
            <div className="mt-[0.3vh] font-mono text-[clamp(9px,0.7vw,14px)] tracking-wider text-mist/45">
              EVENT {formatClock(settings.scheduleStart)} – {formatClock(settings.scheduleEnd)} · NOW{' '}
              {new Date(timer.now).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
          </div>
          <Ticker items={settings.ticker} />
          {settings.hubUrl && (
            <div className="flex shrink-0 flex-col items-center gap-[0.5vh]">
              <QRCodeSVG
                value={settings.hubUrl}
                bgColor="#efedef"
                fgColor="#170f1e"
                marginSize={2}
                className="rounded-md"
                style={{ width: 'clamp(64px, 10.5vh, 120px)', height: 'clamp(64px, 10.5vh, 120px)' }}
              />
              <span className="font-mono text-[clamp(8px,0.6vw,12px)] tracking-[0.25em] text-mist/60">ATTENDEE HUB</span>
            </div>
          )}
        </footer>

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-1/2 top-[3vh] z-20 -translate-x-1/2 rounded-full border-2 border-ember bg-void/90 px-[1.6em] py-[0.5em] font-mono text-[clamp(14px,1.5vw,30px)] font-bold tracking-[0.2em] text-ember"
              role="status"
            >
              ⏱ {toast.text}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {celebrating && (
            <Celebration key="celebration" animations={settings.animations} onClose={() => setTestCelebration(false)} />
          )}
        </AnimatePresence>

        <button
          onClick={() => setPanelOpen((o) => !o)}
          aria-label="Open organizer panel"
          className={`absolute bottom-[1.2vh] right-[0.8vw] z-30 rounded-full p-2 text-mist transition-opacity duration-500 hover:opacity-90 ${
            idle || panelOpen ? 'pointer-events-none opacity-0' : 'opacity-30'
          }`}
        >
          <SettingsIcon size={20} />
        </button>

        <AnimatePresence>
          {panelOpen && (
            <OrganizerPanel
              key="panel"
              settings={settings}
              update={update}
              timer={timer}
              onReset={confirmReset}
              onRestoreDefaults={restoreDefaults}
              onFullscreen={toggleFullscreen}
              onTestCelebration={() => {
                setTestCelebration(true)
                setPanelOpen(false)
              }}
              onClose={() => setPanelOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
