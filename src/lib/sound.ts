let ctx: AudioContext | null = null
let unlocked = false

/** Audio can only start after a user gesture; call once at startup. */
export function initAudioUnlock() {
  const unlock = () => {
    if (unlocked) return
    try {
      ctx = ctx ?? new AudioContext()
      void ctx.resume()
      unlocked = true
    } catch {
      /* audio unsupported */
    }
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)
}

function tone(freq: number, start: number, dur: number, gain = 0.18, type: OscillatorType = 'sine') {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = ctx.currentTime + start
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export function playChime() {
  if (!unlocked) return
  tone(880, 0, 0.5)
  tone(1318.5, 0.18, 0.7)
}

export function playFanfare() {
  if (!unlocked) return
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => tone(f, i * 0.14, 0.5, 0.16, 'triangle'))
  tone(1046.5, 0.7, 1.2, 0.14, 'triangle')
  tone(783.99, 0.7, 1.2, 0.1, 'triangle')
}
