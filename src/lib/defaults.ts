export type Mode = 'auto' | 'hacking' | 'demo' | 'break' | 'complete'

export type StatusKey =
  | 'ready'
  | 'hacking'
  | 'closing'
  | 'demo'
  | 'break'
  | 'complete'

export const STATUS_LABELS: Record<StatusKey, string> = {
  ready: 'GET READY TO HACK',
  hacking: 'HACKING IN PROGRESS',
  closing: 'SUBMISSIONS CLOSING SOON',
  demo: 'DEMO TIME',
  break: 'ON A BREAK',
  complete: 'HACK DAY COMPLETE',
}

export interface Settings {
  durationMs: number
  messages: string[]
  ticker: string[]
  hubUrl: string
  breakReturn: string
  breakMessage: string
  scheduleStart: string
  scheduleEnd: string
  sound: boolean
  animations: boolean
  mode: Mode
  statusOverride: StatusKey | 'auto'
}

export const HOUR = 60 * 60 * 1000
export const MINUTE = 60 * 1000

export const MESSAGE_INTERVAL_MS = 25_000
export const WARNING_MINUTES = [30, 15, 10, 5] as const
export const FINAL_PUSH_MS = 30 * MINUTE
export const LAST_COMMIT_MS = 5 * MINUTE

export const DEFAULT_MESSAGES = [
  "LAHORE, LET'S SHIP SOMETHING.",
  '`git commit -m "made history"`',
  'YOUR NEXT PR COULD GO GLOBAL.',
  'LESS SCROLLING. MORE BUILDING.',
  'NO BUGS, JUST UNDOCUMENTED FEATURES.',
  'BUILT IN LAHORE. OPEN TO THE WORLD.',
  "CTRL + S WON'T SAVE YOUR DEADLINE.",
  'OPEN SOURCE IS THE MAIN CHARACTER.',
  'PUSH CODE, NOT EXCUSES.',
]

export const DEFAULT_TICKER = [
  'BEST OPEN-SOURCE AI PROJECT',
  'GOOGLE GEMMA',
  'BEST USE OF DNOTIFIER',
]

export const DEFAULT_SETTINGS: Settings = {
  durationMs: 6 * HOUR,
  messages: DEFAULT_MESSAGES,
  ticker: DEFAULT_TICKER,
  hubUrl: '',
  breakReturn: '13:30',
  breakMessage: 'GRAB FOOD. HYDRATE. WE RESUME SOON.',
  scheduleStart: '10:00',
  scheduleEnd: '18:00',
  sound: true,
  animations: true,
  mode: 'auto',
  statusOverride: 'auto',
}

export const STORAGE_KEYS = {
  settings: 'hfl26.settings.v1',
  timer: 'hfl26.timer.v1',
} as const

export const EVENT = {
  name: 'Hacktoberfest',
  title: 'HACK DAY',
  city: 'LAHORE 2026',
  tagline: 'AI FOR EVERYONE',
  date: 'October 24, 2026 • Lahore, Pakistan',
  coords: '31.5204° N, 74.3587° E',
}

/** Hacktoberfest-inspired palette (kept in sync with the @theme tokens in index.css). */
export const PALETTE = ['#ff8ae2', '#50e3c2', '#ffe27d', '#efedef', '#ff8b3d', '#9c4668']
