import { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import ScrollEdgeBlur from '../components/ScrollEdgeBlur'
import { Reveal } from '../components/motion'
import { PROJECTS } from './Works'

const MEDIA = 'https://jahan-portfolio-nu.vercel.app'


/* ── Gallery layouts per type ────────────────────────────────────── */

/* ── Smart Frame (detects aspect ratio) ──────────────────────────── */
function SmartFrame({ src, alt, priority, onClick }) {
  const [aspect, setAspect] = useState(null)

  return (
    <div className="w-full">
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={aspect === null ? 'block w-full opacity-0' : 'hidden'}
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget
          setAspect(naturalWidth < 800 && naturalHeight > naturalWidth ? 'mobile' : 'desktop')
        }}
      />
      {aspect === 'mobile' && (
        <div className="flex w-full justify-center">
          <div className="w-full max-w-[320px] overflow-hidden rounded-[24px] border border-black/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_24px_60px_-24px_rgba(0,0,0,0.14)]">
            <img src={src} alt={alt} className="block w-full cursor-zoom-in" onClick={() => onClick?.(src)} />
          </div>
        </div>
      )}
      {aspect === 'desktop' && (
        <div className="overflow-hidden rounded-[16px] border border-black/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_24px_60px_-24px_rgba(0,0,0,0.14)]">
          <img src={src} alt={alt} className="block w-full cursor-zoom-in" onClick={() => onClick?.(src)} />
        </div>
      )}
    </div>
  )
}

function DashboardGallery({ project, onImageClick }) {
  return (
    <div className="flex flex-col gap-10">
      {project.pages.map((src, i) => (
        <div key={src}>
          <SmartFrame
            src={encodeURI(MEDIA + src)}
            alt={`${project.title} — screen ${i + 1}`}
            priority={i < 2}
            onClick={onImageClick}
          />
        </div>
      ))}
    </div>
  )
}

function MobileGallery({ project, onImageClick }) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
      {project.pages.map((src, i) => (
        <div key={src}>
          <div className="overflow-hidden rounded-[24px] border border-black/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.12)]">
            <img
              src={encodeURI(MEDIA + src)}
              alt={`${project.title} — screen ${i + 1}`}
              loading={i < 4 ? 'eager' : 'lazy'}
              className="block w-full cursor-zoom-in"
              onClick={() => onImageClick?.(encodeURI(MEDIA + src))}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function LandingGallery({ project }) {
  return (
    <div className="flex flex-col gap-10">
      {project.pages.map((src, i) => (
        <div key={src} className="overflow-hidden rounded-[16px] border border-black/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_24px_60px_-24px_rgba(0,0,0,0.14)]">
          <img
            src={encodeURI(MEDIA + src)}
            alt={`${project.title} — page ${i + 1}`}
            loading={i < 2 ? 'eager' : 'lazy'}
            className="block w-full"
          />
        </div>
      ))}
    </div>
  )
}

function VideoGallery({ project }) {
  const videoSrc = project.pages.find((s) => s.endsWith('.mp4'))
  const images = project.pages.filter((s) => !s.endsWith('.mp4'))

  return (
    <div className="flex flex-col gap-10">
      {videoSrc && (
        <div className="overflow-hidden rounded-[16px] border border-black/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_24px_60px_-24px_rgba(0,0,0,0.14)]">
          <video
            src={encodeURI(MEDIA + videoSrc)}
            muted
            autoPlay
            playsInline
            loop
            controls
            preload="metadata"
            className="block w-full"
          />
        </div>
      )}
      {images.map((src, i) => (
        <div key={src} className="overflow-hidden rounded-[16px] border border-black/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_24px_60px_-24px_rgba(0,0,0,0.14)]">
          <img
            src={encodeURI(MEDIA + src)}
            alt={`${project.title} — asset ${i + 1}`}
            loading="lazy"
            className="block w-full"
          />
        </div>
      ))}
    </div>
  )
}

function MasonryGallery({ project, onImageClick }) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {project.pages.map((src, i) => (
        <div key={src} className="mb-6 break-inside-avoid overflow-hidden rounded-[14px] border border-black/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.12)]">
          <img
            src={encodeURI(MEDIA + src)}
            alt={`${project.title} — concept ${i + 1}`}
            loading={i < 6 ? 'eager' : 'lazy'}
            className="block w-full cursor-zoom-in"
            onClick={() => onImageClick?.(encodeURI(MEDIA + src))}
          />
        </div>
      ))}
    </div>
  )
}

/* ── Detail page ─────────────────────────────────────────────────── */

export default function WorkDetail() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  const slug = path.split('/').pop()
  const project = PROJECTS.find((p) => p.slug === slug)

  const [activeImage, setActiveImage] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!project) {
    return (
      <div className="relative min-h-screen overflow-x-clip bg-white">
        <Navigation />
        <main className="mx-auto flex min-h-[60vh] max-w-[960px] flex-col items-center justify-center px-5 text-center">
          <h1 className="font-display text-[32px] font-medium text-[#202020]">Project not found</h1>
          <p className="mt-3 text-[16px] text-[#6c6c6c]">The project you're looking for doesn't exist.</p>
          <a
            href="/works"
            className="mt-6 inline-flex h-[38px] items-center justify-center rounded-full bg-black px-5 font-inter text-[14px] font-medium text-white"
          >
            ← Back to all works
          </a>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white">
      <Navigation />

      <main className="relative mx-auto flex max-w-[1100px] flex-col px-5">
        {/* header */}
        <div className="flex flex-col items-center pt-[96px] text-center">
          <Reveal once duration={950}>
            <a
              href="/works"
              className="mb-8 inline-flex items-center gap-1.5 font-inter text-[13px] font-medium tracking-[-0.1px] text-[#8d8d8d] transition-colors hover:text-[#202020]"
            >
              ← Back to all works
            </a>
          </Reveal>

          <Reveal once delay={60} duration={950}>
            <span className="font-mono text-[14px] italic text-[#8d8d8d]">{project.id}</span>
            <h1 className="mt-2 font-display text-[38px] font-medium leading-[46px] tracking-[-0.3px] text-[#18181a] sm:text-[48px] sm:leading-[56px]">
              {project.title}
            </h1>
          </Reveal>

          <Reveal once delay={120} duration={950}>
            <span className="mt-4 inline-block w-fit rounded-full border border-[#e8e8e8] bg-white px-3 py-1 font-mono text-[13px] italic text-[#646464]">
              {project.tag}
            </span>
            <p className="mt-5 max-w-[560px] text-[17px] leading-[26px] tracking-[-0.3px] text-[#6c6c6c]">
              {project.desc}
            </p>
          </Reveal>
        </div>

        {/* gallery */}
        <section className="mb-32 w-full mt-14">
          {project.type === 'dashboard' && <DashboardGallery project={project} onImageClick={setActiveImage} />}
          {project.type === 'mobile' && <MobileGallery project={project} onImageClick={setActiveImage} />}
          {project.type === 'landing' && <LandingGallery project={project} />}
          {project.type === 'video' && <VideoGallery project={project} />}
          {project.type === 'gallery' && <MasonryGallery project={project} onImageClick={setActiveImage} />}
        </section>
      </main>

      <Footer />

      {/* Lightbox Overlay */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            alt="Enlarged view"
            className="max-h-full max-w-full rounded-md object-contain shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setActiveImage(null)}
            aria-label="Close lightbox"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
