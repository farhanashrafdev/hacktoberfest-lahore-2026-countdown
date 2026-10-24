import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { MESSAGE_INTERVAL_MS } from '../lib/defaults'

/** Renders `inline code` segments in a terminal-style chip. */
function renderMessage(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 1 ? (
      <code key={i} className="rounded-lg bg-mist/10 px-[0.35em] py-[0.05em] font-mono normal-case text-teal">
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export function MessageRotator({ messages }: { messages: string[] }) {
  const list = messages.filter((m) => m.trim())
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (list.length < 2) return
    const id = window.setInterval(() => setIndex((i) => i + 1), MESSAGE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [list.length])

  if (!list.length) return null
  const i = index % list.length
  const msg = list[i]

  return (
    <div className="relative flex h-[clamp(40px,6.5vh,80px)] w-full items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={`${i}-${msg}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap text-center font-display text-[clamp(18px,2.35vw,46px)] font-bold uppercase tracking-tight text-mist"
        >
          {renderMessage(msg)}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
