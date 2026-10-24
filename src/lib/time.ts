const pad = (n: number) => String(n).padStart(2, '0')

export function splitHMS(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return { h: pad(h), m: pad(m), s: pad(s) }
}

/** "HH:MM" (24h) → "1:30 PM" style display. */
export function formatClock(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

/** Epoch ms → value for <input type="datetime-local">. */
export function toDatetimeLocal(ms: number) {
  const d = new Date(ms)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function msToHoursMinutes(ms: number) {
  const totalMin = Math.round(ms / 60000)
  return { hours: Math.floor(totalMin / 60), minutes: totalMin % 60 }
}
