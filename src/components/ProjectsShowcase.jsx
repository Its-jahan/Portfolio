import { useEffect, useRef } from 'react'
import screenshot from '../assets/main-screenshot-final.png'
import { useScrollProgress, subscribeScroll, seg, easeOut, easeInOut, clamp01, SPRING } from './motion'

/* My three most-loved works. Each appears as a window on the laptop
   screen, then genie-minimizes up behind the top-center notch (macOS
   minimize, into the notch). After each one lands, the Dynamic-Island
   counter beside the notch pops and counts the collected works (1..3).
   Placeholder content for now — swap the WORKS previews with real shots. */

const WORKS = [
  {
    id: '01',
    name: 'Fintech Dashboard',
    tag: 'Product Design',
    tint: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 60%, #ede9fe 100%)',
    accent: '#4f46e5',
  },
  {
    id: '02',
    name: 'Design System',
    tag: 'Systems',
    tint: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 60%, #ccfbf1 100%)',
    accent: '#059669',
  },
  {
    id: '03',
    name: 'Mobile Banking App',
    tag: 'iOS · Product',
    tint: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 60%, #ffedd5 100%)',
    accent: '#e11d48',
  },
]

/* genie silhouette: the window necks toward the top-center, curving in
   like the macOS genie warp. pinch 0 = rectangle, 1 = pinched to a spout. */
