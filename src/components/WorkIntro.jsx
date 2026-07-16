import { useState } from 'react'
import iconX from '../assets/carousel-icon-x.svg'
import iconCheck from '../assets/carousel-icon-check.svg'
import iconCheck2 from '../assets/carousel-icon-check2.svg'
import icon2 from '../assets/carousel-icon-2.svg'
import icon3 from '../assets/carousel-icon-3.svg'
import icon4 from '../assets/carousel-icon-4.svg'
import icon5 from '../assets/carousel-icon-5.svg'
import icon6 from '../assets/carousel-icon-6.svg'
import icon7 from '../assets/carousel-icon-7.svg'
import iconPrev from '../assets/carousel-icon-prev.svg'
import iconNext from '../assets/carousel-icon-next.svg'
import imageBorder from '../assets/carousel-image-border.png'
import { Reveal, EASE } from './motion'

/* One text panel inside the main slide: icon + chip + title + body,
   bounded left/right by vertical guide lines like the design file. */
function Panel({ icon, iconBg, chip, chipBordered }) {
  return (
    <div className="relative flex h-full flex-1 items-center justify-center">
      <div className="flex w-[205px] flex-col items-start">
        <span className={`flex size-7 items-center justify-center rounded-full ${iconBg}`}>
          <img src={icon} alt="" className="size-5" />
        </span>
        <span
          className={`mt-2 rounded-full px-[10px] py-[3px] font-mono text-[13px] italic text-[#646464] ${
            chipBordered ? 'border border-[#e8e8e8] bg-white' : 'bg-white shadow-sm'
          }`}
        >
          {chip}
        </span>
        <p className="pt-2 text-[18px] font-medium leading-[24.75px] tracking-[-0.4395px] text-[#202020]">
          Designing interfaces that feel natural and intuitive
        </p>
        <p className="pt-1 text-sm leading-5 tracking-[-0.1504px] text-[#8d8d8d]">
          Great design is invisible. It guides users without them ever noticing.
        </p>
      </div>
    </div>
  )
}

/* The main slide: two panels separated by a middle gutter with guide lines,
   and the Width slider bar at the bottom. */
