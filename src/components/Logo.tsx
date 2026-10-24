import { useEffect, useState } from 'react'

interface LogoProps {
  /** File name inside public/logos/, e.g. "mlh.svg". */
  file: string
  /** Organization name — used for alt text and the text wordmark fallback. */
  name: string
  className?: string
  fallbackClassName?: string
}

/**
 * Loads an official logo from public/logos/. If the file is missing, renders a
 * plain-text wordmark with the organization name (never a fabricated logo).
 */
export function Logo({ file, name, className = '', fallbackClassName = '' }: LogoProps) {
  const src = `${import.meta.env.BASE_URL}logos/${file}`
  const [ok, setOk] = useState<boolean | null>(null)

  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload = () => alive && setOk(img.naturalWidth > 0)
    img.onerror = () => alive && setOk(false)
    img.src = src
    return () => {
      alive = false
    }
  }, [src])

  if (ok) return <img src={src} alt={name} className={`object-contain ${className}`} draggable={false} />

  return (
    <span
      title={`${name} — add public/logos/${file} to show the official logo`}
      className={`inline-flex items-center rounded-md border-2 border-mist/70 px-[0.6em] py-[0.25em] font-display font-bold uppercase leading-none tracking-wide text-mist ${fallbackClassName}`}
      style={{ visibility: ok === null ? 'hidden' : 'visible' }}
    >
      {name}
    </span>
  )
}
