import { useEffect, useState } from 'react'
import headshot from '../assets/headshot.png'
import { EASE } from './motion'

const links = ['Work', 'Services', 'Pricing', 'Blog']

export default function Navigation() {
  // compact once the hero section has been scrolled past
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 550)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* spacer preserves the original in-flow height (pt-5 + 45px pill) */}
      <div className="h-[65px]" />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center pt-5">
        <nav
          className="pointer-events-auto flex items-center rounded-[32px] border border-[#dedede] bg-white/85 px-[13px] backdrop-blur-md"
          style={{
            height: compact ? 40 : 45,
            gap: compact ? 20 : 64,
            boxShadow: compact ? '0 8px 24px -12px rgba(0,0,0,0.18)' : '0 0 0 rgba(0,0,0,0)',
            transition: `height 450ms ${EASE}, gap 450ms ${EASE}, box-shadow 450ms ${EASE}`,
          }}
        >
          <a href="#" className="flex shrink-0 items-center gap-2">
            <img
              src={headshot}
              alt="Amirhossein Jahangir"
              className="rounded-full object-cover"
              style={{ width: compact ? 23 : 27, height: compact ? 23 : 27, transition: `width 450ms ${EASE}, height 450ms ${EASE}` }}
            />
            <span className="whitespace-nowrap font-satoshi text-[14px] font-bold leading-[15.68px] tracking-[-0.14px] text-black">
              Amirhossein Jahangir
            </span>
          </a>

          <div className="flex items-center gap-4">
            {/* the link group collapses away in compact mode */}
            <div
              className="flex items-center gap-4 overflow-hidden"
              style={{
                maxWidth: compact ? 0 : 320,
                opacity: compact ? 0 : 1,
                filter: compact ? 'blur(4px)' : 'blur(0px)',
                transition: `max-width 450ms ${EASE}, opacity 350ms ${EASE}, filter 350ms ${EASE}`,
              }}
              aria-hidden={compact}
            >
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  tabIndex={compact ? -1 : 0}
                  className="whitespace-nowrap font-satoshi text-[14px] font-bold leading-[15.68px] tracking-[-0.14px] text-black"
                >
                  {link}
                </a>
              ))}
            </div>

            <a
              href="https://calendly.com/apply-jahan/30min"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 whitespace-nowrap rounded-[24px] border border-[#dedede] bg-[#fafafa] px-[13px] font-satoshi text-[14px] font-bold leading-[15.68px] tracking-[-0.14px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              style={{
                paddingTop: compact ? 5 : 7,
                paddingBottom: compact ? 5 : 7,
                transition: `padding 450ms ${EASE}`,
              }}
            >
              Book a call
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