function geniePolygon(pinch) {
  const N = 10
  const neck = (yf) => 50 * (1 - pinch * 0.95 * Math.pow(1 - yf, 2.2))
  const pts = []
  for (let s = 0; s <= N; s++) pts.push([50 - neck(s / N), (s / N) * 100])
  for (let s = N; s >= 0; s--) pts.push([50 + neck(s / N), (s / N) * 100])
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`
}

/* A polished placeholder project window: chrome bar + a faux app preview
   (hero block, content rows) so it reads as a real work, not a blob. */
function WorkWindow({ work, appearT, genieT, dy }) {
  const pinch = easeOut(seg(genieT, 0, 0.55))
  const rise = easeInOut(seg(genieT, 0.08, 1))
  const squashY = 1 - 0.9 * rise
  const squashX = 1 - 0.86 * rise
  const fade = 1 - seg(genieT, 0.8, 1)
  const inT = easeOut(appearT)

  const style = {
    opacity: Math.min(inT, fade),
    clipPath: genieT > 0.001 ? geniePolygon(pinch) : undefined,
    transform:
      genieT > 0.001
        ? `translateY(${rise * dy}px) scale(${squashX}, ${squashY})`
        : `translateY(${(1 - inT) * 30}px) scale(${0.95 + inT * 0.05})`,
    transformOrigin: 'center top',
    willChange: genieT > 0.001 || inT < 1 ? 'transform, opacity, clip-path' : 'auto',
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.06)]"
      style={style}
    >
      {/* window chrome */}
      <div className="flex h-9 items-center gap-1.5 border-b border-black/5 bg-[#f7f7f8] px-4">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-satoshi text-[12px] font-bold tracking-[-0.12px] text-black/45">{work.name}</span>
      </div>
      {/* faux preview */}
      <div className="flex h-[calc(100%-36px)] flex-col p-5">
        <div className="relative flex-1 overflow-hidden rounded-xl" style={{ background: work.tint }}>
          <span
            className="absolute left-4 top-4 rounded-full px-2.5 py-1 font-mono text-[11px] italic"
            style={{ background: 'rgba(255,255,255,0.75)', color: work.accent }}
          >
            {work.tag}
          </span>
          <div className="absolute inset-x-4 bottom-4">
            <p className="font-display text-[clamp(18px,2.4vw,28px)] font-semibold tracking-[-0.4px] text-[#1a1a1a]">
              {work.name}
            </p>
            <div className="mt-3 flex gap-2">
              <span className="h-2 w-16 rounded-full" style={{ background: work.accent, opacity: 0.9 }} />
              <span className="h-2 w-10 rounded-full bg-black/15" />
              <span className="h-2 w-8 rounded-full bg-black/10" />
            </div>
          </div>
          <span className="absolute right-4 top-4 font-mono text-[12px] font-semibold" style={{ color: work.accent }}>
            {work.id}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="size-8 rounded-full" style={{ background: work.accent, opacity: 0.85 }} />
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="h-2 w-1/2 rounded-full bg-black/12" />
            <span className="h-2 w-1/3 rounded-full bg-black/8" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsShowcase() {
  const wrapRef = useRef(null)
  const notchRef = useRef(null)
  const holderRef = useRef(null)
  const geom = useRef({ dy: -360 })
  const p = useScrollProgress(wrapRef)

  useEffect(() => {
    return subscribeScroll(() => {
      const n = notchRef.current
      const h = holderRef.current
      if (!n || !h) return
      const nr = n.getBoundingClientRect()
      const hr = h.getBoundingClientRect()
      if (hr.height > 0) geom.current.dy = nr.top + nr.height / 2 - hr.top
    })
  }, [])

  const headT = easeOut(seg(p, 0.0, 0.14))
  const deviceT = easeOut(seg(p, 0.05, 0.3))

  // Phase 2 — works genie into the notch, one after another
  const BASE = 0.34
  const SPAN = 0.2
  const phases = WORKS.map((_, i) => {
    const w0 = BASE + i * SPAN
    return {
      appearT: i === 0 ? deviceT : easeOut(seg(p, w0 - 0.04, w0 + 0.02)),
      genieT: easeInOut(seg(p, w0 + 0.06, w0 + SPAN - 0.02)),
    }
  })
  const count = phases.filter((ph) => ph.genieT >= 1).length
  const active = phases.findIndex((ph) => ph.genieT < 1)

  const deviceStyle = {
    transform: `translateY(${(1 - deviceT) * 240}px) scale(${0.9 + deviceT * 0.1})`,
    opacity: Math.min(1, deviceT * 1.6),
    filter: deviceT < 1 ? `blur(${(1 - deviceT) * 12}px)` : undefined,
    transformOrigin: 'center top',
    willChange: deviceT < 1 ? 'transform, opacity, filter' : 'auto',
  }

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: '380vh' }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-start overflow-hidden pt-[8vh]">
        <div
          className="flex max-w-[445px] flex-col items-center text-center"
          style={
            headT < 1
              ? {
                  opacity: headT,
                  transform: `translateY(${(1 - headT) * 30}px)`,
                  filter: `blur(${(1 - headT) * 8}px)`,
                  willChange: 'transform, opacity, filter',
                }
              : undefined
          }
        >
          <h2 className="whitespace-nowrap font-display text-[32px] font-medium leading-[40px] tracking-[-0.2297px] text-[#202020]">
            Some of my most recent projects
          </h2>
          <p className="max-w-[365px] text-[15px] font-normal leading-[18px] text-[#404040]">
            Across phones, desktops, browsers, clouds, and every surface where work actually happens.
          </p>
          <a
            href="#work"
            className="mt-4 inline-flex h-[38px] items-center justify-center rounded-full bg-black px-4 font-satoshi text-[14px] font-bold leading-[15.68px] tracking-[-0.14px] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_25px_25px_-3.75px_rgba(0,0,0,0.11)]"
          >
            View all my works
          </a>
        </div>

        {/* MacBook-style mockup; works genie up behind the notch */}
        <div className="relative mt-[34px] w-[92%] max-w-[1080px]" style={deviceStyle}>
          <div className="relative rounded-t-[28px] bg-black px-[6px] pt-[30px]">
            {/* notch */}
            <div
              ref={notchRef}
              className="absolute left-1/2 top-[29px] z-30 h-[15px] w-[140px] -translate-x-1/2 rounded-b-[10px] bg-black"
            />

            {/* Dynamic-Island work counter — appears after the first genie */}
            <div
              className="absolute top-[26px] z-30 flex h-[21px] items-center gap-1.5 rounded-full bg-black px-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
              style={{
                left: 'calc(50% + 78px)',
                opacity: count > 0 ? 1 : 0,
                transform: count > 0 ? 'translateX(0) scale(1)' : 'translateX(-14px) scale(0.5)',
                transition: `transform 480ms ${SPRING}, opacity 260ms ease`,
                pointerEvents: 'none',
              }}
              aria-live="polite"
              aria-label={`${count} of ${WORKS.length} works collected`}
            >
              <span key={count} className="island-pop flex items-center gap-1.5">
                <span
                  className="size-[6px] rounded-full"
                  style={{ background: count > 0 ? WORKS[Math.min(count, WORKS.length) - 1].accent : '#888' }}
                />
                <span className="font-satoshi text-[11px] font-bold leading-none text-white">
                  {count}/{WORKS.length}
                </span>
              </span>
            </div>

            <img src={screenshot} alt="" className="block w-full rounded-t-[6px] object-cover" />

            {/* work windows layered over the screen (centered, not full-bleed) */}
            <div ref={holderRef} className="absolute left-1/2 top-[12%] z-20 h-[62%] w-[44%] -translate-x-1/2">
              {WORKS.map((w, i) => {
                if (active === -1 ? i !== WORKS.length - 1 : i > active) return null
                if (active !== -1 && i < active) return null
                const ph = phases[i]
                return <WorkWindow key={w.id} work={w} appearT={ph.appearT} genieT={ph.genieT} dy={geom.current.dy} />
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
