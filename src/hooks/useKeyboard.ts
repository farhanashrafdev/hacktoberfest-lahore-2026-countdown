import { useEffect, useRef } from 'react'

type KeyMap = Record<string, (e: KeyboardEvent) => void>

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

/**
 * Global shortcuts. Keys are matched against `e.key.toLowerCase()`
 * (use ' ' for Space, 'escape' for Esc). Ignored while typing in form fields,
 * except Escape.
 */
export function useKeyboard(map: KeyMap) {
  const ref = useRef(map)
  useEffect(() => {
    ref.current = map
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const key = e.key.toLowerCase()
      if (key !== 'escape' && isTyping(e.target)) return
      // Space on a focused button would also "click" it; let the shortcut win.
      const handler = ref.current[key]
      if (handler) {
        e.preventDefault()
        handler(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
