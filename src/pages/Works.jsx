import { useEffect, useRef, useState } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import ScrollEdgeBlur from '../components/ScrollEdgeBlur'
import { Reveal, useScrollProgress, subscribeScroll, clamp01, easeOut, seg } from '../components/motion'

/* Works — every featured project, presented with the site's scroll
   language: the case-study text stays pinned on the left while the full
   page shot scrolls through the framed viewport on the right. Video
   projects autoplay in the same frame. Media is served from the previous
   portfolio deployment. */

const MEDIA = 'https://jahan-portfolio-nu.vercel.app'

const PROJECTS = [
  {
    id: '01',
    title: 'Opo finance',
    tag: 'Fintech · Web',
    desc: "Six custom landing pages showcasing futures trading tools, built on Opo-finance's design system.",
    src: '/images/projects/opo/forex.png',
  },
  {
    id: '02',
    title: 'Inddex',
    tag: 'Product · SaaS',
    desc: 'A clean digital workspace for indexing, tracking, and organizing personal and professional assets.',
    src: '/images/projects/inddex/1440w light.png',
  },
  {
    id: '03',
    title: 'Iconsax',
    tag: 'Open source · Icons',
    desc: 'An open-source library of 1,000+ base icons in six distinct design styles, optimized for design and dev.',
    src: '/images/projects/Iconsax/Iconsax.mp4',
    video: true,
  },
  {
    id: '04',
    title: 'Teacherly',
    tag: 'EdTech · Platform',
    desc: 'A streamlined school management platform simplifying classrooms, assignments, and school communication.',
    src: '/images/projects/Teacherly/Assignment management-1.jpg',
  },
  {
    id: '05',
    title: 'Web2get',
    tag: 'Dashboard · Agency',
    desc: 'An agency management dashboard unifying client workflows, invoicing, and revenue analytics.',
    src: '/images/projects/Web2get/dashboard-1.png',
  },
  {
    id: '06',
    title: 'Easylab',
    tag: 'B2B · Health',
    desc: 'A secure B2B web app streamlining workflows between dental clinics and technician labs.',
    src: '/images/projects/easylab/Desktop - 2.png',
  },
  {
    id: '07',
    title: 'Hi&buy',
    tag: '3D · Mobile',
    desc: 'A 3D-driven grocery shopping application featuring a neon and claymorphic visual design.',
    src: '/images/projects/HIBUY/Desktop - 8.png',
  },
  {
    id: '08',
    title: 'Mattered',
    tag: 'Editorial · Brand',
    desc: 'A minimalist, editorial agency portfolio showcasing brand identities and creative designs.',
    src: '/images/projects/Mattered/Our Service - Update.png',
  },
  {
    id: '09',
    title: 'Perr',
    tag: 'Utility · Mobile',
    desc: 'A peer-to-peer file-sharing app utilizing QR code pairing for cross-device transfers.',
    src: '/images/projects/Perr/Notification.png',
  },
  {
    id: '10',
    title: 'Murray',
    tag: 'AI · Assistant',
    desc: 'An AI assistant app coordinating daily tasks, calendar schedules, and ride booking.',
    src: '/images/projects/Murray/Empty-1.png',
  },
  {
    id: '11',
    title: 'Top Concepts',
    tag: 'Exploration · Visual',
    desc: 'A curated set of experimental dashboard designs, mobile interfaces, and custom visual mockups.',
    src: '/images/projects/Concepts/154a1ebb9cfe2fc0a5802b6113dbd491.webp',
  },
]

/* One project row: pinned text left, scroll-scrubbed page shot right.
   The row is taller than the viewport; as it scrolls through, the tall
   screenshot translates upward inside the frame so the whole page is
   seen — the same scrub logic as the rest of the site. */
function ProjectRow({ project, index }) {
  const rowRef = useRef(null)
  const frameRef = useRef(null)
  const imgRef = useRef(null)
  const p = useScrollProgress(rowRef)
  const [travel, setTravel] = useState(0)

  useEffect(() => {
    if (project.video) return
    const measure = () => {
      const frame = frameRef.current
      const img = imgRef.current
      if (!frame || !img || !img.naturalWidth) return
      const scaledH = (img.naturalHeight / img.naturalWidth) * frame.clientWidth
      setTravel(Math.max(0, scaledH - frame.clientHeight))
    }
    const img = imgRef.current
    if (img) {
      if (img.complete) measure()
      else img.addEventListener('load', measure, { once: true })
    }
    return subscribeScroll(measure)
  }, [project.video])

  const scrub = easeOut(seg(p, 0.08, 0.92))

  return (
    <section
      ref={rowRef}
      className="relative w-full"
      style={{ height: project.video || travel === 0 ? 'auto' : '210vh' }}
    >
      <div
        className={`${project.video || travel === 0 ? '' : 'sticky top-0 flex h-screen items-center'} w-full`}
      >
        <div className="mx-auto grid w-full max-w-[1160px] grid-cols-1 gap-8 px-5 py-14 md:grid-cols-[340px_1fr] md:gap-14 md:py-0">
          {/* case-study text */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <span className="font-mono text-[13px] italic text-[#8d8d8d]">{project.id}</span>
              <h2 className="mt-2 font-display text-[28px] font-medium leading-[34px] tracking-[-0.23px] text-[#202020]">
                {project.title}
              </h2>
              <span className="mt-3 inline-block w-fit rounded-full border border-[#e8e8e8] bg-white px-[10px] py-[3px] font-mono text-[12px] italic text-[#646464]">
                {project.tag}
              </span>
              <p className="mt-4 max-w-[340px] text-[16px] leading-[24px] tracking-[-0.2px] text-[#6c6c6c]">
                {project.desc}
              </p>
            </Reveal>
          </div>

          {/* media frame */}
          <div
            ref={frameRef}
            className="relative h-[52vh] overflow-hidden rounded-[20px] bg-[#f6f6f6] shadow-[0_0_0_1px_rgba(0,0,0,0.07),0_24px_60px_-24px_rgba(0,0,0,0.18)] md:h-[74vh]"
          >
            {project.video ? (
              <video
                src={encodeURI(MEDIA + project.src)}
                muted
                autoPlay
                playsInline
                loop
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <img
                ref={imgRef}
                src={encodeURI(MEDIA + project.src)}
                alt={`${project.title} — full page design`}
                loading={index < 2 ? 'eager' : 'lazy'}
                className="block w-full"
                style={{
                  transform: `translateY(${-scrub * travel}px)`,
                  willChange: 'transform',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Works() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-white">
      <Navigation />
      <ScrollEdgeBlur />

      <main className="relative mx-auto flex max-w-[1160px] flex-col px-5">
        {/* page intro */}
        <div className="flex flex-col items-center pt-[96px] text-center">
          <Reveal once duration={950}>
            <h1 className="font-display text-[34px] font-medium leading-[42px] tracking-[-0.3px] text-[#18181a] sm:text-[44px] sm:leading-[52px]">
              A selection of <em className="font-serif italic">the work</em>
            </h1>
          </Reveal>
          <Reveal once delay={120} duration={950}>
            <p className="mt-4 max-w-[560px] text-[17px] leading-[26px] tracking-[-0.3px] text-[#6c6c6c]">
              A curated collection of projects across brand strategy, visual identity, web design, development,
              and visual content. Each project represents a specific brief, a specific challenge, and a specific
              outcome.
            </p>
          </Reveal>
        </div>

        <div className="mt-6 flex flex-col">
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
