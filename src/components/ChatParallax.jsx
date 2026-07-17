import { useEffect, useRef, useState } from 'react'
import { clamp01, reducedMotion } from './motion'

/* bridge.surf-style scroll parallax: three columns of chat cards that
   drift upward at different speeds while the page scrolls past them.
   Each card is a real exchange — a client asking or assigning work,
   and Amirhossein answering. */

function BubbleIn({ children }) {
  return (
    <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-[#f0f0f0] px-3.5 py-2 text-[13px] leading-[18px] tracking-[-0.1px] text-[#202020]">
      {children}
    </div>
  )
}

function BubbleOut({ children }) {
  return (
    <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-[#2b7fff] px-3.5 py-2 text-[13px] leading-[18px] tracking-[-0.1px] text-white">
      {children}
    </div>
  )
}

function FileChip({ name, note }) {
  return (
    <div className="flex items-center gap-2 self-start rounded-xl border border-[#e3f4e6] bg-[#f2faf3] px-3 py-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#dff1e2] text-[13px]">📄</span>
      <span className="flex flex-col">
        <span className="text-[12px] font-medium leading-4 text-[#202020]">{name}</span>
        {note && <span className="text-[11px] leading-4 text-[#8d8d8d]">{note}</span>}
      </span>
    </div>
  )
}

function FileRow({ name, isNew }) {
  return (
    <li className="flex items-center gap-2 border-b border-[#f2f2f2] py-[5px] last:border-b-0">
      <span className="text-[12px]">🗂</span>
      <span className="text-[12px] leading-4 text-[#404040]">{name}</span>
      {isNew && (
        <span className="rounded bg-[#e8f7ec] px-1 text-[9px] font-bold uppercase leading-[14px] tracking-wide text-[#2fae54]">
          new
        </span>
      )}
    </li>
  )
}

function AudioBar({ label }) {
  return (
    <div className="flex items-center gap-2 self-start rounded-full bg-[#f0f0f0] py-1.5 pl-1.5 pr-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2b7fff] text-[9px] text-white">▶</span>
      <span className="flex h-4 items-center gap-[2px]">
        {[6, 10, 14, 9, 12, 7, 13, 10, 6, 11, 8, 14, 9, 5].map((h, i) => (
          <span key={i} className="w-[2px] rounded-full bg-[#b9b9b9]" style={{ height: `${h}px` }} />
        ))}
      </span>
      <span className="text-[10px] text-[#8d8d8d]">{label}</span>
    </div>
  )
}

function Card({ children }) {
  return (
    <div className="flex w-full flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.04),0_12px_24px_-12px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  )
}

const COLUMNS = [
  {
    speed: 0.35,
    offset: 40,
    cards: [
      (
        <Card key="c1a">
          <BubbleIn>Our fintech dashboard feels cluttered — can you take a pass at it?</BubbleIn>
          <BubbleOut>
            Mapped your key flows first, then cut the noise. The numbers are scannable again.
          </BubbleOut>
          <FileChip name="Dashboard_v2.fig" note="1.2 MB" />
        </Card>
      ),
      (
        <Card key="c1b">
          <BubbleIn>The redesign landed perfectly with the board, thank you!</BubbleIn>
          <BubbleOut>Glad it worked — want the same system carried into the investor deck?</BubbleOut>
        </Card>
      ),
    ],
  },
  {
    speed: 0.62,
    offset: 120,
    cards: [
      (
        <Card key="c2a">
          <BubbleIn>We need a design system so the team stops shipping inconsistent UI.</BubbleIn>
          <BubbleOut>
            Audited every component, then delivered tokens, type scale, and a shared Figma library.
          </BubbleOut>
          <AudioBar label="Walkthrough · 00:32" />
        </Card>
      ),
      (
        <Card key="c2b">
          <BubbleIn>Onboarding feels like filling out a form. Can it feel lighter?</BubbleIn>
          <BubbleOut>Turned six fields into a three-step conversation — drop-off is already down.</BubbleOut>
          <FileChip name="Onboarding_flow.mp4" note="00:48" />
        </Card>
      ),
    ],
  },
  {
    speed: 0.45,
    offset: 80,
    cards: [
      (
        <Card key="c3a">
          <BubbleIn>Can you help us organize the design files across projects? It's chaos.</BubbleIn>
          <BubbleOut>Organized the whole workspace — here's what changed.</BubbleOut>
          <ul className="w-full rounded-xl border border-[#f0f0f0] bg-[#fcfcfc] px-3 py-1.5">
            <FileRow name="Brand guidelines" />
            <FileRow name="Tokens.json" isNew />
            <FileRow name="Fintech app — v3" isNew />
            <FileRow name="Automation flows" />
            <FileRow name="Archive 2024" />
          </ul>
        </Card>
      ),
      (
        <Card key="c3b">
          <BubbleIn>Users keep missing the export button on mobile.</BubbleIn>
          <BubbleOut>Moved it into the primary toolbar with a shortcut — testing with users this week.</BubbleOut>
        </Card>
      ),
    ],
  },
]

export default function ChatParallax() {
  const ref = useRef(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    if (reducedMotion()) return
    const el = ref.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      // 0 when the section's top enters the bottom of the viewport,
      // 1 when its bottom leaves the top — classic parallax window
      const total = window.innerHeight + r.height
      setT(clamp01((window.innerHeight - r.top) / total))
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // total drift available to the fastest column
  const drift = 260

  return (
    <section
      ref={ref}
      className="relative mx-auto mt-[72px] w-full max-w-[1100px] overflow-hidden px-5"
      style={{
        height: '560px',
        maskImage: 'linear-gradient(to bottom, transparent 0, #000 7%, #000 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 7%, #000 90%, transparent 100%)',
      }}
      aria-label="Snippets of client conversations"
    >
      <div className="flex items-start justify-center gap-4">
        {COLUMNS.map((col, i) => (
          <div
            key={i}
            className={`${i === 1 ? 'hidden min-[540px]:flex' : i === 2 ? 'hidden md:flex' : 'flex'} w-full max-w-[340px] flex-col gap-4 min-[540px]:w-1/3 min-[540px]:min-w-0`}
            style={{
              transform: `translate3d(0, ${col.offset - t * drift * col.speed}px, 0)`,
              willChange: 'transform',
            }}
          >
            {col.cards}
          </div>
        ))}
      </div>
    </section>
  )
}
