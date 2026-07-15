import { useEffect, useRef, useState } from 'react'

/* Shared scroll-motion utilities: a scrub-progress hook for sticky
   storytelling sections, and a blur/fade Reveal for in-flow content.
   Easing matches the reference site: cubic-bezier(0.22, 1, 0.36, 1). */

export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
export const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)' // slight overshoot, iMessage pop

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
/* progress of t through the [a, b] window */
export const seg = (t, a, b) => clamp01((t - a) / (b - a))
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* easeInOut cubic — smooth on both ends, used for the scroll-scrubbed
   exit dissolve so blocks leave without any snap. */
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/* One shared scroll/resize dispatcher, rAF-batched, so every animated
   block on the page costs a single listener and a single frame — no
   per-component listener pile-up. Subscribers are called once per frame. */
const scrollSubs = new Set()
let scrollRaf = 0
function flushScroll() {
  scrollRaf = 0
  for (const fn of scrollSubs) fn()
}
function onSharedScroll() {
  if (!scrollRaf) scrollRaf = requestAnimationFrame(flushScroll)
}
export function subscribeScroll(fn) {
  if (scrollSubs.size === 0 && typeof window !== 'undefined') {
    window.addEventListener('scroll', onSharedScroll, { passive: true })
    window.addEventListener('resize', onSharedScroll)
  }
  scrollSubs.add(fn)
  fn()
  return () => {
    scrollSubs.delete(fn)
    if (scrollSubs.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('scroll', onSharedScroll)
      window.removeEventListener('resize', onSharedScroll)
      cancelAnimationFrame(scrollRaf)
      scrollRaf = 0
    }
  }
}

/* Scroll progress (0..1) through a tall wrapper that contains a sticky
   viewport: 0 when the wrapper hits the top of the screen, 1 when its
   bottom reaches the bottom of the screen. rAF-throttled. */
export function useScrollProgress(ref) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion()) {
      setP(1)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      setP(total > 0 ? clamp01(-r.top / total) : 1)
    }
    // update synchronously; React batches renders, and reading one rect per
    // scroll event is cheap — this also keeps working when rAF is throttled
    const onScroll = update
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref])
  return p
}

/* Fade-up reveal with blur on entrance, plus a scroll-scrubbed exit
   dissolve on the way out: as a block leaves past the top of the
   viewport it drifts up a touch, softly blurs, and fades — the same
   premium feel on every section, in both scroll directions. No skew,
   no squish; purely opacity + blur + a small translate, all GPU cheap.

   Entrance stays time-based (a smooth blur-up the first time the block
   enters). Exit is position-based so it tracks the scrollbar exactly. */
export function Reveal({ children, delay = 0, y = 26, blur = 10, duration = 850, once = false, exit = true, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(reducedMotion())
  const [ex, setEx] = useState(0) // exit progress 0..1

  useEffect(() => {
    if (reducedMotion()) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShown(true)
        else if (!once) setShown(false)
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  useEffect(() => {
    if (!exit || reducedMotion()) return
    const el = ref.current
    if (!el) return
    return subscribeScroll(() => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // begin dissolving once the block's top rises past 24% of the
      // viewport; fully gone a little above the top edge. Only ever
      // engages near the top, so it never touches entering content.
      const start = vh * 0.24
      const end = -r.height * 0.35 - vh * 0.02
      const next = clamp01((start - r.top) / (start - end))
      setEx((prev) => (Math.abs(prev - next) > 0.002 ? next : prev))
    })
  }, [exit])

  const exiting = ex > 0.001
  let style
  if (exiting) {
    const e = easeInOut(ex)
    style = {
      opacity: 1 - e,
      transform: `translateY(${-ex * 34}px) scale(${1 - ex * 0.03})`,
      filter: `blur(${ex * 8}px)`,
      transformOrigin: 'center top',
      willChange: 'transform, opacity, filter',
    }
  } else {
    style = {
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : `translateY(${y}px)`,
      filter: shown ? 'blur(0px)' : `blur(${blur}px)`,
      transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms, filter ${duration}ms ${EASE} ${delay}ms`,
      willChange: 'transform, opacity, filter',
    }
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
