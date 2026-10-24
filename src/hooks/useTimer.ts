import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../lib/defaults'
import { usePersistentState } from './usePersistentState'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

interface TimerState {
  status: TimerStatus
  /** Epoch ms when the countdown hits zero (only while running). */
  endAt: number | null
  /** Remaining ms while idle / paused. */
  remainingMs: number
  /** Total length of the current session, for progress. */
  totalMs: number
}

/**
 * Timestamp-based countdown. The interval only triggers re-renders; the
 * remaining time is always derived from Date.now(), so it stays accurate in
 * background tabs and across refreshes.
 */
export function useTimer(defaultDurationMs: number) {
  const [state, setState] = usePersistentState<TimerState>(STORAGE_KEYS.timer, {
    status: 'idle',
    endAt: null,
    remainingMs: defaultDurationMs,
    totalMs: defaultDurationMs,
  })
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const id = window.setInterval(tick, 200)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  const remainingMs =
    state.status === 'running' && state.endAt != null
      ? Math.max(0, state.endAt - now)
      : state.status === 'finished'
        ? 0
        : state.remainingMs

  useEffect(() => {
    if (state.status === 'running' && remainingMs <= 0) {
      setState((s) => ({ ...s, status: 'finished', endAt: null, remainingMs: 0 }))
    }
  }, [state.status, remainingMs, setState])

  const start = useCallback(() => {
    setState((s) => {
      if (s.status === 'running') return s
      const rem = s.status === 'finished' || s.remainingMs <= 0 ? s.totalMs : s.remainingMs
      return { ...s, status: 'running', endAt: Date.now() + rem, remainingMs: rem }
    })
  }, [setState])

  const pause = useCallback(() => {
    setState((s) => {
      if (s.status !== 'running' || s.endAt == null) return s
      return { ...s, status: 'paused', endAt: null, remainingMs: Math.max(0, s.endAt - Date.now()) }
    })
  }, [setState])

  const toggle = useCallback(() => {
    if (state.status === 'running') pause()
    else if (state.status !== 'finished') start()
  }, [state.status, pause, start])

  const reset = useCallback(
    (durationMs: number) => {
      setState({ status: 'idle', endAt: null, remainingMs: durationMs, totalMs: durationMs })
    },
    [setState],
  )

  /** Count down to an exact wall-clock time (starts immediately). */
  const setTarget = useCallback(
    (targetMs: number) => {
      const rem = targetMs - Date.now()
      if (rem <= 0) return false
      setState({ status: 'running', endAt: targetMs, remainingMs: rem, totalMs: rem })
      return true
    },
    [setState],
  )

  /** Add (or remove, with a negative value) time to the current session. */
  const adjust = useCallback(
    (deltaMs: number) => {
      setState((s) => {
        if (s.status === 'running' && s.endAt != null) {
          const endAt = Math.max(Date.now(), s.endAt + deltaMs)
          return { ...s, endAt, totalMs: Math.max(1000, s.totalMs + deltaMs) }
        }
        const remainingMs = Math.max(0, s.remainingMs + deltaMs)
        return {
          ...s,
          status: s.status === 'finished' && remainingMs > 0 ? 'paused' : s.status,
          remainingMs,
          totalMs: Math.max(1000, s.totalMs + deltaMs),
        }
      })
    },
    [setState],
  )

  return {
    status: state.status,
    remainingMs,
    totalMs: state.totalMs,
    endAt: state.endAt,
    now,
    start,
    pause,
    toggle,
    reset,
    setTarget,
    adjust,
  }
}

export type Timer = ReturnType<typeof useTimer>
