import avatar from '../assets/testimonial-avatar.png'
import { Reveal } from './motion'

export default function Testimonial() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-[15px]">
      <Reveal><blockquote className="max-w-[690px] text-center text-[28px] leading-[39.2px] tracking-[-0.84px] text-black">
        "Working with Jahan felt like having a seasoned design partner{' '}
        <strong className="font-display font-medium">who truly understood our vision for Greenely</strong> and
        brought it to life in ways we hadn't even imagined."
      </blockquote></Reveal>
      <Reveal delay={120}><figure className="flex items-center gap-3">
        <img src={avatar} alt="Tanmoy Bari" className="size-[33px] rounded-full object-cover" />
        <figcaption className="flex flex-col gap-1.5">
          <p className="text-[14px] leading-[15.68px] tracking-[-0.14px] text-black">Tanmoy Bari</p>
          <p className="text-[12px] font-medium leading-[13.44px] tracking-[-0.12px] text-[#545454]">
            Co-founder of Greenely
          </p>
        </figcaption>
      </figure></Reveal>
    </section>
  )
}
