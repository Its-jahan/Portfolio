import Navigation from './components/Navigation'
import Hero from './components/Hero'
import ChatParallax from './components/ChatParallax'
import Divider from './components/Divider'
import WorkIntro from './components/WorkIntro'
import ProjectsShowcase from './components/ProjectsShowcase'
import Testimonial from './components/Testimonial'
import Services from './components/Services'
import Bio from './components/Bio'
import ContactChat from './components/ContactChat'
import Faq from './components/Faq'
import Footer from './components/Footer'
import CommentOverlay from './components/CommentOverlay'

function ScrollEdgeBlur() {
  const edgeStyle = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))',
    maskImage: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.9) 30%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.9) 30%, transparent 100%)',
  }

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[112px]" style={edgeStyle} />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[112px] rotate-180"
        style={edgeStyle}
      />
    </>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Column guide lines from the design file: solid #EDEDED at the content
          column edges, running from the top to just above the Bio section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-[3808px] w-[712px] -translate-x-1/2 border-l border-r border-[#ededed]"
      />

      <Navigation />
      <ScrollEdgeBlur />

      <main className="relative mx-auto flex max-w-[752px] flex-col px-5">
        <Hero />
      </main>

      <ChatParallax />

      <main className="relative mx-auto flex max-w-[752px] flex-col px-5">
        <WorkIntro />
        <Divider className="py-[65px]" />
      </main>

      <ProjectsShowcase />

      <main className="relative mx-auto flex max-w-[752px] flex-col px-5">
        <Divider className="pb-[132px] pt-[178px]" />
        <Testimonial />
        <Divider className="pb-[95px] pt-[141px]" />
        <Services />
        <Divider className="pb-[95px] pt-[86px]" />
        <Bio />
        <Divider className="pb-[81px] pt-[66px]" />
        <ContactChat />
        <Divider className="pb-[72px] pt-[91px]" />
        <Faq />
      </main>

      <Footer />

      {import.meta.env.DEV && <CommentOverlay />}
    </div>
  )
}
