import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const SLIDES = [
  {
    id: "glucometer",
    image: `${BASE}images/slide-glucometer.jpg`,
    tag: "Weekly Offer",
    tagBg: "bg-pink-500",
    name: "OnCall Plus Blood Glucose Meter",
    category: "Diagnostic Devices",
    price: 1499,
    originalPrice: 1699,
    href: "/shop",
    blobA: "bg-blue-400",
    blobB: "bg-sky-300",
  },
  {
    id: "centrifugal",
    image: `${BASE}images/slide-centrifugal.jpg`,
    tag: "Lab Essential",
    tagBg: "bg-blue-500",
    name: "Centrifugal Machine 800-1",
    category: "Lab Equipment",
    price: 7500,
    href: "/shop",
    blobA: "bg-indigo-400",
    blobB: "bg-blue-300",
  },
  {
    id: "pylori",
    image: `${BASE}images/slide-pylori.jpg`,
    tag: "Weekly Offer",
    tagBg: "bg-pink-600",
    name: "H. pylori Antigen Test Kit (25s)",
    category: "Test Kits",
    price: 1799,
    originalPrice: 2200,
    href: "/shop",
    blobA: "bg-pink-400",
    blobB: "bg-purple-400",
  },
  {
    id: "suture",
    image: `${BASE}images/slide-suture.jpg`,
    tag: "Student Offer",
    tagBg: "bg-orange-500",
    name: "Suture Practising Kit",
    category: "Surgical Tools",
    price: 3649,
    originalPrice: 4299,
    href: "/shop",
    blobA: "bg-orange-300",
    blobB: "bg-amber-300",
  },
  {
    id: "vdrl",
    image: `${BASE}images/slide-vdrl.jpg`,
    tag: "Weekly Offer",
    tagBg: "bg-purple-600",
    name: "VDRL Syphilis Test Kit (50s)",
    category: "Test Kits",
    price: 899,
    originalPrice: 1100,
    href: "/shop",
    blobA: "bg-purple-400",
    blobB: "bg-fuchsia-300",
  },
  {
    id: "urinalysis",
    image: `${BASE}images/slide-urinalysis.jpg`,
    tag: "Best Seller",
    tagBg: "bg-teal-500",
    name: "Urinalysis Strips 10T — 100 Strips",
    category: "Test Kits",
    price: 599,
    href: "/shop",
    blobA: "bg-teal-300",
    blobB: "bg-cyan-300",
  },
];

export function HeroSlider() {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: true });
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

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden" style={{ height: "90vh", minHeight: 520, maxHeight: 800 }}>
      {/* Ambient blobs behind everything */}
      <div aria-hidden className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${slide.blobA} opacity-30 blur-[100px] pointer-events-none transition-colors duration-700`} />
      <div aria-hidden className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full ${slide.blobB} opacity-25 blur-[100px] pointer-events-none transition-colors duration-700`} />

      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {SLIDES.map((s) => (
            <div key={s.id} className="relative flex-[0_0_100%] h-full">
              {/* Background image */}
              <img
                src={s.image}
                alt={s.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ objectPosition: "center 40%" }}
              />
              {/* Overlay — not a gradient, just a left-side frosted panel */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end pb-16 md:items-center md:pb-0">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
                  <div className="max-w-lg">
                    <span className={`inline-block text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${s.tagBg}`}>
                      {s.tag}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
                      {s.name}
                    </h2>
                    <p className="text-white/70 text-sm mb-5">{s.category}</p>
                    <div className="flex items-baseline gap-3 mb-7">
                      <span className="text-4xl font-black text-white drop-shadow-lg">
                        {formatPrice(s.price)}
                      </span>
                      {s.originalPrice && (
                        <span className="text-lg text-white/50 line-through">
                          {formatPrice(s.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <Link
                        href={s.href}
                        className="inline-flex items-center gap-2 bg-white text-foreground font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm shadow-lg"
                      >
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={`https://wa.me/254706072888?text=Hi,%20I'd%20like%20to%20order%20${encodeURIComponent(s.name)}%20at%20KES%20${s.price}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#22c55e] transition-colors text-sm shadow-lg"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Order
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2.5 transition-all z-10 border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2.5 transition-all z-10 border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
