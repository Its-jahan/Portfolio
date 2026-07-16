import { useEffect, useRef, useState } from 'react'
import mockupScreen from '../assets/mockup-screen.jpg'
import { useScrollProgress, subscribeScroll, seg, easeOut, easeInOut, clamp01 } from './motion'

/* My three most-loved works, shown on a device that behaves like a real
   Apple product page:
   1. the device rises in, zoomed/cropped for an immersive feel;
   2. works one & two genie-minimize up behind the TrueDepth camera, which
      counts them on the right of the housing (1 → 2);
   3. work three flies in with a spring and STAYS on the desktop (→ 3);
   4. the cropped device springs out to reveal the full mockup, framed with
      a 40px margin.
   Placeholder work previews for now — swap with real shots later. */

const WORKS = [
  {
    id: '01',
    name: 'Fintech Dashboard',
    tag: 'Product Design',
    tint: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 60%, #ede9fe 100%)',
    accent: '#4f46e5',
    mode: 'genie',
  },
  {
    id: '02',
    name: 'Design System',
    tag: 'Systems',
    tint: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 60%, #ccfbf1 100%)',
    accent: '#059669',
    mode: 'genie',
  },
  {
    id: '03',
    name: 'Mobile Banking App',
    tag: 'iOS · Product',
    tint: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 60%, #ffedd5 100%)',
    accent: '#e11d48',
    mode: 'stay',
  },
]

const ASPECT = 2.169 // mockup-screen.jpg width / height

// spring-ish overshoot easings for the "alive" bounce
const easeOutBack = (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)

/* genie silhouette: the window necks toward top-center like the macOS
   genie warp. pinch 0 = rectangle, 1 = pinched to a spout. */
