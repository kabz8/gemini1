import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Tag } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const SLIDES = [
  {
    id: "glucometer",
    image: `${BASE}images/hero-glucometer.png`,
    tag: "Weekly Offer",
    name: "OnCall Plus Blood Glucose Meter",
    category: "Diagnostic Devices",
    desc: "Accurate plasma glucose readings in seconds. Comes with 50 test strips.",
    price: 1499,
    originalPrice: 1699,
    accentColor: "#1a5eff",
    href: "/product/1",
  },
  {
    id: "centrifuge",
    image: `${BASE}images/hero-centrifuge.png`,
    tag: "Lab Essential",
    name: "Electric Centrifuge 800-1",
    category: "Lab Equipment",
    desc: "High-performance centrifuge for blood separation and clinical testing.",
    price: 7500,
    accentColor: "#0ea5e9",
    href: "/product/11",
  },
  {
    id: "testkits",
    image: `${BASE}images/hero-testkits.png`,
    tag: "Best Sellers",
    name: "Rapid Diagnostic Test Kits",
    category: "Test Kits",
    desc: "Fast, accurate results in 25 seconds. WHO-approved antigen detection.",
    price: 599,
    accentColor: "#9333ea",
    href: "/shop?category=Test+Kits",
  },
  {
    id: "suture",
    image: `${BASE}images/hero-suture.png`,
    tag: "Students",
    name: "Suture Practising Kit",
    category: "Surgical Tools",
    desc: "Perfect for medical students. Includes suture pad, scissors & forceps.",
    price: 3649,
    originalPrice: 4299,
    accentColor: "#e11d48",
    href: "/product/6",
  },
  {
    id: "diagnostics",
    image: `${BASE}images/hero-diagnostics.png`,
    tag: "Popular",
    name: "Complete Diagnostic Essentials",
    category: "Diagnostic Devices",
    desc: "Stethoscope, BP Monitor, Pulse Oximeter & Thermometer — all in one place.",
    price: 2500,
    accentColor: "#059669",
    href: "/shop?category=Diagnostic+Devices",
  },
];

export function HeroSlider() {
  const autoplay = Autoplay({ delay: 5500, stopOnInteraction: true });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", update);
    return () => { emblaApi.off("select", update); };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-[#0a0f1e]" style={{ height: "88vh", minHeight: 560, maxHeight: 820 }}>
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full touch-pan-y">
          {SLIDES.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full min-w-0">

              {/* Background image — full bleed, right-aligned composition */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.name}
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                />
                {/* Scrim: strong on left, fade to transparent on right */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(105deg, rgba(5,8,20,0.97) 0%, rgba(5,8,20,0.85) 38%, rgba(5,8,20,0.35) 62%, rgba(5,8,20,0.08) 100%)"
                  }}
                />
              </div>

              {/* Content panel — floated left */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
                  <div className="max-w-md xl:max-w-lg">

                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-5">
                      <span
                        className="inline-flex items-center gap-1.5 text-white text-[11px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: slide.accentColor }}
                      >
                        <Tag className="h-3 w-3" />
                        {slide.tag}
                      </span>
                      <span className="text-white/40 text-xs">{slide.category}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.06] mb-4 tracking-tight">
                      {slide.name}
                    </h2>

                    {/* Description */}
                    <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-7 max-w-sm">
                      {slide.desc}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-8">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {formatPrice(slide.price)}
                      </span>
                      {slide.originalPrice && (
                        <>
                          <span className="text-lg text-white/35 line-through">
                            {formatPrice(slide.originalPrice)}
                          </span>
                          <span
                            className="text-xs font-black px-2.5 py-1 rounded-lg text-white"
                            style={{ backgroundColor: slide.accentColor }}
                          >
                            Save {Math.round(((slide.originalPrice - slide.price) / slide.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="flex gap-3 flex-wrap">
                      <Link
                        href={slide.href}
                        className="inline-flex items-center gap-2 text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl text-sm"
                        style={{ backgroundColor: slide.accentColor }}
                      >
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={`https://wa.me/254706072888?text=Hi,%20I'd%20like%20to%20order%20${encodeURIComponent(slide.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm backdrop-blur-sm"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Order
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide number */}
              <div className="absolute top-6 right-6 text-white/25 text-xs font-mono tracking-widest select-none">
                {String(SLIDES.indexOf(slide) + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 border border-white/15 text-white rounded-full p-2.5 transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 border border-white/15 text-white rounded-full p-2.5 transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Progress dots + slide title strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Dots */}
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-400 ${
                  i === current
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          {/* Mini slide labels */}
          <div className="hidden sm:flex gap-3">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`text-[10px] font-semibold uppercase tracking-wider transition-all truncate max-w-[80px] ${
                  i === current ? "text-white" : "text-white/25 hover:text-white/50"
                }`}
              >
                {s.category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
