import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Search, X, SlidersHorizontal } from "lucide-react";
import { ProductImage } from "@/components/product-image";

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
    setCategory(initCategory);
    setWeeklyOfferOnly(initWeeklyOffer);
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
    <div className="min-h-screen pt-20 bg-background">

      {/* Page header */}
      <div className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Catalog</p>
            <h1 className="text-3xl font-extrabold text-foreground">
              {weeklyOfferOnly ? "Weekly Offers" : category ?? "All Products"}
            </h1>
            {!isLoading && (
              <p className="text-muted-foreground text-sm mt-1">{products.length} product{products.length !== 1 ? "s" : ""}</p>
            )}
          </div>

          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside
          className={`
            ${isMobileFiltersOpen ? "fixed inset-0 z-50 bg-card p-6 overflow-y-auto" : "hidden"}
            md:block w-full md:w-60 shrink-0
          `}
        >
          {/* Mobile close */}
          {isMobileFiltersOpen && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                className="p-2 rounded-xl hover:bg-accent transition-colors"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Offer filter */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Promotions</h3>
            <button
              onClick={() => { setWeeklyOfferOnly(!weeklyOfferOnly); setIsMobileFiltersOpen(false); }}
              className={`w-full text-left text-sm py-2 px-3 rounded-xl font-semibold transition-colors ${weeklyOfferOnly ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
            >
              Weekly Offers Only
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Category</h3>
            <div className="space-y-1">
              <button
                className={`block w-full text-left text-sm py-2 px-3 rounded-xl font-semibold transition-colors ${!category ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                onClick={() => { setCategory(undefined); setIsMobileFiltersOpen(false); }}
              >
                All Categories
              </button>
              {categoriesData?.map((c) => (
                <button
                  key={c.id}
                  className={`block w-full text-left text-sm py-2 px-3 rounded-xl font-semibold transition-colors ${category === c.name ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                  onClick={() => { setCategory(c.name); setIsMobileFiltersOpen(false); }}
                >
                  {c.name}
                  <span className="ml-1.5 text-xs opacity-50">({c.productCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Sort By</h3>
            <select
              className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
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
            <Button className="w-full mt-8" onClick={() => setIsMobileFiltersOpen(false)}>
              Show Results ({products.length})
            </Button>
          )}
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-bold mb-2 text-foreground">No products found</h3>
              <p className="text-muted-foreground mb-6 text-sm">Try adjusting your search or filters.</p>
              <Button onClick={() => { setSearch(""); setCategory(undefined); setWeeklyOfferOnly(false); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden relative">
                    {product.weeklyOffer && (
                      <span className="absolute top-3 left-3 z-10 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Offer
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/70 z-10 flex items-center justify-center">
                        <span className="bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <ProductImage
                      imageUrl={product.imageUrl}
                      categoryName={product.categoryName}
                      alt={product.name}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{product.categoryName}</p>
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-black text-primary text-base">
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
          )}
        </main>
      </div>
    </div>
  );
}
