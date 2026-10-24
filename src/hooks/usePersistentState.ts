import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    const parsed = JSON.parse(raw) as T
    if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed }
    }
    return parsed
  } catch {
    return fallback
  }
}

/** useState that is mirrored to localStorage (merged with defaults for objects). */
export function usePersistentState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => read(key, fallback))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full / unavailable */
    }
  }, [key, value])

  // Keep multiple open tabs (e.g. projector + organizer laptop) in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read(key, fallback))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, setValue]
}
