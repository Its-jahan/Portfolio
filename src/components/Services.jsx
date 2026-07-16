import productDesign from '../assets/service-product-design.png'
import motion from '../assets/service-motion.png'
import accessibility from '../assets/service-accessibility.png'
import chatgptLogo from '../assets/chatgpt-logo.svg'
import aiIcon from '../assets/ai-icon.svg'
import { Reveal } from './motion'

const services = [
  {
    image: productDesign,
    title: 'Fintech & Automation Design',
    body: 'Designing intuitive dashboards, onboarding, and automation flows for complex fintech platforms.',
  },
  {
    title: 'AI-Augmented Workflow',
    body: 'Leveraging AI tools to reason through logic, build prototypes, and ship products faster.',
    isAi: true,
  },
  {
    image: motion,
    title: 'Motion & Prototyping',
    body: 'Building interaction-accurate prototypes so engineering never has to guess timing or states.',
  },
  {
    image: accessibility,
    title: 'Accessibility',
    body: 'Designing WCAG compliant systems by default, embedding accessibility from the first wireframe.',
  },
]

export default function Services() {
  return (
    <section id="services" className="flex w-full flex-col items-center gap-[26px]">
      <Reveal><div className="flex flex-col items-center text-center">
        <h2 className="font-display text-[32px] font-medium leading-10 tracking-[-0.2297px] text-[#202020]">
          My capabilities that fulfill all your wishes
        </h2>
        <p className="mt-2 max-w-[350px] text-[14px] leading-[17px] text-[#404040]">
          Across phones, desktops, browsers, clouds, and every surface where work actually happens.
        </p>
      </div></Reveal>

      <div className="grid grid-cols-1 gap-x-[38px] gap-y-[29px] sm:grid-cols-2">
        {services.map((service, si) => (
          <Reveal key={service.title} delay={si % 2 === 0 ? 0 : 130}>
          <div className="flex w-[232px] flex-col items-center">
            <div className="relative size-[169px] overflow-hidden rounded-xl border border-black/10">
              {service.isAi ? (
                <div className="relative flex size-full items-center justify-center bg-[#fdfdfd]">
                  {/* back tile: dark, ChatGPT knot */}
                  <div className="absolute left-[24px] top-[62px] flex size-[62px] -rotate-[10deg] items-center justify-center rounded-[16px] bg-gradient-to-br from-[#787878] to-[#585858] shadow-[0_12px_22px_-8px_rgba(0,0,0,0.45)]">
                    <img src={chatgptLogo} alt="" className="size-9" />
                  </div>
                  {/* front tile: lighter, burst */}
                  <div className="absolute left-[78px] top-[38px] flex size-[62px] rotate-[9deg] items-center justify-center rounded-[16px] bg-gradient-to-br from-[#c3c3c3] to-[#9d9d9d] shadow-[0_14px_26px_-10px_rgba(0,0,0,0.4)]">
                    <img src={aiIcon} alt="" className="size-9" />
                  </div>
                </div>
              ) : (
                <img src={service.image} alt={service.title} className="size-full object-cover" />
              )}
            </div>
            <p className="mt-5 text-center text-base font-semibold tracking-[0.2px] text-black">{service.title}</p>
            <p className="mt-[10px] w-[232px] text-center text-[13px] leading-[16.5px] tracking-[-0.26px] text-[#6c6c6c]">
              {service.body}
            </p>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
