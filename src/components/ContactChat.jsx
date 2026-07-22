import { useRef, useState } from 'react'
import iconCopy from '../assets/icon-copy.svg'
import iconLinkedin from '../assets/icon-linkedin.svg'
import iconGithub from '../assets/icon-github.svg'
import { useScrollProgress, seg, SPRING, EASE, reducedMotion } from './motion'

const EMAIL = 'apply.jahan@gmail.com'

/* iMessage typing indicator: gray bubble with three pulsing dots */
function TypingDots() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex h-[33px] w-[58px] items-center justify-center gap-[4px] rounded-t-[18px] rounded-bl-[5px] rounded-br-[18px] bg-[#f0f1f3]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-[7px] rounded-full bg-[#a8adb4]"
            style={{ animation: `typing-dot 1.2s ease-in-out ${i * 0.18}s infinite` }}
          />
        ))}
      </div>
    </div>
  )
}

/* One conversation step. Received messages pop from the bottom-left corner,
   sent ones from the bottom-right — the iMessage spring. */
function Step({ from, shown, typing, children }) {
  const isMe = from === 'me'
  if (typing) return <TypingDots />
  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : `translateY(14px) scale(0.4)`,
          filter: shown ? 'blur(0px)' : 'blur(6px)',
          transformOrigin: isMe ? 'bottom right' : 'bottom left',
          transition: `transform 480ms ${SPRING}, opacity 320ms ${EASE}, filter 380ms ${EASE}`,
          willChange: 'transform, opacity, filter',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Bubble({ from, children }) {
  const isMe = from === 'me'
  return (
    <p
      className={`max-w-[420px] rounded-t-[18px] px-3.5 py-[7px] font-chat text-[14px] leading-[19.6px] ${
        isMe
          ? 'rounded-bl-[18px] rounded-br-[5px] bg-[#3b5bff] text-white'
          : 'rounded-bl-[5px] rounded-br-[18px] bg-[#f0f1f3] text-[#111]'
      }`}
    >
      {children}
    </p>
  )
}

export default function ContactChat() {
  const [copied, setCopied] = useState(false)
  const wrapRef = useRef(null)
  const p = useScrollProgress(wrapRef)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — no-op
    }
  }

  /* The conversation, in scroll order. Blocks (email, buttons) are
     delivered like messages too. */
  const steps = [
    { from: 'me', node: <Bubble from="me">yo your portfolio is clean af 🔥</Bubble> },
    { from: 'me', node: <Bubble from="me">what's your story?</Bubble> },
    { from: 'them', node: <Bubble from="them">haha thanks 🙏 honestly i'm fully self-taught.</Bubble> },
    {
      from: 'them',
      node: (
        <Bubble from="them">
          found something beautiful on the internet one day, got obsessed figuring out how it worked, and never
          really stopped.
        </Bubble>
      ),
    },
    {
      from: 'them',
      node: <Bubble from="them">now i design & build product interfaces that look premium, feel fast, and make complex flows simple.</Bubble>,
    },
    { from: 'me', node: <Bubble from="me">i built a site with AI but it's kind of a mess 😅</Bubble> },
    { from: 'me', node: <Bubble from="me">can you clean it, fix it, and redesign it properly?</Bubble> },
    {
      from: 'them',
      node: (
        <Bubble from="them">
          yes, don't worry, i'll save it 🙌 turning messy, complex products into clean, shippable design is literally my thing.
        </Bubble>
      ),
    },
    { from: 'me', node: <Bubble from="me">that's sick. how do i reach you?</Bubble> },
    { from: 'them', node: <Bubble from="them">fastest way is email, keep it short 👇</Bubble> },
    {
      from: 'them',
      node: (
        <div className="rounded-2xl bg-[#f0f1f3] px-3.5 py-2.5 font-chat text-[14px] leading-[22.4px] text-[#111]">
          {EMAIL}
        </div>
      ),
    },
    {
      from: 'them',
      typingless: true,
      node: (
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-[31px] items-center justify-center gap-2 rounded-full bg-white px-3 font-inter font-medium text-[13px] leading-none text-[#111] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
        >
          <img src={iconCopy} alt="" className="size-3.5" />
          {copied ? 'Copied!' : 'Copy'}
          <kbd className="rounded-[5px] bg-white px-1 py-px font-mono text-[10px] leading-4 text-[#555] shadow-[0_1px_0_rgba(0,0,0,0.08)]">
            C
          </kbd>
        </button>
      ),
    },
    { from: 'them', node: <Bubble from="them">or find me around here 👋</Bubble> },
    {
      from: 'them',
      typingless: true,
      node: (
        <a
          href="https://www.linkedin.com/in/jahan-amir/"
          target="_blank"
          rel="noreferrer"
          className="flex h-[31px] items-center justify-center gap-2 rounded-full bg-white px-3 font-inter font-medium text-[13px] leading-none text-[#111] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
        >
          <img src={iconLinkedin} alt="" className="size-3.5" />
          Connect on LinkedIn
        </a>
      ),
    },
    {
      from: 'them',
      typingless: true,
      node: (
        <a
          href="https://github.com/Its-jahan"
          target="_blank"
          rel="noreferrer"
          className="flex h-[31px] items-center justify-center gap-2 rounded-full bg-white px-3 font-inter font-medium text-[13px] leading-none text-[#111] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
        >
          <img src={iconGithub} alt="" className="size-3.5" />
          Star me on GitHub
        </a>
      ),
    },
    { from: 'me', node: <Bubble from="me">nice, i'll connect.</Bubble> },
  ]

  const N = steps.length
  const still = reducedMotion()
  // start with the first message already on screen (offset +1) so scrolling
  // into the section shows the conversation immediately, not a blank pane
  const stepFloat = p * (N - 0.2) + 1.0

  return (
    <section id="contact" ref={wrapRef} className="relative w-full" style={{ height: still ? 'auto' : `calc(100vh + ${N * 105}px)` }}>
      <div className={still ? '' : 'sticky top-0 flex h-screen flex-col justify-center'}>
        <div className="mx-auto flex w-full max-w-[573px] flex-col gap-1">
          {steps.map((s, i) => {
            if (still) {
              return (
                <div key={i} className={`flex w-full ${s.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {s.node}
                </div>
              )
            }
            const isThem = s.from === 'them'
            const popAt = i + (isThem && !s.typingless ? 0.72 : 0.25)
            const shown = stepFloat >= popAt
            const typing = isThem && !s.typingless && stepFloat >= i + 0.08 && stepFloat < popAt
            // future steps stay collapsed so the thread grows downward like iMessage
            if (!shown && !typing && stepFloat < i) return null
            return (
              <Step key={i} from={s.from} shown={shown} typing={typing}>
                {s.node}
              </Step>
            )
          })}
        </div>
      </div>
    </section>
  )
}