function PanelsSlide() {
  return (
    <div className="flex h-[310px] w-[524px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-1 items-stretch">
        <Panel icon={iconX} iconBg="bg-[#f0f0f0]" chip="wrap" />
        <div className="relative w-[74px] shrink-0">
          <span className="absolute left-0 top-0 h-full w-px bg-[#ececec]" />
          <span className="absolute right-0 top-0 h-full w-px bg-[#ececec]" />
        </div>
        <Panel icon={iconCheck} iconBg="bg-[rgba(0,166,244,0.1)]" chip="balance + pretty" chipBordered />
      </div>
      <div className="flex h-[67px] shrink-0 items-center gap-3 border-t border-[#e8e8e8] bg-[#fcfcfc] px-4">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium tracking-[-0.15px] text-[#202020]">Width</span>
            <span className="font-mono text-[13px] italic text-[#838383]">220px</span>
          </div>
          <div className="relative flex items-center">
            <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#f0f0f0]">
              <div className="h-[5px] w-[62%] bg-[#202020]" />
            </div>
            <span className="absolute left-[60%] top-1/2 size-3.5 -translate-y-1/2 rotate-45 rounded-[4px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.12)]" />
          </div>
        </div>
        <span className="h-6 w-px bg-[#e8e8e8]" />
        <button
          type="button"
          className="h-[28px] shrink-0 rounded-full bg-white px-3 text-[13px] font-medium tracking-[-0.15px] text-[#202020] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]"
        >
          Hide guides
        </button>
      </div>
    </div>
  )
}

function PaddingSlide() {
  return (
    <div className="flex h-[310px] w-[524px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <span className="rounded-full bg-white px-[10px] py-[3px] font-mono text-[13px] italic text-[#646464] shadow-sm">
          padding: 8px
        </span>
        <div className="flex items-center justify-center gap-7">
          <div className="flex flex-col items-center gap-2.5">
            <div className="relative size-28 rounded-xl bg-white shadow-sm">
              <img src={icon2} alt="" className="absolute -left-1 -top-1 size-6" />
              <span className="absolute -left-11 -top-5 flex h-5 w-11 items-center justify-center rounded-full border border-[#e8e8e8] bg-[#fcfcfc] font-mono text-[10px] font-medium text-[#8d8d8d]">
                12px
              </span>
              <div className="absolute left-2 top-2 size-24 rounded-xl border border-[#e8e8e8] bg-[#f6f6f6]">
                <img src={icon3} alt="" className="absolute -left-1 -top-1 size-[18px]" />
                <span className="absolute left-2 top-2 flex h-5 w-11 items-center justify-center rounded-full bg-white font-mono text-[10px] font-medium text-[#202020] shadow-sm">
                  12px
                </span>
              </div>
            </div>
            <span className="flex size-5 items-center justify-center rounded-full bg-[#f0f0f0]">
              <img src={icon4} alt="" className="size-3.5" />
            </span>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <div className="relative size-28 rounded-[18px] bg-white shadow-sm">
              <img src={icon5} alt="" className="absolute -right-6 -top-1 size-6" />
              <span className="absolute -top-5 left-[108px] flex h-5 w-11 items-center justify-center rounded-full border border-[#00a6f4] bg-[rgba(0,166,244,0.05)] font-mono text-[10px] font-medium text-[#00a6f4]">
                20px
              </span>
              <div className="absolute left-2 top-2 size-24 rounded-xl border border-[#e8e8e8] bg-[#f6f6f6]">
                <img src={icon6} alt="" className="absolute -right-4 -top-1 size-[18px]" />
                <span className="absolute left-[54px] top-2 flex h-5 w-11 items-center justify-center rounded-full bg-white font-mono text-[10px] font-medium text-[#202020] shadow-sm">
                  12px
                </span>
              </div>
            </div>
            <span className="flex size-5 items-center justify-center rounded-full bg-[rgba(0,166,244,0.1)]">
              <img src={icon7} alt="" className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-[67px] shrink-0 items-center justify-center border-t border-[#e8e8e8] bg-[#fcfcfc] px-4">
        <div className="flex items-center gap-2">
          <span className="size-5 rounded-md border border-[#00bcff] bg-[#00bcff]" />
          <span className="text-[13px] font-medium tracking-[-0.15px] text-[#202020]">Show Values</span>
        </div>
      </div>
    </div>
  )
}

function BorderSlide() {
  return (
    <div className="flex h-[310px] w-[524px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-1 items-center justify-center">
        <div className="size-40 overflow-hidden rounded-3xl">
          <img src={imageBorder} alt="" className="size-full object-cover" />
        </div>
      </div>
      <div className="flex h-[67px] w-full shrink-0 items-center justify-center border-t border-[#e8e8e8] bg-[#fcfcfc] px-4">
        <div className="flex items-center gap-2">
          <span className="size-5 rounded-md border border-[#e8e8e8] bg-white" />
          <span className="text-[13px] font-medium tracking-[-0.15px] text-[#202020]">Show Border</span>
        </div>
      </div>
    </div>
  )
}

function ValuesSlide() {
  return (
    <div className="flex h-[310px] w-[524px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex-1" />
      <div className="flex h-[67px] shrink-0 items-center justify-center border-t border-[#e8e8e8] bg-[#fcfcfc] px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-[#00bcff]">
            <img src={iconCheck2} alt="" className="size-3" />
          </span>
          <span className="text-[13px] font-medium tracking-[-0.15px] text-[#202020]">Show Values</span>
        </div>
      </div>
    </div>
  )
}


function RadiusSlide() {
  return (
    <div className="flex h-[310px] w-[524px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <span className="rounded-full bg-white px-[10px] py-[3px] font-mono text-[13px] italic text-[#646464] shadow-sm">
          radius: 24px
        </span>
        <div className="relative size-32 rounded-[24px] border border-[#e8e8e8] bg-[#f6f6f6]">
          {[
            'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
            'right-0 top-0 translate-x-1/2 -translate-y-1/2',
            'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
            'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
          ].map((pos) => (
            <span key={pos} className={`absolute ${pos} size-2 rounded-[2px] border border-[#00a6f4] bg-white`} />
          ))}
          <span className="absolute -top-6 left-1/2 flex h-5 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-[#00a6f4] bg-[rgba(0,166,244,0.05)] font-mono text-[10px] font-medium text-[#00a6f4]">
            24px
          </span>
        </div>
      </div>
      <div className="flex h-[67px] shrink-0 items-center justify-center border-t border-[#e8e8e8] bg-[#fcfcfc] px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-[#00bcff]">
            <img src={iconCheck2} alt="" className="size-3" />
          </span>
          <span className="text-[13px] font-medium tracking-[-0.15px] text-[#202020]">Show Handles</span>
        </div>
      </div>
    </div>
  )
}

function ShadowSlide() {
  return (
    <div className="flex h-[310px] w-[524px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <span className="rounded-full bg-white px-[10px] py-[3px] font-mono text-[13px] italic text-[#646464] shadow-sm">
          shadow: soft
        </span>
        <div className="flex items-center gap-8">
          <div className="size-24 rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]" />
          <div className="size-24 rounded-2xl bg-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.06)]" />
        </div>
      </div>
      <div className="flex h-[67px] shrink-0 items-center justify-center border-t border-[#e8e8e8] bg-[#fcfcfc] px-4">
        <div className="flex items-center gap-2">
          <span className="size-5 rounded-md border border-[#e8e8e8] bg-white" />
          <span className="text-[13px] font-medium tracking-[-0.15px] text-[#202020]">Elevate</span>
        </div>
      </div>
    </div>
  )
}

const SLIDES = [BorderSlide, PanelsSlide, PaddingSlide, RadiusSlide, ShadowSlide, ValuesSlide]
const SLIDE_W = 524
const SLIDE_GAP = 14
const PITCH = SLIDE_W + SLIDE_GAP

export default function WorkIntro() {
  const [idx, setIdx] = useState(1) // start on the panels slide, neighbors peeking
  const prev = () => setIdx((i) => Math.max(0, i - 1))
  const next = () => setIdx((i) => Math.min(SLIDES.length - 1, i + 1))
  return (
    <section className="flex w-full flex-col items-center pt-[111px]">
      <Reveal>
        <h2 className="pb-[21px] text-center font-display text-[32px] font-medium leading-[40px] tracking-[-0.2297px] text-[#202020]">
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

      {/* Carousel: viewport clips at the column edges, neighbors peek ~80px */}
      <Reveal delay={120} className="w-full">
      <div className="relative mt-[30px] w-full overflow-hidden">
        <div
          className="flex w-max items-start gap-[14px]"
          style={{
            marginLeft: '50%',
            transform: `translateX(${-SLIDE_W / 2 - idx * PITCH}px)`,
            transition: `transform 700ms ${EASE}`,
            willChange: 'transform',
          }}
        >
          {SLIDES.map((Slide, i) => (
            <div
              key={i}
              style={{
                opacity: i === idx ? 1 : 0.55,
                filter: i === idx ? 'none' : 'blur(0.5px)',
                transition: `opacity 500ms ${EASE}, filter 500ms ${EASE}`,
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
      <p className="mt-[34px] w-full text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
        In the age of artificial intelligence, shipping fast is no longer an advantage. When anything can be
        replicated in minutes, just building something <em className="font-serif italic">isn't</em> enough.
      </p>
      <p className="mt-[20px] w-full text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
        Products that are going to stand out and last are those that are built extremely well, with intent and
        extraordinary <em className="font-serif italic">care</em>.
      </p>
      <p className="mt-[20px] w-full text-center text-lg leading-[28px] tracking-[-0.4395px] text-black">
        That's what <em className="font-serif italic">Interfaces</em> focuses on.
      </p>
      </Reveal>
    </section>
  )
}