function geniePolygon(pinch) {
  const N = 10
  const neck = (yf) => 50 * (1 - pinch * 0.95 * Math.pow(1 - yf, 2.2))
  const pts = []
  for (let s = 0; s <= N; s++) pts.push([50 - neck(s / N), (s / N) * 100])
  for (let s = N; s >= 0; s--) pts.push([50 + neck(s / N), (s / N) * 100])
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`
}

function WorkCard({ work }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.06)]">
      <div className="flex h-9 items-center gap-1.5 border-b border-black/5 bg-[#f7f7f8] px-4">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-satoshi text-[12px] font-bold tracking-[-0.12px] text-black/45">{work.name}</span>
      </div>
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

function GenieWindow({ work, appearT, genieT, dyLocal }) {
  const pinch = easeOut(seg(genieT, 0, 0.55))
  const rise = easeInOut(seg(genieT, 0.08, 1))
  const squashY = 1 - 0.9 * rise
  const squashX = 1 - 0.86 * rise
  const opacity = Math.min(easeOut(appearT), 1 - seg(genieT, 0.82, 1))
  if (opacity <= 0.001) return null
  const style = {
    opacity,
    clipPath: genieT > 0.001 ? geniePolygon(pinch) : undefined,
    transform:
      genieT > 0.001
        ? `translateY(${rise * dyLocal}px) scale(${squashX}, ${squashY})`
        : `translateY(${(1 - easeOut(appearT)) * 30}px) scale(${0.95 + easeOut(appearT) * 0.05})`,
    transformOrigin: 'center top',
    willChange: 'transform, opacity, clip-path',
  }
  return (
    <div className="absolute inset-0" style={style}>
      <WorkCard work={work} />
    </div>
  )
}

function StayWindow({ work, arriveT }) {
  if (arriveT <= 0.001) return null
  // flies up from below and springs into place, then stays
  const b = easeOutBack(clamp01(arriveT), 1.9)
  const ty = (1 - b) * 120
  const opacity = clamp01(arriveT * 2)
  return (
    <div
      className="absolute inset-0"
      style={{ opacity, transform: `translateY(${ty}px) scale(${0.96 + 0.04 * clamp01(arriveT * 1.4)})`, transformOrigin: 'center bottom', willChange: 'transform, opacity' }}
    >
      <WorkCard work={work} />
    </div>
  )
}

export default function ProjectsShowcase() {
  const wrapRef = useRef(null)
  const notchRef = useRef(null)
  const holderRef = useRef(null)
  const geom = useRef({ dy: -320 })
  const p = useScrollProgress(wrapRef)
  const [vp, setVp] = useState({ w: 1280, h: 800 })

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    return subscribeScroll(() => {
      const n = notchRef.current
      const h = holderRef.current
      if (!n || !h) return
      // measure in the device's own (unscaled) layout space via offsets so
      // the genie target stays correct regardless of the device zoom scale
      const dy = n.offsetTop + n.offsetHeight / 2 - h.offsetTop
      if (Number.isFinite(dy)) geom.current.dy = dy
    })
  }, [])

  // ── timeline ────────────────────────────────────────────────────────
  const headT = easeOut(seg(p, 0.0, 0.12))
  const enter = easeOut(seg(p, 0.04, 0.24)) // device rises + zooms in

  const g0 = easeInOut(seg(p, 0.3, 0.44))
  const a1 = easeOut(seg(p, 0.44, 0.5))
  const g1 = easeInOut(seg(p, 0.5, 0.64))
  const a2 = seg(p, 0.64, 0.78) // work three arrives and stays

  const reveal = easeOutBack(seg(p, 0.82, 1.0), 1.4) // crop → full mockup, spring

  const count = (g0 >= 1 ? 1 : 0) + (g1 >= 1 ? 1 : 0) + (a2 >= 0.85 ? 1 : 0)

  // The device fills the width with a 40px side margin. At that width it's
  // taller than the space under the heading, so its bottom crops past the
  // fold (immersive, like the reference). The reveal shrinks it just enough
  // to bring the whole mockup into view, springing as it settles.
  const DEVICE_TOP = 248 // px from the viewport top (heading at 88 + its height)
  const deviceW = Math.min(vp.w - 80, 1760)
  const naturalH = deviceW / ASPECT
  const availH = vp.h - DEVICE_TOP - 40
  const fitScale = clamp01(availH / naturalH) || 1
  const scale = 1 - (1 - fitScale) * reveal
  const deviceStyle = {
    transform: `translateX(-50%) translateY(${(1 - enter) * 120}px) scale(${scale})`,
    opacity: Math.min(1, enter * 1.7),
    filter: enter < 1 ? `blur(${(1 - enter) * 10}px)` : undefined,
    transformOrigin: 'center top',
    width: `${deviceW}px`,
    willChange: 'transform, opacity, filter',
  }

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: '440vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* heading pinned above the device */}
        <div
          className="absolute left-1/2 top-[88px] z-10 flex w-full max-w-[445px] -translate-x-1/2 flex-col items-center px-5 text-center"
          style={{
            opacity: headT,
            transform: headT < 1 ? `translateY(${(1 - headT) * 24}px)` : undefined,
            filter: headT < 1 ? `blur(${(1 - headT) * 8}px)` : undefined,
            willChange: 'opacity',
          }}
        >
          <h2 className="whitespace-nowrap font-display text-[32px] font-medium leading-[40px] tracking-[-0.2297px] text-[#202020]">
            Some of my most recent projects
          </h2>
          <p className="mt-4 max-w-[365px] text-[15px] font-normal leading-[18px] text-[#404040]">
            Across phones, desktops, browsers, clouds, and every surface where work actually happens.
          </p>
          <a
            href="#work"
            className="mt-4 inline-flex h-[38px] items-center justify-center rounded-full bg-black px-4 font-satoshi text-[14px] font-bold leading-[15.68px] tracking-[-0.14px] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_25px_25px_-3.75px_rgba(0,0,0,0.11)]"
          >
            View all my works
          </a>
        </div>

        <div className="absolute left-1/2" style={{ top: `${DEVICE_TOP}px`, ...deviceStyle }}>
          <div className="relative">
            <img
              src={mockupScreen}
              alt=""
              className="block w-full select-none rounded-[24px] border-[5px] border-black"
              draggable="false"
            />

            {/* TrueDepth camera housing — count on the right, lens centered */}
            <div
              ref={notchRef}
              className="absolute left-1/2 top-0 z-30 flex h-[6.4%] min-h-[32px] w-[15%] min-w-[150px] -translate-x-1/2 items-center rounded-b-[16px] bg-black pl-4 pr-3 shadow-[0_3px_14px_rgba(0,0,0,0.5)]"
            >
              {/* camera lens (centered) */}
              <span className="absolute left-1/2 top-1/2 grid size-[13px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#0b0b12] ring-1 ring-white/10">
                <span className="size-[5px] rounded-full bg-[#16224a]" />
                <span className="absolute right-[3px] top-[2.5px] size-[2px] rounded-full bg-[#5f83e6]" />
              </span>
              {/* running count, pushed to the right */}
              <span
                key={count}
                className={`ml-auto flex items-baseline gap-[3px] ${count > 0 ? 'island-pop' : ''}`}
                style={{ opacity: count > 0 ? 1 : 0.3, transition: 'opacity 220ms ease' }}
                aria-live="polite"
                aria-label={`${count} of ${WORKS.length} works`}
              >
                <span
                  className="font-satoshi text-[16px] font-bold leading-none"
                  style={{ color: count > 0 ? WORKS[Math.min(count, WORKS.length) - 1].accent : '#fff' }}
                >
                  {count}
                </span>
                <span className="font-satoshi text-[11px] font-bold leading-none text-white/50">/{WORKS.length}</span>
              </span>
            </div>

            {/* work windows over the desktop */}
            <div ref={holderRef} className="absolute left-1/2 top-[13%] z-20 h-[58%] w-[38%] -translate-x-1/2">
              <GenieWindow work={WORKS[0]} appearT={enter} genieT={g0} dyLocal={geom.current.dy} />
              <GenieWindow work={WORKS[1]} appearT={a1} genieT={g1} dyLocal={geom.current.dy} />
              <StayWindow work={WORKS[2]} arriveT={a2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
