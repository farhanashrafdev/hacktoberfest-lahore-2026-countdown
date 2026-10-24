import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { PALETTE } from '../lib/defaults'

interface Props {
  animations: boolean
  onClose?: () => void
}

export function Celebration({ animations, onClose }: Props) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!animations || reduce) return
    const fire = (x: number, angle: number) =>
      confetti({
        particleCount: 90,
        spread: 70,
        startVelocity: 55,
        angle,
        origin: { x, y: 0.9 },
        colors: PALETTE,
        shapes: ['square', 'circle'],
        scalar: 1.2,
        disableForReducedMotion: true,
      })
    fire(0.1, 60)
    fire(0.9, 120)
    const t1 = window.setTimeout(() => confetti({ particleCount: 140, spread: 110, origin: { y: 0.4 }, colors: PALETTE, scalar: 1.2, disableForReducedMotion: true }), 700)
    const t2 = window.setTimeout(() => {
      fire(0.2, 70)
      fire(0.8, 110)
    }, 1600)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      confetti.reset()
    }
  }, [animations])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onClose}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-void/95 text-center"
    >
      <div className="absolute left-[8vw] top-[14vh] h-[9vw] w-[9vw] rounded-full bg-pink/80" />
      <div className="absolute right-[10vw] top-[18vh] h-[7vw] w-[7vw] rotate-12 bg-teal/80" />
      <div className="absolute bottom-[16vh] left-[14vw] h-0 w-0 border-x-[3.5vw] border-b-[6vw] border-x-transparent border-b-sun/80" />
      <div className="absolute bottom-[12vh] right-[12vw] h-[10vw] w-[10vw] rounded-full border-[6px] border-ember/80" />

      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative font-display text-[clamp(40px,8.5vw,170px)] font-bold uppercase leading-[0.9] tracking-tight text-mist"
      >
        THAT'S A WRAP,
        <br />
        <span className="text-pink">LAHORE!</span>
      </motion.h1>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="relative mt-[4vh] font-display text-[clamp(18px,2.8vw,56px)] font-bold uppercase text-teal"
      >
        YOU BUILT IT. NOW SHOW THE WORLD.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.7 }}
        className="relative mt-[5vh] rounded-full border-2 border-mist/40 px-[1.4em] py-[0.5em] font-mono text-[clamp(14px,1.5vw,30px)] font-bold tracking-[0.3em] text-mist"
      >
        HACKTOBERFEST LAHORE 2026
      </motion.p>
    </motion.div>
  )
}
