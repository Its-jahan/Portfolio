export default function ScrollEdgeBlur() {
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
