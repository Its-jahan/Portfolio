import { useEffect, useRef } from 'react'
import signature from '../assets/signature.svg'
import { Reveal } from './motion'

const WORD = 'JAHAN'
const FONT = (w) => `900 ${w}px -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif`
const TAU = Math.PI * 2
const IDLE_ALPHAS = [0.1, 0.2, 0.4]
const RADIUS_SCALE = 1 / 3
const BLUE = [81, 166, 245]
const INK = [10, 10, 10]
const FADE_MS = 4400

function useDotCanvas(holderRef, canvasRef) {
  useEffect(() => {
    const holder = holderRef.current
    const canvas = canvasRef.current
    if (!holder || !canvas) return

    const ctx = canvas.getContext('2d')

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
    const hash2 = (x, y, s = 0) => {
      const r = 43758.5453123 * Math.sin(127.1 * x + 311.7 * y + 74.7 * s)
      return r - Math.floor(r)
    }
    const cellHash = (x, y) => {
      const cx = Math.round(x / 4)
      const cy = Math.round(y / 4)
      const a = 19341.731 * Math.sin(71.31 * cx + 29.17 * cy)
      const b = 41758.129 * Math.sin(17.73 * cx - 83.91 * cy + 2.4)
      return (a - Math.floor(a)) * 0.68 + (b - Math.floor(b)) * 0.32
    }

    let DPR = 1
    let W = 0
    let H = 0
    let N = 0
    let dx, dy, blueKind, noiseT, thresh, fadeK, bandOff, dither, close_, active, sinceT
    let wordMidY = 0
    let wordH = 1
    let roamCv = null
    let roamCtx = null
    let roamW = 0
    let roamH = 0

    const snap = (v) => Math.round(v * DPR) / DPR

    function rebuild() {
      const rect = holder.getBoundingClientRect()
      W = rect.width
      H = rect.height
      DPR = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.ceil(W * DPR)
      canvas.height = Math.ceil(H * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      ctx.imageSmoothingEnabled = false

      roamW = Math.max(1, Math.ceil(W / 5))
      roamH = Math.max(1, Math.ceil(H / 5))
      roamCv = document.createElement('canvas')
      roamCv.width = roamW
      roamCv.height = roamH
      roamCtx = roamCv.getContext('2d', { willReadFrequently: true })
      roamCtx.imageSmoothingEnabled = false

      const off = document.createElement('canvas')
      off.width = Math.max(1, Math.floor(W))
      off.height = Math.max(1, Math.floor(H))
      const oc = off.getContext('2d', { willReadFrequently: true })

      let size = 100
      oc.font = FONT(size)
      size = (size * W) / oc.measureText(WORD).width
      oc.font = FONT(size)
      size = (size * W) / oc.measureText(WORD).width
      oc.font = FONT(size)
      const m = oc.measureText(WORD)
      const capH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
      if (capH > H) {
        size *= H / capH
        oc.font = FONT(size)
      }
      const m2 = oc.measureText(WORD)
      const asc = m2.actualBoundingBoxAscent
      const desc = m2.actualBoundingBoxDescent
      const baseY = (H + asc - desc) / 2
      oc.fillStyle = '#000'
      oc.textAlign = 'center'
      oc.fillText(WORD, W / 2, baseY)

      const top = clamp(baseY - asc, 0, H)
      const bot = clamp(baseY + desc, 0, H)
      wordMidY = (top + bot) / 2
      wordH = bot - top

      const img = oc.getImageData(0, 0, off.width, off.height).data
      const cols = Math.ceil(W / 4)
      const rows = Math.ceil(H / 4)
      const ax = [], ay = [], ab = [], at = [], ath = [], af = [], abo = [], adi = []

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const x = Math.floor(4 * gx + 2)
          const y = Math.floor(4 * gy + 2)
          if (x >= off.width || y >= off.height) continue
          if ((img[(y * off.width + x) * 4 + 3] ?? 0) / 255 <= 0.5) continue

          ax.push(x)
          ay.push(y)
          const u = x / Math.max(1, off.width)
          const v = y / Math.max(1, off.height)
          const t = clamp(
            0.5 +
              0.22 * Math.sin((4.2 * u + 2.7 * v) * TAU + 0.9) +
              0.18 * Math.sin((-5.4 * u + 6.3 * v) * TAU + 2.4) +
              0.16 * Math.cos((8.8 * u - 5.1 * v) * TAU + 1.7) +
              0.11 * Math.sin((13 * u + 11.5 * v) * TAU + 4.6) +
              (hash2(x, y, 9) - 0.5) * 0.28 +
              (hash2(x, y, 19) - 0.5) * 0.14,
            0,
            1,
          )
          at.push(t)
          ab.push(t > 0.56 ? 1 : 0)
          ath.push(cellHash(x, y))
          af.push(
            0.78 +
              0.54 *
                clamp(
                  0.5 + 0.32 * Math.sin(0.011 * x + 0.006 * y) + 0.18 * Math.sin(0.027 * x - 0.019 * y + 1.7),
                  0,
                  1,
                ),
          )
          abo.push(
            (() => {
              const n = 43758.5453 * Math.sin(91.73 * Math.round(x / 4) + 37.19 * Math.round(y / 4))
              return (n - Math.floor(n) - 0.5) * 0.22
            })(),
          )
          adi.push(cellHash(x + 17, y - 29))
        }
      }

      N = ax.length
      dx = new Float32Array(ax)
      dy = new Float32Array(ay)
      blueKind = new Uint8Array(ab)
      noiseT = new Float32Array(at)
      thresh = new Float32Array(ath)
      fadeK = new Float32Array(af)
      bandOff = new Float32Array(abo)
      dither = new Float32Array(adi)
      close_ = new Float32Array(N)
      close_.fill(1)
      active = new Uint8Array(N)
      sinceT = new Float64Array(N)
    }

    function idleBand(x, y, t, off) {
      const u = x / Math.max(W, 1)
      const v = y / Math.max(H, 1)
      const warp =
        0.085 * Math.sin(u * TAU * 1.15 + 15e-5 * t) +
        0.0408 * Math.sin(u * TAU * 2.8 - 15e-5 * t * 1.35) +
        0.0136 * Math.sin(u * TAU * 6.4 + 15e-5 * t * 0.62)
      const grain = 0.035 * Math.sin(0.41 * Math.round(x / 4) + 0.27 * Math.round(y / 4) + 22e-5 * t)
      const wave = Math.sin(((v + warp) * 1.15 - 9e-5 * t) * TAU) + off + grain
      return wave > 0.76 ? 2 : wave > -0.76 ? 1 : 0
    }

    function drawRoam(now) {
      if (!roamCtx) return null
      const t = now * 0.001
      const drift = {
        x: 0.5 * W + Math.sin(0.17 * t) * W * 0.3 + Math.sin(0.083 * t + 1.3) * W * 0.1,
        y: wordMidY + Math.sin(0.13 * t + 0.5) * wordH * 0.42 + Math.cos(0.06 * t) * wordH * 0.16,
        rot: 0.09 * t + 0.5 * Math.sin(0.05 * t),
        scl: (wordH / 336) * 1.45 * (1 + 0.45 * Math.sin(0.07 * t + 0.7)),
      }
      const q = roamCtx
      q.setTransform(1, 0, 0, 1, 0, 0)
      q.clearRect(0, 0, roamW, roamH)
      q.save()
      q.scale(0.2, 0.2)
      q.translate(drift.x, drift.y)
      q.rotate(drift.rot)
      q.scale(drift.scl, drift.scl)
      q.font = FONT(336)
      q.textAlign = 'center'
      q.textBaseline = 'middle'
      q.lineJoin = 'round'
      q.lineCap = 'round'
      q.strokeStyle = 'rgba(0,0,0,.34)'
      q.lineWidth = 10 / Math.max(drift.scl, 1e-4)
      q.strokeText('J', 0, 0)
      q.fillStyle = '#000'
      q.fillText('J', 0, 0)
      q.restore()
      return q.getImageData(0, 0, roamW, roamH).data
    }

    function isRevealed(x, y, buf, rnd) {
      if (!buf) return false
      const cx = (x / 5) | 0
      const cy = (y / 5) | 0
      if (cx < 0 || cy < 0 || cx >= roamW || cy >= roamH) return false
      const a = buf[(cy * roamW + cx) * 4 + 3] ?? 0
      if (a >= 220) return true
      if (a <= 8) return false
      return rnd < a / 255
    }

    function segDist2(px_, py_, x1, y1, x2, y2) {
      const ex = x2 - x1
      const ey = y2 - y1
      if (ex === 0 && ey === 0) {
        const qx = px_ - x1
        const qy = py_ - y1
        return qx * qx + qy * qy
      }
      const s = clamp(((px_ - x1) * ex + (py_ - y1) * ey) / (ex * ex + ey * ey), 0, 1)
      const qx = px_ - (x1 + ex * s)
      const qy = py_ - (y1 + ey * s)
      return qx * qx + qy * qy
    }

    let inField = false
    let curX = 0
    let curY = 0
    let targX = 0
    let targY = 0
    let speed = 0

    const handlePointerMove = (e) => {
      const r = holder.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (x >= -40 && y >= -40 && x <= r.width + 40 && y <= r.height + 40) {
        if (!inField) {
          inField = true
          curX = x
          curY = y
          speed = 0
        }
        targX = x
        targY = y
      } else {
        inField = false
      }
    }
    const handlePointerLeave = () => {
      inField = false
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    let raf = 0
    function frame(now) {
      ctx.clearRect(0, 0, W, H)
      const roamBuf = drawRoam(now)

      const prevX = curX
      const prevY = curY
      if (inField) {
        curX = targX
        curY = targY
      }
      const moved = Math.hypot(curX - prevX, curY - prevY)
      speed = 0.92 * speed + 0.08 * moved
      const moving = moved > 0.001

      const gRef = Math.max(1, wordH)
      const jitter = 0.08 * gRef
      const sNorm = clamp(speed / 22, 0, 1)
      const eased = sNorm * sNorm * (3 - 2 * sNorm)
      let R = 20 + (clamp(gRef * RADIUS_SCALE * 0.5 + 0.7 * jitter, 24, 0.3 * gRef) - 20) * eased
      R = clamp(R + Math.sin(0.0032 * now + 0.045 * speed) * jitter * (0.28 + 0.22 * eased), 20, 0.3 * gRef)

      const reach = 1.24 * R
      const reach2 = reach * reach
      const minX = Math.min(prevX, curX) - reach
      const maxX = Math.max(prevX, curX) + reach
      const minY = Math.min(prevY, curY) - reach
      const maxY = Math.max(prevY, curY) + reach

      const el = Math.max(1 / DPR, Math.round(0.84 * DPR) / DPR)
      const idlePaths = [new Path2D(), new Path2D(), new Path2D()]
      const calmBlue = new Path2D()
      const haloBlue = new Path2D()
      const coreBlue = new Path2D()

      for (let i = 0; i < N; i++) {
        const x = dx[i]
        const y = dy[i]
        const revealed = isRevealed(x, y, roamBuf, dither[i])

        let d2 = Infinity
        if (moving && inField && x >= minX && x <= maxX && y >= minY && y <= maxY) {
          d2 = segDist2(x, y, prevX, prevY, curX, curY)
        }
        const u = Math.sqrt(d2) / Math.max(1, R)
        const edge = clamp((1.24 - u) / 0.6, 0, 1)
        const coverage = (edge * edge * (3 - 2 * edge)) ** 1.35
        const inBrush = u <= 0.64 || thresh[i] <= coverage

        if (d2 <= reach2 && inBrush) {
          if (active[i]) {
            close_[i] = Math.min(close_[i], u)
          } else {
            close_[i] = u
            sinceT[i] = now
          }
          active[i] = 1
        }

        const life =
          Math.max(0, 1 - Math.max(0, (now - sinceT[i]) / FADE_MS) * fadeK[i]) * (1 + (thresh[i] - 0.5) * 0.48)
        if (active[i] && close_[i] > life) active[i] = 0

        if (active[i] === 1 || revealed) {
          if (blueKind[i] === 1) {
            const t = noiseT[i] || 0.5
            const o = 22e-5 * now
            const amp = 0.55 + 1.35 * t
            const s1 = Math.sin(0.025 * x + 0.014 * y + 1.3 * o)
            const c1 = Math.cos(0.012 * x - 0.02 * y - 0.9 * o)
            const s2 = Math.sin((x + y) * 0.009 + 0.7 * o)
            const wx = snap(x + (s1 + 0.7 * s2) * amp)
            const wy = snap(y + (c1 - 0.5 * s2) * amp)
            const rHalo = 1.14 * el
            const rCore = 1.06 * el
            haloBlue.moveTo(wx + rHalo, wy)
            haloBlue.arc(wx, wy, rHalo, 0, TAU)
            coreBlue.moveTo(wx + rCore, wy)
            coreBlue.arc(wx, wy, rCore, 0, TAU)
          } else {
            const sx = snap(x)
            const sy = snap(y)
            calmBlue.moveTo(sx + el, sy)
            calmBlue.arc(sx, sy, el, 0, TAU)
          }
        } else {
          const p = idlePaths[idleBand(x, y, now, bandOff[i])]
          p.moveTo(x + 0.72, y)
          p.arc(x, y, 0.72, 0, TAU)
        }
      }

      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = `rgba(${INK[0]},${INK[1]},${INK[2]},${IDLE_ALPHAS[b]})`
        ctx.fill(idlePaths[b])
      }
      ctx.fillStyle = `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},0.108)`
      ctx.fill(haloBlue)
      ctx.fillStyle = `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},0.6)`
      ctx.fill(coreBlue)
      ctx.fillStyle = `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},0.4)`
      ctx.fill(calmBlue)

      raf = requestAnimationFrame(frame)
    }

    let rTimer = 0
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rTimer)
      rTimer = requestAnimationFrame(rebuild)
    })
    resizeObserver.observe(holder)

    const start = () => {
      rebuild()
      raf = requestAnimationFrame(frame)
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start)
    } else {
      start()
    }

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(rTimer)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [holderRef, canvasRef])
}

export default function Footer() {
  const holderRef = useRef(null)
  const canvasRef = useRef(null)
  useDotCanvas(holderRef, canvasRef)

  return (
    <footer className="relative overflow-hidden bg-white pb-[4px] pt-[235px]">
      <Reveal><div className="mx-auto flex w-full max-w-[573px] items-center justify-between">
        <span className="rounded-full bg-[#f0f0f0] px-3 py-1.5 text-[14px] font-medium tracking-[-0.1504px] text-[#8d8d8d]">
          v<span className="text-[#646464]">2.0.0</span>
        </span>
        <img src={signature} alt="Jahan" className="h-[60px] w-auto mix-blend-multiply" />
      </div></Reveal>
      <div
        ref={holderRef}
        className="relative mx-auto mt-[67px] w-[1107px] max-w-[92%] select-none"
        style={{ aspectRatio: '1344 / 343' }}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block size-full" />
      </div>
    </footer>
  )
}
