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

/* Fade-up reveal with blur, like the reference site's section entrances.
   Reverses whenever the element exits the viewport, so the storytelling
   follows the scroll in both directions. */
export function Reveal({ children, delay = 0, y = 26, blur = 10, duration = 850, once = false, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(reducedMotion())
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
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        filter: shown ? 'blur(0px)' : `blur(${blur}px)`,
        transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms, filter ${duration}ms ${EASE} ${delay}ms`,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  )
}
