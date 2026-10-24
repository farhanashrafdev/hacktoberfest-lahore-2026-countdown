import { useEffect, useState } from 'react'

/** True after `timeoutMs` without mouse / touch / key activity. */
export function useIdle(timeoutMs = 2500) {
  const [idle, setIdle] = useState(true)

  useEffect(() => {
    let timer = 0
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), timeoutMs)
    }
    const events = ['mousemove', 'mousedown', 'touchstart', 'wheel'] as const
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }))
    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, wake))
    }
  }, [timeoutMs])

  return idle
}
