import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Search, X, SlidersHorizontal, ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { motion } from "framer-motion";

export function Shop() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initCategory = params.get("category") ?? undefined;
  const initWeeklyOffer = params.get("weeklyOffer") === "true";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(initCategory);
  const [weeklyOfferOnly, setWeeklyOfferOnly] = useState(initWeeklyOffer);
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc" | "popular">("popular");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setCategory(params.get("category") ?? undefined);
    setWeeklyOfferOnly(params.get("weeklyOffer") === "true");
  }, [searchStr]);

  const { data: categoriesData } = useListCategories();
  const { data: productsData, isLoading } = useListProducts({
    search: search || undefined,
    category,
    weeklyOffer: weeklyOfferOnly || undefined,
    sort,
    limit: 50,
  });

  const products = productsData?.products ?? [];

  return (
    <div className="min-h-screen pt-[4.5rem] bg-background">

      {/* Page header */}
      <div className="relative overflow-hidden py-10 dot-grid">
        <div aria-hidden className="absolute inset-0 bg-background/80" />
        <div aria-hidden className="absolute top-0 right-0 w-72 h-72 bg-primary rounded-full opacity-10 blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            {weeklyOfferOnly ? "Limited Time" : "Catalog"}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            {weeklyOfferOnly ? "Weekly Offers" : category ?? "All Products"}
          </h1>
          {!isLoading && (
            <p className="text-muted-foreground text-sm mt-1">{products.length} item{products.length !== 1 ? "s" : ""} found</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

        {/* Mobile filter button */}
        <div className="md:hidden">
          <Button
            variant="outline"
            className="flex items-center gap-2 font-semibold"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={`
            ${isMobileFiltersOpen ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-6 overflow-y-auto" : "hidden"}
            md:block w-full md:w-56 shrink-0
          `}
        >
          {isMobileFiltersOpen && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="mb-7">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Search</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Offer filter */}
          <div className="mb-7">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Promotions</p>
            <button
              onClick={() => { setWeeklyOfferOnly(!weeklyOfferOnly); setIsMobileFiltersOpen(false); }}
              className={`w-full text-left text-sm py-2 px-3 rounded-xl font-semibold transition-colors ${weeklyOfferOnly ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
            >
              Weekly Offers Only
            </button>
          </div>

          {/* Categories */}
          <div className="mb-7">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Category</p>
            <div className="space-y-0.5">
              <button
                className={`block w-full text-left text-sm py-2 px-3 rounded-xl font-semibold transition-colors ${!category ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
                onClick={() => { setCategory(undefined); setIsMobileFiltersOpen(false); }}
              >
                All Categories
              </button>
              {categoriesData?.map((c) => (
                <button
                  key={c.id}
                  className={`block w-full text-left text-sm py-2 px-3 rounded-xl font-semibold transition-colors ${category === c.name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
                  onClick={() => { setCategory(c.name); setIsMobileFiltersOpen(false); }}
                >
                  {c.name}
                  <span className="ml-1.5 text-[10px] opacity-40">({c.productCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Sort By</p>
            <select
              className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>

          {isMobileFiltersOpen && (
            <Button className="w-full mt-8 font-bold" onClick={() => setIsMobileFiltersOpen(false)}>
              Show {products.length} Results
            </Button>
          )}
        </aside>

        {/* Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card rounded-2xl border border-border/50 p-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold mb-2 text-foreground">No products found</h3>
              <p className="text-muted-foreground mb-6 text-sm">Try adjusting your search or filters.</p>
              <Button onClick={() => { setSearch(""); setCategory(undefined); setWeeklyOfferOnly(false); }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="group glass-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      {product.weeklyOffer && (
                        <span className="absolute top-2.5 left-2.5 z-10 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Offer
                        </span>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10 flex items-center justify-center">
                          <span className="bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
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
                          <span className="font-black text-primary text-base">
                            {formatPrice(product.discountPrice ?? product.price)}
                          </span>
                          {product.discountPrice != null && (
                            <span className="text-xs text-muted-foreground line-through ml-1.5">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
