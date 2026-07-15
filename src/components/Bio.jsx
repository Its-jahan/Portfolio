import bust from '../assets/bio-bust.png'
import waxSealBadge from '../assets/wax-seal-crop.png'
import { useEffect, useRef, useState } from 'react'
import { Reveal, reducedMotion } from './motion'

const timeline = [
  { role: 'Freelance Practice', company: 'Free like a bird', dates: '2020 → Now' },
  { role: 'Design Lead', company: 'Ace agency', dates: '2022 → 2025' },
  { role: 'Designer', company: 'CreatorCore', dates: '2023 → 2026' },
  { role: 'Product Designer', company: 'micro1', dates: '2024 → 2026' },
]

function StatueGlitch() {
  const ref = useRef(null)
  const [glitching, setGlitching] = useState(false)
  const [glitchType, setGlitchType] = useState(-1)

  useEffect(() => {
    if (reducedMotion()) return
    const el = ref.current
    if (!el) return

    let timer
    let burst
    let nextType = 0
    const start = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const type = nextType
        nextType = (nextType + 1) % 4
        setGlitchType(type)
        setGlitching(true)
        burst = window.setTimeout(() => setGlitching(false), 980)
        start()
      }, 4000)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else {
          window.clearTimeout(timer)
          window.clearTimeout(burst)
          setGlitching(false)
          setGlitchType(-1)
        }
      },
      { threshold: 0.18 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      window.clearTimeout(burst)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`statue-glitch glitch-type-${glitchType} ${glitching ? 'is-glitching' : ''}`}
      aria-label="A marble bust of Amirhossein Jahangir with a brief neon glitch treatment"
      role="img"
    >
      <div className="statue-glitch__neon" aria-hidden="true">
        <span className="statue-glitch__arrow statue-glitch__arrow--left">↢</span>
        <span className="statue-glitch__arrow statue-glitch__arrow--right">↣</span>
      </div>
      <span className="statue-glitch__crown" aria-hidden="true">♛</span>

      <img src={bust} alt="" className="statue-glitch__image statue-glitch__image--base" />
      <img src={bust} alt="" className="statue-glitch__image statue-glitch__image--cyan" />
      <img src={bust} alt="" className="statue-glitch__image statue-glitch__image--magenta" />

      <div className="statue-glitch__slice statue-glitch__slice--one" aria-hidden="true">
        <img src={bust} alt="" className="statue-glitch__image" />
      </div>
      <div className="statue-glitch__slice statue-glitch__slice--two" aria-hidden="true">
        <img src={bust} alt="" className="statue-glitch__image" />
      </div>
      <div className="statue-glitch__slice statue-glitch__slice--three" aria-hidden="true">
        <img src={bust} alt="" className="statue-glitch__image" />
      </div>

      <div className="statue-glitch__scanlines" aria-hidden="true" />
      <div className="statue-glitch__window" aria-hidden="true">
        <span>Necati</span>
        <b>×</b>
        <i />
      </div>
    </div>
  )
}

export default function Bio() {
  return (
    <section className="flex w-full flex-col items-center">
      <Reveal blur={14} y={34} className="w-full flex justify-center">
        <StatueGlitch />
      </Reveal>

      <div className="mt-[28px] flex flex-col items-center">
        <Reveal delay={100}><div className="flex items-center gap-3">
          <img src={waxSealBadge} alt="" className="size-[68px] shrink-0 drop-shadow-[0_5px_22px_rgba(129,38,42,0.14)]" />
          <div className="text-center leading-6">
            <p className="font-satoshi text-xs font-medium text-black opacity-40">Figma Expert</p>
            <p className="font-serif text-base italic text-neutral-800">Amirhossein Jahangir</p>
          </div>
        </div></Reveal>

        <p className="mt-[39px] max-w-[470px] text-center text-[20px] leading-[30px] tracking-[-0.4px] text-black">
          Been designing AI-native fintech and automation products for the better part of a decade — always on a
          mission to make complex systems feel quietly intelligent.
        </p>
      </div>

      <Reveal className="flex w-full justify-center"><ul className="mt-[37px] flex w-full max-w-[537px] flex-col">
        {timeline.map((row) => (
          <li
            key={row.role}
            className="grid grid-cols-3 items-center gap-8 border-b border-black/10 py-3 text-xs leading-[18px]"
          >
            <span className="text-left text-black">{row.role}</span>
            <span className="text-left text-black/50">{row.company}</span>
            <span className="text-right text-black">{row.dates}</span>
          </li>
        ))}
      </ul></Reveal>
    </section>
  )
}
