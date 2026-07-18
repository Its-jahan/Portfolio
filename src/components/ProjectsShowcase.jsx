import { useEffect, useRef, useState } from 'react'
import mockupScreen from '../assets/mockup-screen.jpg'
import { useScrollProgress, subscribeScroll, useAnimatedTrigger, reducedMotion, seg, easeOut, easeInOut, clamp01 } from './motion'

/* My three most-loved works, shown on a device that behaves like a real
   Apple product page:
   1. the device rises in, zoomed/cropped for an immersive feel;
   2. works one & two genie-minimize up behind the TrueDepth camera, which
      counts them on the right of the housing (1 → 2);
   3. work three flies in with a spring and STAYS on the desktop (→ 3);
   4. the cropped device springs out to reveal the full mockup, framed with
      a 40px margin.
   Placeholder work previews for now — swap with real shots later. */

const MEDIA = 'https://jahan-portfolio-nu.vercel.app'

const WORKS = [
  {
    id: '01',
    src: encodeURI(MEDIA + '/images/projects/opo/forex.png'),
    mode: 'genie',
  },
  {
    id: '02',
    src: encodeURI(MEDIA + '/images/projects/inddex/1440w light.png'),
    mode: 'genie',
  },
  {
    id: '03',
    src: encodeURI(MEDIA + '/images/projects/HIBUY/Desktop - 8.png'),
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
      {/* Preload the image so the browser fetches it immediately */}
      <link rel="preload" as="image" href={work.src} />
      <img
        src={work.src}
        alt={`Project ${work.id}`}
        className="block h-full w-full object-cover object-top"
        loading="eager"
        fetchPriority="high"
      />
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
  // Scroll position only ARMS each step; once a threshold is crossed the
  // whole effect plays out on its own clock, Apple-genie style — a small
  // scroll fires the complete minimize, no scrubbing through it.
  // One scroll gesture = one work. While the section is pinned, wheel
  // gestures are captured: each one fires the next transition, which then
  // plays to completion on its own clock — it cannot be stopped or
  // scrubbed mid-flight. Scrolling up steps back the same way. Touch
  // devices fall back to scroll-position thresholds.
  const [step, setStep] = useState(0)
  const [inView, setInView] = useState(false)
  const [bgOff, setBgOff] = useState(0)
  const stepRef = useRef(0)
  const lockRef = useRef(0)
  const lastWheelRef = useRef(0)

  useEffect(() => {
    return subscribeScroll(() => {
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setInView(r.top < window.innerHeight * 0.6)
      // luxury parallax: the wallpaper lags the page scroll a touch
      setBgOff(Math.max(-30, Math.min(30, -r.top * 0.06)))
    })
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    const MAX_STEP = 3
    const onWheel = (e) => {
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const pinned = r.top <= 2 && r.bottom >= vh - 2
      if (!pinned) return
      const dir = e.deltaY > 0 ? 1 : -1
      const cur = stepRef.current
      const canStep = dir > 0 ? cur < MAX_STEP : cur > 0
      if (!canStep) return // release native scroll past the edges
      e.preventDefault()
      const now = performance.now()
      // require a fresh gesture (gap in the wheel stream) after the lock,
      // so trackpad inertia never double-fires
      const freshGesture = now - lastWheelRef.current > 160
      lastWheelRef.current = now
      if (now < lockRef.current || !freshGesture) return
      stepRef.current = cur + dir
      setStep(stepRef.current)
      lockRef.current = now + 1050
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // touch fallback: derive the step from scroll progress
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const sIdx = coarse ? (p > 0.62 ? 3 : p > 0.4 ? 2 : p > 0.16 ? 1 : 0) : step

  const enter = useAnimatedTrigger(inView, 800, easeOut) // device rises + focuses on approach
  const headT = enter

  const g0 = useAnimatedTrigger(sIdx >= 1, 850)
  const a1 = useAnimatedTrigger(g0 > 0.8, 550, easeOut) // next work follows the genie
  const g1 = useAnimatedTrigger(sIdx >= 2, 850)
  const a2 = useAnimatedTrigger(g1 > 0.8, 650, (t) => t) // StayWindow springs itself

  const revealT = useAnimatedTrigger(sIdx >= 3, 900, (t) => t)
  const reveal = easeOutBack(revealT, 1.4) // crop → full mockup, spring

  const count = (g0 >= 0.99 ? 1 : 0) + (g1 >= 0.99 ? 1 : 0) + (a2 >= 0.85 ? 1 : 0)

  // The device fills the width with a 40px side margin. At that width it's
  // taller than the space under the heading, so its bottom crops past the
  // fold (immersive, like the reference). The reveal shrinks it just enough
  // to bring the whole mockup into view, springing as it settles.
  const mobile = vp.w < 640
  const DEVICE_TOP = mobile ? 276 : 248 // px from the viewport top (below the heading)
  const deviceW = Math.min(vp.w - (mobile ? 24 : 80), 1760)
  // on mobile the wallpaper crops to a tall, immersive panel (bridge-style);
  // on desktop the frame keeps the wallpaper's own aspect ratio
  const naturalH = mobile ? Math.min(vp.h * 0.6, 620) : deviceW / ASPECT
  const availH = vp.h - DEVICE_TOP - (mobile ? 20 : 40)
  const fitScale = clamp01(availH / naturalH) || 1
  const scale = 1 - (1 - fitScale) * reveal
  const deviceStyle = {
    // stays fully opaque so the mockup is on screen the instant the section
    // scrolls in — the entrance reads through the slide-up + focus, no blank
    transform: `translateX(-50%) translateY(${(1 - enter) * 90}px) scale(${scale})`,
    opacity: 1,
    filter: enter < 1 ? `blur(${(1 - enter) * 8}px)` : undefined,
    transformOrigin: 'center top',
    width: `${deviceW}px`,
    willChange: 'transform, opacity, filter',
  }

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: '175vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* heading pinned above the device */}
        <div className="absolute left-1/2 top-[88px] z-10 flex w-full max-w-[445px] -translate-x-1/2 flex-col items-center px-6 text-center sm:px-5">
          <h2 className="font-display text-[27px] font-medium leading-[34px] tracking-[-0.2297px] text-[#202020] sm:text-[32px] sm:leading-[40px] md:whitespace-nowrap">
            Some of my most recent projects
          </h2>
          <p className="mt-4 max-w-[365px] text-[15px] font-normal leading-[18px] text-[#404040]">
            Across phones, desktops, browsers, clouds, and every surface where work actually happens.
          </p>
          <a
            href="/works"
            className="mt-4 inline-flex h-[38px] items-center justify-center rounded-full bg-black px-4 font-inter text-[14px] font-medium leading-[15.68px] tracking-[-0.14px] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_25px_25px_-3.75px_rgba(0,0,0,0.11)]"
          >
            View all my works
          </a>
        </div>

        <div className="absolute left-1/2" style={{ top: `${DEVICE_TOP}px`, ...deviceStyle }}>
          <div className="relative overflow-hidden rounded-[24px] border-[5px] border-black" style={{ height: naturalH }}>
            <img
              src={mockupScreen}
              alt=""
              className="absolute inset-0 block h-full w-full select-none object-cover"
              draggable="false"
              style={{ transform: `translateY(${-bgOff}px) scale(1.09)`, willChange: 'transform' }}
            />

            {/* TrueDepth camera housing — count on the right, lens centered */}
            <div
              ref={notchRef}
              className="absolute left-1/2 top-0 z-30 flex h-[6.4%] max-h-[38px] min-h-[26px] w-[34%] min-w-[112px] -translate-x-1/2 items-center rounded-b-[16px] bg-black pl-3 pr-2.5 shadow-[0_3px_14px_rgba(0,0,0,0.5)] sm:w-[15%] sm:min-w-[150px] sm:pl-4 sm:pr-3"
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
                  style={{ color: (count > 0 && WORKS[Math.min(count, WORKS.length) - 1].accent) || '#fff' }}
                >
                  {count}
                </span>
                <span className="font-satoshi text-[11px] font-bold leading-none text-white/50">/{WORKS.length}</span>
              </span>
            </div>

            {/* work windows over the desktop */}
            <div ref={holderRef} className="absolute left-1/2 top-[13%] z-20 h-[58%] w-[74%] -translate-x-1/2 sm:w-[52%] xl:w-[38%]">
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
