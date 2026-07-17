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
import ScrollEdgeBlur from './components/ScrollEdgeBlur'
import Works from './pages/Works'
import WorkDetail from './pages/WorkDetail'

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-white">
      {/* Column guide lines from the design file: solid #EDEDED at the content
          column edges, running from the top to just above the Bio section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-[3808px] w-[712px] -translate-x-1/2 border-l border-r border-[#ededed] md:block"
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

    </div>
  )
}

export default function App() {
  // lightweight path routing (vercel.json rewrites all paths to index.html)
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  if (path === '/works') return <Works />
  if (path.startsWith('/works/')) return <WorkDetail />
  return <Home />
}
