import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useListProducts, useListFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck, Stethoscope, Microscope, Activity, HeartPulse, FlaskConical, Droplets, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProductImage } from "@/components/product-image";

const categoryLinks = [
  { name: "Diagnostic Devices", slug: "Diagnostic Devices", icon: Activity, bg: "bg-blue-50 dark:bg-blue-950", color: "text-blue-500 dark:text-blue-400" },
  { name: "Test Kits", slug: "Test Kits", icon: FlaskConical, bg: "bg-purple-50 dark:bg-purple-950", color: "text-purple-500 dark:text-purple-400" },
  { name: "Surgical Tools", slug: "Surgical Tools", icon: Stethoscope, bg: "bg-indigo-50 dark:bg-indigo-950", color: "text-indigo-500 dark:text-indigo-400" },
  { name: "Student Kits", slug: "Student Kits", icon: HeartPulse, bg: "bg-rose-50 dark:bg-rose-950", color: "text-rose-500 dark:text-rose-400" },
  { name: "Lab Equipment", slug: "Lab Equipment", icon: Microscope, bg: "bg-teal-50 dark:bg-teal-950", color: "text-teal-500 dark:text-teal-400" },
  { name: "Blood Collection", slug: "Blood Collection", icon: Droplets, bg: "bg-red-50 dark:bg-red-950", color: "text-red-400 dark:text-red-400" },
];

const trustItems = [
  { icon: Truck, title: "Free CBD Delivery", desc: "Free delivery within Nairobi CBD" },
  { icon: ShieldCheck, title: "Trusted Quality", desc: "Verified by clinics & professionals" },
  { icon: BadgeCheck, title: "M-Pesa Accepted", desc: "Secure M-Pesa & Cash on Delivery" },
];

export function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useListFeaturedProducts();
  const { data: offersData, isLoading: offersLoading } = useListProducts({ weeklyOffer: true, limit: 4 });

  return (
    <div className="flex flex-col min-h-screen pt-20">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="bg-background py-20 lg:py-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08] mb-6">
                Your Trusted Partner in{" "}
                <span className="text-primary">Medical Supplies</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Affordable, reliable diagnostic and surgical equipment delivered across Kenya. Equipping healthcare professionals with tools they can trust.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/shop?weeklyOffer=true">View Weekly Offers</Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero side: stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {trustItems.map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
              <div className="bg-primary text-white rounded-2xl p-6 flex flex-col gap-2 col-span-2 shadow-md">
                <p className="text-3xl font-black">15+</p>
                <p className="font-semibold opacity-90">Products in Stock</p>
                <p className="text-sm opacity-70">From diagnostic kits to surgical tools</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip (mobile) ──────────────────────────── */}
      <section className="border-b border-border bg-card lg:hidden py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            {trustItems.map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2 text-center">
                <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-foreground">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Browse</p>
              <h2 className="text-3xl font-extrabold text-foreground">Shop by Category</h2>
            </div>
            <Link href="/shop" className="text-primary font-semibold hover:underline hidden sm:flex items-center gap-1 text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categoryLinks.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 text-center flex flex-col items-center gap-3"
              >
                <div className={`${cat.bg} ${cat.color} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekly Offers ─────────────────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3">Limited Time</span>
              <h2 className="text-3xl font-extrabold text-white">Weekly Offers</h2>
              <p className="text-blue-100 mt-1 text-sm">Save on essential supplies — updated every week</p>
            </div>
            <Link
              href="/shop?weeklyOffer=true"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shrink-0"
            >
              Shop All Offers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {offersLoading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/10 animate-pulse h-80 rounded-2xl" />
                ))
              : offersData?.products?.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <span className="absolute top-3 left-3 z-10 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Offer
                      </span>
                      <ProductImage
                        imageUrl={product.imageUrl}
                        categoryName={product.categoryName}
                        alt={product.name}
                        iconClassName="h-20 w-20"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 leading-snug">{product.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-primary text-lg">
                          {formatPrice(product.discountPrice ?? product.price)}
                        </span>
                        {product.discountPrice != null && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Catalog</p>
            <h2 className="text-3xl font-extrabold text-foreground mb-3">Featured Products</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Trusted by clinics and healthcare professionals across Kenya.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredLoading
              ? Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-card border border-border animate-pulse h-72 rounded-2xl" />
                ))
              : featuredProducts?.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden">
                      <ProductImage
                        imageUrl={product.imageUrl}
                        categoryName={product.categoryName}
                        alt={product.name}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs text-muted-foreground mb-1">{product.categoryName}</p>
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1">
                        {product.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="font-black text-primary text-base">
                            {formatPrice(product.discountPrice ?? product.price)}
                          </span>
                          {product.discountPrice != null && (
                            <span className="text-xs text-muted-foreground line-through ml-2">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">View Full Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ──────────────────────────────────── */}
      <section className="py-16 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#25D366]/10 text-[#25D366] mb-6">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-3">Need help choosing equipment?</h2>
          <p className="text-muted-foreground mb-8 text-sm max-w-md mx-auto">
            Our team is ready to assist with specifications, bulk orders, and custom requirements.
          </p>
          <a
            href="https://wa.me/254706072888?text=Hello,%20I%20need%20help%20choosing%20medical%20equipment."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold text-base px-8 py-4 rounded-2xl transition-colors shadow-md"
          >
            <MessageCircle className="h-5 w-5" />
            Talk to us on WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
}
