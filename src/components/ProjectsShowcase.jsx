import { useRef } from 'react'
import screenshot from '../assets/main-screenshot-final.png'
import chatgptLogo from '../assets/chatgpt-logo.svg'
import aiIcon from '../assets/ai-icon.svg'
import jakubLogo from '../assets/jakub-logo.svg'
import githubIcon from '../assets/icon-github.svg'
import linkedinIcon from '../assets/icon-linkedin.svg'
import sealBadge from '../assets/wax-seal-badge.png'
import { useScrollProgress, seg, easeOut, EASE } from './motion'

/* App tiles that swoosh onto the laptop, bridge.surf style.
   side: -1 flies in from the left, +1 from the right.
   order controls the stagger. */
const APPS = [
  { src: chatgptLogo, side: -1, order: 0, bg: '#ffffff' },
  { src: aiIcon, side: 1, order: 1, bg: '#0a0a0a' },
  { src: jakubLogo, side: -1, order: 2, bg: '#ffffff' },
  { src: sealBadge, side: 1, order: 3, bg: '#ffffff' },
  { src: githubIcon, side: -1, order: 4, bg: '#ffffff' },
  { src: linkedinIcon, side: 1, order: 5, bg: '#ffffff' },
]

export default function ProjectsShowcase() {
  const wrapRef = useRef(null)
  const p = useScrollProgress(wrapRef)

  // Phase 1 — headline settles while the laptop rises into view
  const headT = easeOut(seg(p, 0.0, 0.22))
  const deviceT = easeOut(seg(p, 0.06, 0.42))
  // Phase 2 — apps swoosh in one after another
  const swooshBase = 0.42

  const deviceStyle = {
    transform: `translateY(${(1 - deviceT) * 260}px) scale(${0.88 + deviceT * 0.12})`,
    opacity: Math.min(1, deviceT * 1.6),
    filter: `blur(${(1 - deviceT) * 14}px)`,
    transformOrigin: 'center top',
    willChange: 'transform, opacity, filter',
  }

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: '260vh' }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-start overflow-hidden pt-[9vh]">
        <div
          className="flex max-w-[445px] flex-col items-center text-center"
          style={{
            opacity: headT,
            transform: `translateY(${(1 - headT) * 30}px)`,
            filter: `blur(${(1 - headT) * 8}px)`,
            willChange: 'transform, opacity, filter',
          }}
        >
          <h2 className="whitespace-nowrap font-display text-[32px] font-medium leading-[40px] tracking-[-0.2297px] text-[#202020]">
            Some of my most recent projects
          </h2>
          <p className="max-w-[365px] text-[15px] font-normal leading-[18px] text-[#404040]">
            Across phones, desktops, browsers, clouds, and every surface where work actually happens.
          </p>
        </div>

        {/* MacBook-style mockup rises in, then the app dock swooshes across it */}
        <div className="relative mt-[31px] w-[95%] max-w-[1625px]" style={deviceStyle}>
          <div className="relative rounded-t-[28px] bg-black px-[6px] pt-[30px]">
            <div className="absolute left-1/2 top-[29px] h-[15px] w-[140px] -translate-x-1/2 rounded-b-[10px] bg-black" />
            <img
              src={screenshot}
              alt="Product mockup screenshot inside a laptop frame"
              className="block w-full rounded-t-[6px] object-cover"
            />

            {/* floating app dock */}
            <div className="pointer-events-none absolute inset-x-0 top-[38%] flex items-center justify-center gap-[18px]">
              {APPS.map((app, i) => {
                const t = easeOut(seg(p, swooshBase + app.order * 0.055, swooshBase + 0.24 + app.order * 0.055))
                const off = 1 - t
                return (
                  <div
                    key={i}
                    className="flex size-16 items-center justify-center rounded-[18px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.05)]"
                    style={{
                      background: app.bg,
                      opacity: Math.min(1, t * 1.5),
                      transform: [
                        `translateX(${app.side * off * 60}vw)`,
                        `translateY(${off * -40 - Math.sin(off * Math.PI) * 60}px)`,
                        `rotate(${app.side * off * 55}deg)`,
                        `scale(${0.55 + t * 0.45})`,
                      ].join(' '),
                      filter: `blur(${off * 10}px)`,
                      transition: `transform 60ms ${EASE}`,
                      willChange: 'transform, opacity, filter',
                    }}
                  >
                    <img src={app.src} alt="" className="size-9 object-contain" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
