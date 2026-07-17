import { useEffect, useRef, useState } from 'react'
import iconPrev from '../assets/carousel-icon-prev.svg'
import iconNext from '../assets/carousel-icon-next.svg'
import ocean from '../assets/carousel-ocean.jpg'
import { Reveal, EASE } from './motion'

/* Interactive carousel cards — each one is a tiny live design-tool demo
   (not a static image): a control in the footer changes something in the
   card body. Built from the Figma "all cards" frame (node 164-2974). */

const CARD_W = 524
const CARD_H = 336

/* ── shared bits ─────────────────────────────────────────────────────── */

function CheckMark({ className = '' }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M2.5 6.2 4.7 8.4 9.5 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function XMark({ className = '' }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M3.4 3.4 8.6 8.6M8.6 3.4 3.4 8.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function Badge({ on }) {
  return (
    <span
      className={`grid size-[18px] shrink-0 place-items-center rounded-full ${
        on ? 'bg-[#0a9dff] text-white' : 'bg-[#d5d5d5] text-white'
      }`}
    >
      {on ? <CheckMark className="size-2.5" /> : <XMark className="size-2.5" />}
    </span>
  )
}

/* a Border / Shadow style toggle group */
function Toggle({ options, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex items-center gap-2 rounded-full py-[6px] pl-[6px] pr-[14px] text-[15px] font-medium tracking-[-0.2px] transition ${
              active
                ? 'bg-white text-[#202020] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.08)]'
                : 'text-[#9a9a9a]'
            }`}
          >
            <Badge on={active} />
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2.5">
      <span
        className={`grid size-[22px] place-items-center rounded-[6px] border transition ${
          checked ? 'border-[#0a9dff] bg-[#0a9dff] text-white' : 'border-[#d9d9d9] bg-white'
        }`}
      >
        {checked && <CheckMark className="size-3" />}
      </span>
      <span className="text-[15px] font-medium tracking-[-0.2px] text-[#202020]">{label}</span>
    </button>
  )
}

function FooterBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[36px] items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium tracking-[-0.15px] text-[#202020] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)] transition active:scale-95"
    >
      {children}
    </button>
  )
}

function MonoChip({ children, className = '' }) {
  return (
    <span
      className={`rounded-full bg-[#f4f4f4] px-[12px] py-[5px] font-mono text-[13px] text-[#8d8d8d] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)] ${className}`}
    >
      {children}
    </span>
  )
}

function Frame({ children, footer }) {
  return (
    <div
      className="flex shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">{children}</div>
      {footer && (
        <div className="flex h-[64px] shrink-0 items-center justify-center border-t border-[#e8e8e8] bg-[#fcfcfc] px-5">
          {footer}
        </div>
      )}
    </div>
  )
}

/* ── 1. Details · Animate ────────────────────────────────────────────── */
function DetailsSlide() {
  const [on, setOn] = useState(true)
  return (
    <Frame footer={<FooterBtn onClick={() => setOn((v) => !v)}>Animate</FooterBtn>}>
      <div className="w-[300px] rounded-[14px] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_30px_-12px_rgba(0,0,0,0.18)]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-[-0.2px] text-[#202020]">Details</span>
          <span className="grid size-6 place-items-center rounded-full bg-[#f0f0f0] text-[#8a8a8a]">
            <XMark className="size-3" />
          </span>
        </div>
        <div className="rounded-[10px] border border-[#bfe6ff] bg-[#e9f6ff] p-2.5">
          <span
            className="block h-2.5 rounded-full bg-[#0a9dff] transition-all duration-[600ms]"
            style={{ width: on ? '46%' : '30%', transitionTimingFunction: EASE }}
          />
          <span
            className="mt-2 block h-2.5 rounded-full bg-[#0a9dff] transition-all duration-[700ms]"
            style={{ width: on ? '92%' : '55%', transitionTimingFunction: EASE }}
          />
        </div>
        <span className="mt-3 block h-2.5 w-[80%] rounded-full bg-black/[0.07]" />
        <span className="mt-2 block h-2.5 w-[52%] rounded-full bg-black/[0.07]" />
        <div className="mt-3 border-t border-[#f0f0f0] pt-3">
          <span className="block h-2.5 w-[40%] rounded-full bg-black/[0.07]" />
          <span className="mt-2 block h-2.5 w-[62%] rounded-full bg-black/[0.07]" />
          <span className="mt-2 block h-2.5 w-[75%] rounded-full bg-black/[0.07]" />
        </div>
      </div>
    </Frame>
  )
}

/* ── 2. Text reveal · Block / Sections / Individual ──────────────────── */
const HEAD = ['Build', 'software', 'that', 'never', 'breaks']
function TextRevealSlide() {
  const [mode, setMode] = useState('Individual')
  const [play, setPlay] = useState(0)
  useEffect(() => {
    setPlay((p) => p + 1)
  }, [mode])
  const stagger = mode === 'Block' ? 0 : mode === 'Sections' ? 140 : 70
  return (
    <Frame
      footer={<Toggle options={['Block', 'Sections', 'Individual']} value={mode} onChange={setMode} />}
    >
      <div className="flex h-full w-full flex-col justify-center px-6">
        <h3 className="font-display text-[30px] font-semibold leading-[34px] tracking-[-0.6px] text-[#141414]">
          {HEAD.map((w, i) => (
            <span
              key={`${play}-${i}`}
              className="mr-[0.28em] inline-block will-change-transform"
              style={{
                animation: `card-word-in 620ms ${EASE} both`,
                animationDelay: `${(mode === 'Sections' ? Math.floor(i / 2) : i) * stagger}ms`,
              }}
            >
              {w}
            </span>
          ))}
        </h3>
        <p className="mt-3 max-w-[300px] text-[14px] leading-[19px] tracking-[-0.2px] text-[#8a8a8a]">
          The experience layer for modern product teams. Detect, triage, and fix bugs automatically.
        </p>
        <div className="mt-5 flex gap-2.5">
          <span className="rounded-full bg-black px-3.5 py-2 text-[13px] font-semibold text-white">Request a demo</span>
          <span className="rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-[#202020] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            Join waitlist
          </span>
        </div>
      </div>
    </Frame>
  )
}

/* ── 3. Rotate · CSS keyframe vs transition ──────────────────────────── */
function RotateSlide() {
  const [spin, setSpin] = useState(0)
  return (
    <Frame footer={<FooterBtn onClick={() => setSpin((s) => s + 1)}>Rotate</FooterBtn>}>
      <div className="flex items-start gap-12">
        <div className="flex flex-col items-center gap-4">
          <MonoChip>CSS keyframe</MonoChip>
          <span
            key={spin}
            className="relative block size-[92px] rounded-[18px] bg-[#2b7fff]"
            style={{ animation: spin ? 'card-spin-linear 900ms linear' : undefined }}
          >
            <span className="absolute right-2 top-2 size-3 rounded-full bg-white" />
          </span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <MonoChip>CSS transition</MonoChip>
          <span
            className="relative block size-[92px] rounded-[18px] bg-[#2b7fff]"
            style={{
              transform: `rotate(${spin * 360}deg)`,
              transition: 'transform 900ms cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <span className="absolute right-2 top-2 size-3 rounded-full bg-white" />
          </span>
        </div>
      </div>
    </Frame>
  )
}

/* ── 4. Optical · Geometric / Optical + Show padding ─────────────────── */
function OpticalSlide() {
  const [mode, setMode] = useState('Optical')
  const [pad, setPad] = useState(false)
  const optical = mode === 'Optical'
  return (
    <Frame footer={<Checkbox label="Show Padding" checked={pad} onChange={setPad} />}>
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <div className="flex items-center rounded-full bg-[#f2f2f2] p-1 text-[14px] font-medium">
          {['Geometric', 'Optical'].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setMode(o)}
              className={`rounded-full px-3.5 py-1.5 transition ${
                mode === o ? 'bg-white text-[#202020] shadow-[0_1px_2px_rgba(0,0,0,0.1)]' : 'text-[#8a8a8a]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_0_0_1px_rgba(0,0,0,0.07),0_6px_16px_-8px_rgba(0,0,0,0.25)]">
        {pad && <span className="absolute inset-0 rounded-full ring-2 ring-inset ring-[#ff5fa2]/40" />}
        <span className="text-[17px] font-semibold tracking-[-0.3px] text-[#202020]">Button</span>
        <span
          className="grid size-7 place-items-center rounded-full bg-[#3a3a3a] text-white transition-transform duration-[400ms]"
          style={{ transform: `translateX(${optical ? 1.5 : 0}px)`, transitionTimingFunction: EASE }}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Frame>
  )
}

/* ── 5. Font smoothing · Subpixel / Antialiased ──────────────────────── */
function RenderingSlide() {
  const [mode, setMode] = useState('Antialiased')
  const aa = mode === 'Antialiased'
  return (
    <Frame footer={<Toggle options={['Subpixel', 'Antialiased']} value={mode} onChange={setMode} />}>
      <div className="grid h-full w-full grid-cols-2">
        {[
          { t: 'Subpixel rendering', b: 'Default font smoothing uses subpixel antialiasing on macOS.', on: !aa },
          { t: 'Antialiased rendering', b: 'Grayscale antialiasing produces thinner, crisper light text.', on: aa },
        ].map((p, i) => (
          <div
            key={p.t}
            className={`flex flex-col justify-center px-6 ${i === 0 ? 'border-r border-[#efefef]' : ''}`}
            style={{ WebkitFontSmoothing: p.on ? 'antialiased' : 'auto', MozOsxFontSmoothing: p.on ? 'grayscale' : 'auto' }}
          >
            <p className="text-[19px] font-semibold leading-[24px] tracking-[-0.4px] text-[#1a1a1a]">{p.t}</p>
            <p className="mt-2 text-[14px] leading-[19px] tracking-[-0.1px] text-[#8a8a8a]">{p.b}</p>
            <span className="mt-3">
              <Badge on={p.on} />
            </span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ── 6. Elevation · Border / Shadow + Show background ────────────────── */
function ElevationSlide() {
  const [mode, setMode] = useState('Shadow')
  const [bg, setBg] = useState(false)
  const shadow = mode === 'Shadow'
  return (
    <Frame footer={<Checkbox label="Show background" checked={bg} onChange={setBg} />}>
      <div
        className="grid size-full place-items-center transition-colors duration-300"
        style={{ background: bg ? '#f4f6f8' : 'transparent' }}
      >
        <div className="flex flex-col items-center gap-6">
          <span
            className="size-24 rounded-[22px] bg-white transition-all duration-300"
            style={{
              boxShadow: shadow ? '0 18px 40px -12px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.06)' : 'none',
              border: shadow ? '1px solid transparent' : '1.5px solid #d7d7d7',
            }}
          />
          <Toggle options={['Border', 'Shadow']} value={mode} onChange={setMode} />
        </div>
      </div>
    </Frame>
  )
}

/* ── 7. Blend · icon filter demo ─────────────────────────────────────── */
const FILTERS = [
  { key: 'None', css: 'none' },
  { key: 'Blend', css: 'saturate(1.6) hue-rotate(-18deg)' },
  { key: 'Noise', css: 'contrast(1.35) brightness(1.08)' },
]
function BlendSlide() {
  const [filter, setFilter] = useState('None')
  const [play, setPlay] = useState(0)
  const css = FILTERS.find((f) => f.key === filter).css
  return (
    <Frame footer={<FooterBtn onClick={() => setPlay((p) => p + 1)}>▶ Play</FooterBtn>}>
      <div className="flex flex-col items-center gap-7">
        <div key={play} className="relative size-[92px]" style={{ filter: css }}>
          <span
            className="absolute left-0 top-0 size-[62px] rounded-[16px] bg-[#2b7fff]"
            style={{ animation: play ? 'card-blend-a 900ms cubic-bezier(0.34,1.56,0.64,1)' : undefined }}
          />
          <span
            className="absolute bottom-0 right-0 size-[62px] rounded-[16px] bg-[#111318] mix-blend-multiply"
            style={{ animation: play ? 'card-blend-b 900ms cubic-bezier(0.34,1.56,0.64,1)' : undefined }}
          />
        </div>
        <div className="flex items-center gap-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`grid size-9 place-items-center rounded-full transition ${
                filter === f.key ? 'bg-[#eaf4ff] text-[#0a9dff]' : 'bg-[#f2f2f2] text-[#9a9a9a]'
              }`}
              title={f.key}
            >
              {f.key === 'None' ? (
                <XMark className="size-3.5" />
              ) : f.key === 'Blend' ? (
                <svg viewBox="0 0 20 20" className="size-4" fill="none">
                  <circle cx="8" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="size-4" fill="currentColor">
                  {[4, 8, 12, 16].map((y) =>
                    [4, 8, 12, 16].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" />),
                  )}
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </Frame>
  )
}

/* ── 8. Counter · count-up + separator ───────────────────────────────── */
function CounterSlide() {
  const [sep, setSep] = useState(false)
  const [n, setN] = useState(1000)
  const raf = useRef(0)
  const run = () => {
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 1100)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * 1000))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    setN(0)
    raf.current = requestAnimationFrame(tick)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const shown = sep ? n.toLocaleString('en-US') : String(n)
  return (
    <Frame footer={<FooterBtn onClick={run}>▶ Play</FooterBtn>}>
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-[14px] bg-white px-6 py-2.5 font-display text-[38px] font-semibold tabular-nums tracking-[-1px] text-[#141414] shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_8px_20px_-10px_rgba(0,0,0,0.18)]">
          {shown}
        </span>
        <button type="button" onClick={() => setSep((v) => !v)} title="Thousands separator">
          <Badge on={sep} />
        </button>
      </div>
    </Frame>
  )
}

/* ── 9. Padding · nested boxes + Show values ─────────────────────────── */
function PaddingSlide() {
  const [show, setShow] = useState(true)
  return (
    <Frame footer={<Checkbox label="Show Values" checked={show} onChange={setShow} />}>
      <div className="relative">
        {show && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-[#bfe0ff] bg-white px-2.5 py-1 font-mono text-[11px] text-[#0a9dff]">
            20px
          </span>
        )}
        <div className="relative size-[150px] rounded-[22px] border border-[#e6e6e6] bg-[#f6f6f6] p-5">
          {show && (
            <span className="absolute right-3 top-2 rounded-full bg-white px-2 py-0.5 font-mono text-[11px] text-[#202020] shadow-sm">
              12px
            </span>
          )}
          <div className="size-full rounded-[14px] border border-[#e6e6e6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]" />
        </div>
        <span className="mt-4 block text-center font-mono text-[13px] text-[#8d8d8d]">padding: 8px</span>
      </div>
    </Frame>
  )
}

/* ── 10. Border · image + Show border ────────────────────────────────── */
function BorderSlide() {
  const [border, setBorder] = useState(false)
  return (
    <Frame footer={<Checkbox label="Show Border" checked={border} onChange={setBorder} />}>
      <div
        className="size-40 overflow-hidden rounded-[28px] transition-all duration-300"
        style={{ boxShadow: border ? '0 0 0 4px #2b7fff, 0 0 0 6px rgba(43,127,255,0.2)' : '0 0 0 0 transparent' }}
      >
        <img src={ocean} alt="" className="size-full object-cover" />
      </div>
    </Frame>
  )
}

const SLIDES = [
  DetailsSlide,
  TextRevealSlide,
  RotateSlide,
  OpticalSlide,
  RenderingSlide,
  ElevationSlide,
  BlendSlide,
  CounterSlide,
  PaddingSlide,
  BorderSlide,
]
const SLIDE_W = CARD_W
const SLIDE_GAP = 14
const PITCH = SLIDE_W + SLIDE_GAP

export default function WorkIntro() {
  const [idx, setIdx] = useState(1) // start on the second card, neighbors peeking
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  // scale the fixed-size cards down so the active card always fits on screen
  const s = Math.min(1, (vw - 24) / SLIDE_W)
  const prev = () => setIdx((i) => Math.max(0, i - 1))
  const next = () => setIdx((i) => Math.min(SLIDES.length - 1, i + 1))
  return (
    <section id="work" className="flex w-full flex-col items-center pt-[111px]">
      <Reveal>
        <h2 className="pb-[21px] text-center font-display text-[26px] font-medium leading-[34px] tracking-[-0.2297px] text-[#202020] sm:text-[32px] sm:leading-[40px]">
          What Makes me a exceptional designer?
        </h2>
      </Reveal>

      <Reveal delay={80}>
        <p className="max-w-[680px] text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
          I think <em className="font-serif font-semibold italic">a lot</em> about what makes an interface feel great.
        </p>
      </Reveal>
      <p className="mt-[22px] max-w-[680px] text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
        When you go from using a good product to a great one, you can{' '}
        <em className="font-serif italic">feel</em> the difference. It's often hard to point to what makes it
        though.
      </p>
      <p className="mt-[22px] max-w-[680px] text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
        It's usually not a single thing, but instead a lot of small things that add up.
      </p>

      {/* Carousel: viewport clips at the column edges, neighbors peek */}
      <Reveal delay={120} className="w-full">
        <div className="relative mt-[30px] w-full overflow-hidden" style={{ height: CARD_H * s }}>
          <div
            className="flex w-max items-start gap-[14px]"
            style={{
              marginLeft: '50%',
              transformOrigin: 'left top',
              transform: `scale(${s}) translateX(${-SLIDE_W / 2 - idx * PITCH}px)`,
              transition: `transform 700ms ${EASE}`,
              willChange: 'transform',
            }}
          >
            {SLIDES.map((Slide, i) => (
              <div
                key={i}
                style={{
                  opacity: i === idx ? 1 : 0.5,
                  filter: i === idx ? 'none' : 'blur(0.5px)',
                  transition: `opacity 500ms ${EASE}, filter 500ms ${EASE}`,
                  pointerEvents: i === idx ? 'auto' : 'none',
                }}
              >
                <Slide />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-[32px] flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          disabled={idx === 0}
          className="flex size-7 items-center justify-center rounded-full bg-white shadow-[0_0_0_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.04)] transition-opacity disabled:opacity-40"
        >
          <img src={iconPrev} alt="" className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={next}
          disabled={idx === SLIDES.length - 1}
          className="flex size-7 items-center justify-center rounded-full bg-white shadow-[0_0_0_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.04)] transition-opacity disabled:opacity-40"
        >
          <img src={iconNext} alt="" className="size-4" />
        </button>
      </div>

      <Reveal className="w-full">
        <p className="mx-auto mt-[34px] w-full max-w-[640px] text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
          In the age of artificial intelligence, shipping fast is no longer an advantage. When anything can be
          replicated in minutes, just building something <em className="font-serif italic">isn't</em> enough.
        </p>
        <p className="mx-auto mt-[20px] w-full max-w-[640px] text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
          Products that are going to stand out and last are those that are built extremely well, with intent and
          extraordinary <em className="font-serif italic">care</em>.
        </p>
        <p className="mx-auto mt-[20px] w-full max-w-[640px] text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
          That's what <em className="font-serif italic">Amirhossein</em> focuses on.
        </p>
      </Reveal>
    </section>
  )
}
