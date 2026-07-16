import jakubLogo from '../assets/jakub-logo.svg'
import { Reveal } from './motion'

function Dot() {
  return (
    <span className="inline-flex size-[9px] shrink-0 items-center justify-center rounded-full bg-[#e0e0e0]">
      <span className="size-[5px] rounded-full bg-white" />
    </span>
  )
}

export default function Hero() {
  return (
    <div className="flex w-full flex-col items-center pt-[106px]">
      <Reveal once duration={950}><div className="flex w-full max-w-[680px] flex-col items-center text-center">
        {/* "Elevating" with the oklch color-code annotation */}
        <div className="relative inline-block">
          <p className="whitespace-nowrap font-display text-[60px] leading-[72px] tracking-[-1.2363px] text-[#18181a]">
            Elevating
          </p>
          <div className="absolute -left-[150px] top-0 flex -translate-y-full flex-col items-start pb-0">
            <div className="flex items-center gap-1.5 rounded-lg bg-white py-1 pl-1 pr-1.5 shadow-[0_0_0_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.04)]">
              <span className="size-4 shrink-0 rounded border border-[#ebebeb] bg-[#fcfcfc]" />
              <span className="whitespace-nowrap font-mono text-xs italic text-[#646464]">oklch(0.991 0 0)</span>
            </div>
            <div className="ml-[55px] flex flex-col items-center">
              <span className="h-3 w-px border-l border-dashed border-[#e0e0e0]" />
              <Dot />
            </div>
          </div>
        </div>

        {/* "Your brand, Engineering" with the boxed callout on Engineering */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <p className="whitespace-nowrap font-display text-[60px] font-medium leading-[72px] tracking-[-1.2363px] text-[#18181a]">
            Your brand,
          </p>
          <span className="relative inline-block">
            <p className="whitespace-nowrap font-display text-[60px] font-medium leading-[72px] tracking-[-1.2363px] text-[#18181a]">
              Engineering
            </p>
            {/* "344 × 58" dimension label above the selection box */}
            <div className="absolute -top-2 right-[28px] flex -translate-y-full flex-col items-center">
              <div className="rounded-lg bg-white px-1.5 py-1 shadow-[0_0_0_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.04)]">
                <span className="whitespace-nowrap font-mono text-xs italic text-[#646464]">344 × 58</span>
              </div>
              <span className="mt-1 h-2 w-px border-l border-dashed border-[#e0e0e0]" />
              <Dot />
            </div>
            <span className="pointer-events-none absolute -inset-1.5 border border-[#2b7fff] bg-[rgba(43,127,255,0.05)]" />
            <span className="pointer-events-none absolute -left-1.5 -top-1.5 size-1.5 -translate-x-1/2 -translate-y-1/2 border border-[#2b7fff] bg-white" />
            <span className="pointer-events-none absolute -right-1.5 -top-1.5 size-1.5 translate-x-1/2 -translate-y-1/2 border border-[#2b7fff] bg-white" />
            <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 size-1.5 -translate-x-1/2 translate-y-1/2 border border-[#2b7fff] bg-white" />
            <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 size-1.5 translate-x-1/2 translate-y-1/2 border border-[#2b7fff] bg-white" />
          </span>
        </div>

        {/* "Design" with the font-name annotation */}
        <div className="relative inline-block">
          <p className="whitespace-nowrap font-serif text-[60px] italic leading-[72px] tracking-[-1.5px] text-black">
            Design
          </p>
          <div className="absolute left-full top-1/2 flex -translate-y-1/2 items-center gap-5 pl-5">
            <span className="h-px w-5 border-t border-dashed border-[#e0e0e0]" />
            <Dot />
            <div className="rounded-lg bg-white px-1.5 py-1 shadow-[0_0_0_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.04)]">
              <span className="whitespace-nowrap font-mono text-xs italic text-[#646464]">
                font-Libre Baskerville
              </span>
            </div>
          </div>
        </div>
      </div></Reveal>

      {/* Byline pill with 32px spacing annotation */}
      <Reveal once delay={150} duration={950}><div className="relative mt-[14px] flex flex-col items-center">
        <div className="flex items-center gap-[6px] rounded-full border border-[#e8e8e8] bg-white py-[3px] pl-[6px] pr-[12px]">
          <span className="flex size-5 items-center justify-center rounded-full bg-[#fcfcfc]">
            <img src={jakubLogo} alt="" className="size-4" />
          </span>
          <span className="whitespace-nowrap font-mono text-[14px] italic leading-[22px] tracking-[-0.27px] text-[#646464]">
            by Amirhossein Jahangir
          </span>
        </div>
        <div className="relative flex h-8 items-center">
          <span className="h-8 w-8 border-l border-r border-[#fb64b6] bg-[rgba(246,51,154,0.1)]" />
          <span className="absolute left-full ml-2 whitespace-nowrap font-mono text-xs italic text-[#f6339a]">32 px</span>
        </div>
      </div></Reveal>

      {/* CTA with "Call To Action" annotation */}
      <Reveal once delay={280} duration={950}><div className="relative inline-block">
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              const rect = contactSection.getBoundingClientRect();
              const targetY = window.scrollY + rect.top + rect.height;
              window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
          }}
          className="inline-flex h-[38px] items-center justify-center rounded-full border border-black bg-black px-4 font-satoshi text-[14px] font-bold leading-[15.68px] tracking-[-0.14px] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_25px_25px_-3.75px_rgba(0,0,0,0.11)]"
        >
          Book a call with me
        </a>
        <div className="absolute left-full top-1/2 flex -translate-y-1/2 items-center gap-2 pl-2">
          <span className="h-px w-4 border-t border-dashed border-[#e0e0e0]" />
          <Dot />
          <div className="rounded-lg bg-white px-1.5 py-1 shadow-[0_0_0_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.06),0_2px_2px_rgba(0,0,0,0.04)]">
            <span className="whitespace-nowrap font-mono text-xs italic text-[#646464]">Call To Action</span>
          </div>
        </div>
      </div></Reveal>
    </div>
  )
}