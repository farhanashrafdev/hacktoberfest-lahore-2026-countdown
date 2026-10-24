import { motion } from 'motion/react'
import { formatClock } from '../lib/time'

export function BreakScreen({ returnAt, message }: { returnAt: string; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <div className="font-display text-[clamp(22px,3.2vw,64px)] font-bold uppercase tracking-tight text-sun">
        ON A BREAK — BACK AT
      </div>
      <div className="tabular font-mono font-extrabold leading-none text-mist" style={{ fontSize: 'min(14vw, 28vh)' }}>
        {formatClock(returnAt)}
      </div>
      {message.trim() && (
        <p className="mt-[3vh] max-w-[80vw] font-display text-[clamp(18px,2.6vw,52px)] font-bold uppercase text-pink">
          {message}
        </p>
      )}
    </motion.div>
  )
}
