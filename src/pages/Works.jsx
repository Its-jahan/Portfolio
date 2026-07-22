import { useEffect, useRef, useState } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import ScrollEdgeBlur from '../components/ScrollEdgeBlur'
import { Reveal, useScrollProgress, subscribeScroll, clamp01, easeOut, seg } from '../components/motion'

const MEDIA = 'https://jahan-portfolio-nu.vercel.app'

export const PROJECTS = [
  {
    id: '01',
    slug: 'web2get',
    title: 'Web2get',
    tag: 'Dashboard · Agency',
    type: 'dashboard',
    desc: 'An agency management dashboard unifying client workflows, invoicing, and revenue analytics.',
    caseStudy: {
      role: 'Product designer — information architecture, dashboard UI, invoicing flow, design system',
      context:
        'Agencies run client work, invoicing and revenue tracking across scattered spreadsheets and disconnected tools, with no single source of truth for where money and projects stand.',
      challenge:
        'Unify three jobs — client workflow, invoicing, and revenue analytics — into one dashboard dense enough for power users but calm enough to scan every day.',
      approach: [
        'Mapped the agency operating loop (client → project → invoice → revenue) and built the information architecture around it.',
        'Designed the end-to-end invoicing flow — creation, line items, status, and history — as the product’s highest-frequency task.',
        'Established a data-viz and component language so analytics, tables and forms stayed consistent as the product scaled.',
      ],
      outcome:
        'A single dashboard that replaces scattered tools, making client status, invoicing and revenue legible at a glance. ⟨Add adoption or time-saved figures if you have them.⟩',
    },
    src: '/images/projects/Web2get/dashboard-1.png',
    pages: [
      '/images/projects/Web2get/dashboard-1.png',
      '/images/projects/Web2get/dashboard-2.png',
      '/images/projects/Web2get/dashboard.png',
      '/images/projects/Web2get/Invoicing.png',
      '/images/projects/Web2get/Invoicing-1.png',
      '/images/projects/Web2get/Invoicing-2.png',
      '/images/projects/Web2get/Invoicing-3.png',
      '/images/projects/Web2get/Invoicing-4.png',
      '/images/projects/Web2get/Invoicing-5.png',
      '/images/projects/Web2get/Invoicing-6.png',
      '/images/projects/Web2get/Invoicing-7.png',
    ],
  },
  {
    id: '02',
    slug: 'easylab',
    title: 'Easylab',
    tag: 'B2B · Health',
    type: 'dashboard',
    desc: 'A secure B2B web app streamlining workflows between dental clinics and technician labs.',
    caseStudy: {
      role: 'Product designer — two-sided workflow, UI, design system',
      context:
        'Dental clinics and technician labs coordinate custom casework (crowns, aligners, dentures) — historically over phone, paper and messaging, with no shared status or spec history.',
      challenge:
        'Design a secure, two-sided system where clinics submit precise case specs and labs track and fulfil them — cutting the back-and-forth and errors that come from an unstructured handoff.',
      approach: [
        'Mapped the clinic ↔ lab handoff to find where cases stall: missing specs, unclear status, lost files.',
        'Designed a structured case-order flow with clear specs, attachments, and a shared status timeline both sides can trust.',
        'Made dense clinical data scannable with a consistent status system, so staff can triage a queue at a glance.',
      ],
      outcome:
        'A shared workspace that replaces phone-and-paper coordination with a structured, auditable flow between clinics and labs. ⟨Add error-reduction or turnaround figures if measured.⟩',
    },
    src: '/images/projects/easylab/Desktop - 2.png',
    pages: [
      '/images/projects/easylab/Desktop - 2.png',
      '/images/projects/easylab/Desktop - 4.png',
      '/images/projects/easylab/Desktop - 5.png',
      '/images/projects/easylab/Desktop - 17.png',
      '/images/projects/easylab/Desktop - 19.png',
      '/images/projects/easylab/Desktop - 25.png',
      '/images/projects/easylab/Desktop - 32.png',
      '/images/projects/easylab/Desktop - 35.png',
      '/images/projects/easylab/Desktop - 42.png',
    ],
  },
  {
    id: '03',
    slug: 'inddex',
    title: 'Inddex',
    tag: 'Product · SaaS',
    type: 'landing',
    desc: 'A clean digital workspace for indexing, tracking, and organizing personal and professional assets.',
    src: '/images/projects/inddex/1440w light.png',
    pages: [
      '/images/projects/inddex/1440w light.png',
    ],
  },
  {
    id: '04',
    slug: 'iconsax',
    title: 'Iconsax',
    tag: 'Open source · Icons',
    type: 'video',
    desc: 'An open-source library of 1,000+ base icons in six distinct design styles, optimized for design and dev.',
    src: '/images/projects/Iconsax/Iconsax.mp4',
    video: true,
    pages: [
      '/images/projects/Iconsax/Iconsax.mp4',
      '/images/projects/Iconsax/hero.png',
      '/images/projects/Iconsax/f4da6041-b5d4-4bbe-92e4-2a8945160554-cover.png',
      '/images/projects/Iconsax/iconsax-categories.webp',
      '/images/projects/Iconsax/b3e16b83-0612-4327-9ce4-3b9162ddb329.webp',
      '/images/projects/Iconsax/Iconsax-find-Free-AI-tools-Victrays.com_.webp',
    ],
  },
  {
    id: '05',
    slug: 'opo-finance',
    title: 'Opo finance',
    tag: 'Fintech · Web',
    type: 'landing',
    desc: "Six custom landing pages showcasing futures trading tools, built on Opo-finance's design system.",
    // TODO(jahan): replace ⟨…⟩ with real figures if you have them, or delete the bracketed part.
    caseStudy: {
      role: 'Product & UI designer — landing pages, design-system extension, front-end handoff',
      context:
        'Opofinance offers forex and futures trading through MT4/MT5 platforms. Traders arrive skeptical and comparison-shopping, so the marketing site has to make sophisticated tools feel trustworthy and move qualified visitors toward opening an account.',
      challenge:
        'Explain complex, feature-dense trading products across six pages without overwhelming visitors — and do it inside the brand’s existing design system so nothing felt bolted on.',
      approach: [
        'Audited the existing design system and extended its tokens, components and dark fintech aesthetic so the new pages read as native, not templated.',
        'Structured each page around a single decision — platforms (MT4/MT5), instruments, account types — leading with the trader’s question rather than a feature dump.',
        'Built interaction-accurate prototypes so engineering could ship the motion and states without guessing.',
      ],
      outcome:
        'A cohesive six-page system that presents advanced trading tools clearly and guides visitors toward account sign-up, consistent across every surface. ⟨Add real conversion / sign-up lift if measured.⟩',
    },
    src: '/images/projects/opo/forex.png',
    pages: [
      '/images/projects/opo/forex.png',
      '/images/projects/opo/Home.png',
      '/images/projects/opo/MT4.png',
      '/images/projects/opo/MT4-1.png',
    ],
  },
  {
    id: '06',
    slug: 'teacherly',
    title: 'Teacherly',
    tag: 'EdTech · Platform',
    type: 'dashboard',
    desc: 'A streamlined school management platform simplifying classrooms, assignments, and school communication.',
    src: '/images/projects/Teacherly/Assignment management-1.jpg',
    pages: [
      '/images/projects/Teacherly/Assignment management-1.jpg',
      '/images/projects/Teacherly/Assignment management.jpg',
      '/images/projects/Teacherly/Assignment management/Add new Assignment.jpg',
      '/images/projects/Teacherly/Assignment management/Details.jpg',
      '/images/projects/Teacherly/Assignment management/Student Page.jpg',
      '/images/projects/Teacherly/Desktop - 1.jpg',
      '/images/projects/Teacherly/Chat.jpg',
      '/images/projects/Teacherly/Chat - New message.jpg',
      '/images/projects/Teacherly/Chat/Link.jpg',
      '/images/projects/Teacherly/Chat/Media.jpg',
      '/images/projects/Teacherly/Students Managment.jpg',
      '/images/projects/Teacherly/Students Managment/Full details.jpg',
      '/images/projects/Teacherly/School Manage.jpg',
      '/images/projects/Teacherly/New School.jpg',
      '/images/projects/Teacherly/New School-1.jpg',
      '/images/projects/Teacherly/Rate for Student.jpg',
      '/images/projects/Teacherly/Setting.jpg',
      '/images/projects/Teacherly/Setting-1.jpg',
      '/images/projects/Teacherly/Sign Up.jpg',
      '/images/projects/Teacherly/Sign Up-1.jpg',
      '/images/projects/Teacherly/Sign Up-2.jpg',
      '/images/projects/Teacherly/Sign Up-3.jpg',
      '/images/projects/Teacherly/Sign Up-4.jpg',
      '/images/projects/Teacherly/Sign Up-5.jpg',
      '/images/projects/Teacherly/Sign Up-6.jpg',
      '/images/projects/Teacherly/Sign Up-7.jpg',
    ],
  },
  {
    id: '07',
    slug: 'hibuy',
    title: 'Hi&buy',
    tag: '3D · Mobile',
    type: 'mobile',
    desc: 'A 3D-driven grocery shopping application featuring a neon and claymorphic visual design.',
    src: '/images/projects/HIBUY/Desktop - 8.png',
    pages: [
      '/images/projects/HIBUY/Desktop - 8.png',
      '/images/projects/HIBUY/Desktop - 9.png',
      '/images/projects/HIBUY/Desktop - 10.png',
      '/images/projects/HIBUY/Desktop - 11.png',
      '/images/projects/HIBUY/Desktop - 12.png',
      '/images/projects/HIBUY/Desktop - 15.png',
      '/images/projects/HIBUY/Desktop - 16.png',
      '/images/projects/HIBUY/Desktop - 18.png',
      '/images/projects/HIBUY/Desktop - 21.png',
      '/images/projects/HIBUY/Desktop - 23.png',
      '/images/projects/HIBUY/image 1.png',
    ],
  },
  {
    id: '08',
    slug: 'mattered',
    title: 'Mattered',
    tag: 'Editorial · Brand',
    type: 'landing',
    desc: 'A minimalist, editorial agency portfolio showcasing brand identities and creative designs.',
    src: '/images/projects/Mattered/Our Service - Update.png',
    pages: [
      '/images/projects/Mattered/Our Service - Update.png',
      '/images/projects/Mattered/Our Service.png',
      '/images/projects/Mattered/web.png',
    ],
  },
  {
    id: '09',
    slug: 'perr',
    title: 'Perr',
    tag: 'Utility · Mobile',
    type: 'mobile',
    desc: 'A peer-to-peer file-sharing app utilizing QR code pairing for cross-device transfers.',
    src: '/images/projects/Perr/Notification.png',
    pages: [
      '/images/projects/Perr/Notification.png',
      '/images/projects/Perr/Scan QR Code.png',
      '/images/projects/Perr/Scan QR Code (Authenticated).png',
      '/images/projects/Perr/Scan.png',
      '/images/projects/Perr/Send Documents.png',
      '/images/projects/Perr/Send Documents - Uploading.png',
      '/images/projects/Perr/Send Documents - Uploading-1.png',
      '/images/projects/Perr/Share.png',
      '/images/projects/Perr/Share history.png',
      '/images/projects/Perr/Sign in.png',
      '/images/projects/Perr/Update App.png',
      '/images/projects/Perr/Update.png',
      '/images/projects/Perr/Update-1.png',
    ],
  },
  {
    id: '10',
    slug: 'murray',
    title: 'Murray',
    tag: 'AI · Assistant',
    type: 'mobile',
    desc: 'An AI assistant app coordinating daily tasks, calendar schedules, and ride booking.',
    src: '/images/projects/Murray/Empty-1.png',
    pages: [
      '/images/projects/Murray/Empty-1.png',
      '/images/projects/Murray/Empty-2.png',
      '/images/projects/Murray/Empty-3.png',
      '/images/projects/Murray/Empty.png',
      '/images/projects/Murray/Expired.png',
      '/images/projects/Murray/Home.png',
      '/images/projects/Murray/Home-1.png',
      '/images/projects/Murray/Home-2.png',
      '/images/projects/Murray/My Agents.png',
      '/images/projects/Murray/No Connection.png',
      '/images/projects/Murray/Prefill.png',
    ],
  },
  {
    id: '11',
    slug: 'top-concepts',
    title: 'Top Concepts',
    tag: 'Exploration · Visual',
    type: 'gallery',
    desc: 'A curated set of experimental dashboard designs, mobile interfaces, and custom visual mockups.',
    src: '/images/projects/Concepts/154a1ebb9cfe2fc0a5802b6113dbd491.webp',
    pages: [
      '/images/projects/Concepts/154a1ebb9cfe2fc0a5802b6113dbd491.webp',
      '/images/projects/Concepts/9524f48d65bb3d086ad86c3b327f7558.webp',
      '/images/projects/Concepts/Desktop - 1.png',
      '/images/projects/Concepts/Desktop - 5.png',
      '/images/projects/Concepts/Desktop - 6.png',
      '/images/projects/Concepts/Desktop - 7.jpg',
      '/images/projects/Concepts/Frame 358.png',
      '/images/projects/Concepts/Instagram post - 4.png',
      '/images/projects/Concepts/Instagram post - 5.png',
      '/images/projects/Concepts/Instagram post - 6.png',
      '/images/projects/Concepts/Instagram post - 7.png',
      '/images/projects/Concepts/dribbble 1.png',
      '/images/projects/Concepts/dribbble 2.png',
      '/images/projects/Concepts/dribbble 3.png',
      '/images/projects/Concepts/dribbble 4.png',
      '/images/projects/Concepts/e848020a50941a173cb00f35dfd8c82c.webp',
      '/images/projects/Concepts/original-057eed6bcefeb059833bbc0e1b3e7e45.webp',
      '/images/projects/Concepts/original-1d9d22f750072d45024fd9fffde10e5e.webp',
      '/images/projects/Concepts/original-50d940f77f6be0b5f52823bc3bbf6aa0.webp',
      '/images/projects/Concepts/original-6a265e65b71948dec82a5521029b7ef8.webp',
      '/images/projects/Concepts/original-9d97e70f77c917d4b9bcb329fb9d82fc.webp',
      '/images/projects/Concepts/original-9dccb1bc34d4e714d6ca10bff4074f36.webp',
      '/images/projects/Concepts/original-ac5da18c14adb4389346b7c8996b6c87.webp',
      '/images/projects/Concepts/original-b82211f198d494feed9a4aec8d7b8d8c.webp',
      '/images/projects/Concepts/original-c652e05856ca963e3f4eec1907ccf06e.webp',
      '/images/projects/Concepts/original-d8b40a62331ca4749207c0a64dfd8b3c.webp',
      '/images/projects/Concepts/original-eb8cafbb25a6147d2cbe1d9721d91cca.webp',
    ],
  },
]

