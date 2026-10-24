import { motion } from 'motion/react'

export function DemoScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-[3vh] font-mono text-[clamp(14px,1.4vw,28px)] font-bold tracking-[0.4em] text-teal">
        &gt; npm run demo
      </div>
      <h1 className="font-display text-[clamp(48px,10vw,200px)] font-bold uppercase leading-[0.88] tracking-tight text-mist">
        IT'S <span className="text-pink">DEMO</span> TIME.
      </h1>
      <p className="mt-[4vh] font-display text-[clamp(20px,3.4vw,68px)] font-bold uppercase text-sun">
        SHOW US WHAT YOU BUILT.
      </p>
    </motion.div>
  )
}
