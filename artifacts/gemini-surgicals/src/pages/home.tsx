import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useListProducts, useListFeaturedProducts } from "@workspace/api-client-react";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck, Stethoscope, Microscope, Activity, HeartPulse, FlaskConical, Droplets, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProductImage } from "@/components/product-image";
import { HeroSlider } from "@/components/hero-slider";

const categoryLinks = [
  { name: "Diagnostic Devices", slug: "Diagnostic Devices", icon: Activity, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/60" },
  { name: "Test Kits", slug: "Test Kits", icon: FlaskConical, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/60" },
  { name: "Surgical Tools", slug: "Surgical Tools", icon: Stethoscope, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/60" },
  { name: "Student Kits", slug: "Student Kits", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/60" },
  { name: "Lab Equipment", slug: "Lab Equipment", icon: Microscope, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/60" },
  { name: "Blood Collection", slug: "Blood Collection", icon: Droplets, color: "text-red-400", bg: "bg-red-50 dark:bg-red-950/60" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useListFeaturedProducts();
  const { data: offersData, isLoading: offersLoading } = useListProducts({ weeklyOffer: true, limit: 6 });

  return (
    <div className="flex flex-col min-h-screen pt-[4.5rem]">

      {/* ── Hero Slider ─────────────────────────────────── */}
      <HeroSlider />

      {/* ── Trust Strip ─────────────────────────────────── */}
      <section className="relative py-8 overflow-hidden dot-grid">
        <div aria-hidden className="absolute inset-0 bg-background/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: Truck, title: "Free Nairobi CBD Delivery", desc: "On all orders within CBD" },
              { icon: ShieldCheck, title: "Verified Products", desc: "Quality checked by professionals" },
              { icon: BadgeCheck, title: "M-Pesa Accepted", desc: "Fast, secure mobile payments" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm leading-tight">{item.title}</p>
                  <p className="text-muted-foreground text-xs hidden sm:block mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        {/* Ambient blobs */}
        <div aria-hidden className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-pink-200 dark:bg-pink-900 rounded-full opacity-20 blur-[100px] pointer-events-none" />
        <div aria-hidden className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Browse</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Shop by Category</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categoryLinks.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className={`group glass-card rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 block`}
                >
                  <div className={`${cat.bg} ${cat.color} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekly Offers ───────────────────────────────── */}
      <section className="relative py-20 overflow-hidden dot-grid">
        <div aria-hidden className="absolute inset-0 bg-background/75 dark:bg-background/85" />
        <div aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary rounded-full opacity-10 blur-[150px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Limited Time</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Weekly Offers</h2>
              <p className="text-muted-foreground text-sm mt-1">Updated every week — save big on essentials</p>
            </div>
            <Link
              href="/shop?weeklyOffer=true"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shrink-0 shadow-md"
            >
              Shop All Offers <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {offersLoading
              ? Array(6).fill(0).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl h-64 animate-pulse" />
                ))
              : offersData?.products?.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 block border border-border/50"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Sale
                        </span>
                        <ProductImage
                          imageUrl={product.imageUrl}
                          categoryName={product.categoryName}
                          alt={product.name}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-foreground text-xs mb-1.5 line-clamp-2 leading-snug">{product.name}</h3>
                        <span className="font-black text-primary text-sm">{formatPrice(product.discountPrice ?? product.price)}</span>
                        {product.discountPrice != null && (
                          <span className="text-[10px] text-muted-foreground line-through ml-1.5">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div aria-hidden className="absolute top-0 left-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-15 blur-[120px] pointer-events-none" />
        <div aria-hidden className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 dark:bg-pink-900 rounded-full opacity-15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Catalog</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Featured Products</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Trusted by clinics and healthcare professionals across Kenya.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredLoading
              ? Array(8).fill(0).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
                ))
              : Array.isArray(featuredProducts)
                ? featuredProducts.slice(0, 8).map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-border/50"
                    >
                      <div className="aspect-square overflow-hidden">
                        <ProductImage
                          imageUrl={product.imageUrl}
                          categoryName={product.categoryName}
                          alt={product.name}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{product.categoryName}</p>
                        <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1">
                          {product.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <span className="font-black text-primary">{formatPrice(product.discountPrice ?? product.price)}</span>
                            {product.discountPrice != null && (
                              <span className="text-xs text-muted-foreground line-through ml-1.5">{formatPrice(product.price)}</span>
                            )}
                          </div>
                          <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
                : null}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="font-bold" asChild>
              <Link href="/shop">View Full Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ─────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden dot-grid">
        <div aria-hidden className="absolute inset-0 bg-background/80" />
        <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[30rem] h-[30rem] bg-[#25D366] rounded-full opacity-10 blur-[130px]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-10 md:p-14 border border-border/50">
            <div className="w-16 h-16 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-3">Need help choosing equipment?</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
              Our team is ready to assist with specifications, bulk orders, and custom requirements — right on WhatsApp.
            </p>
            <a
              href="https://wa.me/254706072888?text=Hello,%20I%20need%20help%20choosing%20medical%20equipment."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-base px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
