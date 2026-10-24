import type React from 'react'
import { EVENT } from '../lib/defaults'
import { Logo } from './Logo'

export function Header() {
  return (
    <header className="relative z-10 flex items-start justify-between px-[3vw] pt-[2.6vh]">
      <div className="flex items-center gap-[1.4vw]">
        <Logo
          file="hacktoberfest.svg"
          name="Hacktoberfest"
          className="h-[clamp(36px,6.2vh,72px)] w-auto"
          fallbackClassName="text-[clamp(16px,1.6vw,32px)] border-pink text-pink"
        />
        <div className="h-[clamp(36px,6vh,68px)] w-[3px] rounded bg-mist/30" />
        <div className="font-display font-bold uppercase leading-[0.95] tracking-tight">
          <div className="text-[clamp(16px,1.55vw,30px)] text-mist">{EVENT.title}</div>
          <div className="text-[clamp(16px,1.55vw,30px)] text-pink">{EVENT.city}</div>
        </div>
      </div>

      <div className="flex items-start gap-[2vw]">
        <Partner caption="Organized by">
          <Logo
            file="cnsp.svg"
            name="Cloud Native Security Pakistan"
            className="h-[clamp(32px,5.6vh,64px)] w-auto"
            fallbackClassName="text-[clamp(11px,0.95vw,19px)]"
          />
        </Partner>
        <Partner caption="Hackathon partner">
          <Logo
            file="mlh.svg"
            name="Major League Hacking"
            className="h-[clamp(32px,5.6vh,64px)] w-auto"
            fallbackClassName="text-[clamp(11px,0.95vw,19px)]"
          />
        </Partner>
      </div>
    </header>
  )
}

function Partner({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-end gap-[0.6vh]">
      <span className="font-mono text-[clamp(9px,0.65vw,13px)] uppercase tracking-[0.25em] text-mist/55">
        {caption}
      </span>
      {children}
    </div>
  )
}
