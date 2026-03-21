import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { useListProducts, useListFeaturedProducts } from "@workspace/api-client-react";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck, Stethoscope, Microscope, Activity, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useListFeaturedProducts();
  const { data: offersData, isLoading: offersLoading } = useListProducts({ weeklyOffer: true, limit: 4 });

  const categories = [
    { name: "Diagnostic Devices", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Surgical Tools", icon: Stethoscope, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Lab Equipment", icon: Microscope, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Test Kits", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-medical.png`}
            alt="Clean medical background" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <ShieldCheck className="h-4 w-4" />
                Kenya's #1 Medical Supplier
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Your Trusted Partner in <span className="text-gradient">Medical Supplies</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                Affordable, reliable diagnostic and surgical equipment delivered across Kenya. Equipping healthcare professionals with tools they can trust.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/shop?weeklyOffer=true">View Weekly Offers</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center gap-3 px-4 pt-4 md:pt-0">
              <div className="bg-primary/10 p-4 rounded-full text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Free delivery within Nairobi CBD</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4 pt-8 md:pt-0">
              <div className="bg-primary/10 p-4 rounded-full text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Trusted Quality</h3>
              <p className="text-sm text-muted-foreground">Verified products for professionals</p>
            </div>
            <div className="flex flex-col items-center gap-3 px-4 pt-8 md:pt-0">
              <div className="bg-primary/10 p-4 rounded-full text-primary">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">M-Pesa and Cash on Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Everything you need for your practice</p>
            </div>
            <Link href="/shop" className="text-primary font-semibold hover:underline hidden sm:flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 text-center flex flex-col items-center gap-4"
              >
                <div className={cn("p-4 rounded-full transition-transform group-hover:scale-110 duration-300", cat.bg, cat.color)}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Offers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary to-blue-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-3">Limited Time</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Weekly Offers</h2>
                <p className="text-blue-100 max-w-xl">Save big on essential supplies. Discounts up to 30% off selected items.</p>
              </div>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/shop?weeklyOffer=true">Shop All Offers</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {offersLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/10 animate-pulse h-80 rounded-2xl"></div>
                ))
              ) : offersData?.products?.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block relative">
                  <div className="absolute top-6 left-6 z-10 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    Offer
                  </div>
                  <div className="aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Activity className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-primary text-lg">{formatPrice(product.discountPrice || product.price)}</span>
                    {product.discountPrice && (
                      <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover our most popular and highly recommended medical supplies, trusted by clinics nationwide.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
               Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-200 animate-pulse h-80 rounded-2xl"></div>
              ))
            ) : featuredProducts?.slice(0,8).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group bg-white rounded-2xl p-4 border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col h-full">
                <div className="aspect-square rounded-xl bg-slate-50 mb-4 overflow-hidden relative p-4 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <Stethoscope className="w-16 h-16 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-muted-foreground mb-1">{product.categoryName}</div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <span className="font-bold text-lg">{formatPrice(product.discountPrice || product.price)}</span>
                     <div className="h-8 w-8 rounded-full bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                       <ArrowRight className="h-4 w-4" />
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">View Full Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
           <img 
            src={`${import.meta.env.BASE_URL}images/trust-banner.png`}
            alt="Trust banner" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need help choosing the right equipment?</h2>
          <p className="text-lg text-muted-foreground mb-8">Our team of experts is ready to assist you with specifications, bulk orders, and custom requirements.</p>
          <Button variant="whatsapp" size="lg" className="text-lg px-8" asChild>
             <a href="https://wa.me/254706072888?text=Hello,%20I%20need%20help%20choosing%20medical%20equipment." target="_blank" rel="noopener noreferrer">
               Talk to us on WhatsApp
             </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
