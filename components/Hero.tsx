import Image from 'next/image'
import heroImg from '@/assets/hero_illustration.png'
import { IconPlus } from '@tabler/icons-react'

const Hero = () => {
  return (
    <section className="wrapper w-full flex items-start justify-center pt-28 mb-10 md:mb-16 pb-12 px-6">
      <div className="w-full max-w-[1280px] bg-[#f2e7d5] rounded-[48px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative shadow-sm">
        
        {/* Left Section */}
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          <h1 className="text-[52px] lg:text-[68px] font-serif font-bold text-[#1a1a1a] leading-tight tracking-tight">
            Your Library
          </h1>
          <p className="text-xl text-black/60 max-w-md leading-relaxed font-normal mb-6">
            Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
          </p>
          <button className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-8 py-5 rounded-2xl font-bold text-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0">
            <IconPlus size={28} stroke={3} />
            Add new book
          </button>
        </div>

        {/* Center Section - Illustration */}
        <div className="flex-[1.2] flex justify-center z-10 w-full relative">
          <Image 
            src={heroImg} 
            alt="Vintage books and globe illustration"
            className="w-full h-auto max-w-[480px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] scale-110 translate-y-4"
          />
        </div>

        {/* Right Section - Steps Card */}
        <div className="flex-initial w-full md:w-[360px] bg-white rounded-[32px] p-8 flex flex-col gap-10 shadow-xl z-20 border border-white/40">
          {[
            {
              num: "1",
              title: "Upload PDF",
              desc: "Add your book file"
            },
            {
              num: "2",
              title: "AI Processing",
              desc: "We analyze the content"
            },
            {
              num: "3",
              title: "Voice Chat",
              desc: "Discuss with AI"
            }
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-lg font-bold shrink-0 text-black/80">
                {step.num}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-xl text-black leading-none mb-1">{step.title}</h3>
                <p className="text-black/50 text-[15px] font-medium leading-none">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