/* ── ProjectRow ─────────────────────────────────────────────────────── */

function ProjectRow({ project, index }) {
  const rowRef = useRef(null)
  const frameRef = useRef(null)
  const imgRef = useRef(null)
  const p = useScrollProgress(rowRef)
  const [travel, setTravel] = useState(0)

  const isScrollable = project.type === 'landing'

  useEffect(() => {
    if (project.video || !isScrollable) return
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
  }, [project.video, isScrollable])

  const scrub = easeOut(seg(p, 0.08, 0.92))

  const handleClick = () => {
    window.location.href = `/works/${project.slug}`
  }

  return (
    <section
      ref={rowRef}
      className="relative w-full"
      style={{ height: project.video || !isScrollable || travel === 0 ? 'auto' : '210vh' }}
    >
      <div
        className={`${project.video || !isScrollable || travel === 0 ? 'flex min-h-[100vh] items-center py-24' : 'sticky top-0 flex h-screen items-center'} w-full`}
      >
        <div
          className="mx-auto grid w-full max-w-[1160px] cursor-pointer grid-cols-1 gap-8 px-5 py-14 md:grid-cols-[340px_1fr] md:gap-14 md:py-0"
          onClick={handleClick}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
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
              <span className="mt-5 inline-flex items-center gap-1.5 font-inter text-[13px] font-medium tracking-[-0.1px] text-[#0a9dff]">
                View project →
              </span>
            </Reveal>
          </div>

          {/* media frame */}
          <div
            ref={frameRef}
            className="relative h-[52vh] overflow-hidden rounded-[20px] bg-[#f6f6f6] shadow-[0_0_0_1px_rgba(0,0,0,0.07),0_24px_60px_-24px_rgba(0,0,0,0.18)] md:h-[74vh]"
            style={{
              display: 'flex',
              alignItems: isScrollable ? 'flex-start' : 'center',
              justifyContent: 'center',
            }}
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
            ) : isScrollable ? (
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
            ) : project.type === 'mobile' ? (
              <img
                src={encodeURI(MEDIA + project.src)}
                alt={`${project.title} — mobile design`}
                loading={index < 2 ? 'eager' : 'lazy'}
                className="h-full w-full object-contain p-[40px]"
              />
            ) : (
              /* dashboard / gallery — centered, contained */
              <img
                src={encodeURI(MEDIA + project.src)}
                alt={`${project.title} — dashboard design`}
                loading={index < 2 ? 'eager' : 'lazy'}
                className="h-full w-full object-contain p-[40px]"
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
