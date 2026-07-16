import { useState } from 'react'
import faqIcon from '../assets/faq-icon.svg'
import { Reveal, EASE } from './motion'

const faqs = [
  {
    q: 'Do you take on freelance projects?',
    a: 'Yes — I work with a small number of clients at a time, mostly fintech and automation products. Book a call and I\'ll tell you honestly if there\'s a fit.',
  },
  {
    q: 'What does your process look like?',
    a: 'Discovery first, then flows, then high-fidelity screens with a working prototype. You\'ll see progress every few days, not just once at the end.',
  },
  {
    q: 'What tools do you design with?',
    a: 'Figma for everything static, After Effects for motion, and Claude, Codex and Gemini to reason through complex product logic and prototype faster.',
  },
  {
    q: 'How much experience do you have?',
    a: 'About a decade shipping fintech and automation platforms — from design-lead roles at agencies to running my own practice today.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(null)

  return (
    <section className="mx-auto flex w-full max-w-[573px] flex-col">
      <div className="flex w-full flex-col">
        {faqs.map((item, i) => {
          const isOpen = open === i
          return (
            <Reveal key={item.q} delay={i * 90}>
              <div className="border-b border-dashed border-[#e8e8e8] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-[13px] text-left"
                >
                  <span className="text-[18px] font-medium leading-[28px] tracking-[-0.4395px] text-[#2e2e2e]">
                    {item.q}
                  </span>
                  <img
                    src={faqIcon}
                    alt=""
                    className="size-[18px] shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transitionTimingFunction: EASE }}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', transitionTimingFunction: EASE }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[490px] pb-[18px] pr-8 text-[15px] leading-[22px] tracking-[-0.2px] text-[#6c6c6c]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
