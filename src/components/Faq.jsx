import { useState } from 'react'
import faqIcon from '../assets/faq-icon.svg'
import { Reveal } from './motion'

const questions = [
  'Is this a course?',
  'Is Interfaces a physical magazine?',
  'What level of experience is this for?',
  'Who is the magazine for?',
]

export default function Faq() {
  const [open, setOpen] = useState(null)

  return (
    <section className="mx-auto flex w-full max-w-[573px] flex-col">
      <div className="flex w-full flex-col">
        {questions.map((question, i) => (
          <Reveal key={question} delay={i * 90}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex items-center justify-between border-b border-dashed border-[#e8e8e8] py-[13px] text-left last:border-b-0"
          >
            <span className="text-[18px] font-medium leading-[28px] tracking-[-0.4395px] text-[#2e2e2e]">{question}</span>
            <img
              src={faqIcon}
              alt=""
              className="size-[18px] transition-transform"
              style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}
            />
          </button>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
