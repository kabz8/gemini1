import { useState } from "react";
import { Link } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";

export function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc" | "popular">("popular");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: categoriesData } = useListCategories();
  const { data: productsData, isLoading } = useListProducts({
    search: search || undefined,
    category: category,
    sort: sort,
    limit: 50,
  });

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      <div className="bg-white border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-2">Browse our complete catalog of medical supplies</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsMobileFiltersOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Sidebar */}
        <aside className={`
          ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} 
          md:block w-full md:w-64 shrink-0 space-y-8
        `}>
          {isMobileFiltersOpen && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          <div className="hidden md:block">
            <h3 className="font-semibold mb-3">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              <button 
                className={`block w-full text-left text-sm py-1 ${!category ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => { setCategory(undefined); setIsMobileFiltersOpen(false); }}
              >
                All Categories
              </button>
              {categoriesData?.map(c => (
                <button 
                  key={c.id}
                  className={`block w-full text-left text-sm py-1 ${category === c.name ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => { setCategory(c.name); setIsMobileFiltersOpen(false); }}
                >
                  {c.name} <span className="text-xs opacity-50 ml-1">({c.productCount})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
             <h3 className="font-semibold mb-3">Sort By</h3>
             <select 
                className="w-full p-2 rounded-xl border border-border bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                <option value="popular">Popularity</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
             </select>
          </div>

          {isMobileFiltersOpen && (
            <Button className="w-full mt-8" onClick={() => setIsMobileFiltersOpen(false)}>
              Apply Filters
            </Button>
          )}
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
               {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white border border-border rounded-2xl h-80 animate-pulse"></div>
               ))}
            </div>
          ) : productsData?.products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-12 text-center">
               <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
               <h3 className="text-xl font-bold mb-2">No products found</h3>
               <p className="text-muted-foreground mb-6">Try adjusting your search or filters to find what you're looking for.</p>
               <Button onClick={() => { setSearch(""); setCategory(undefined); }}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {productsData?.products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group bg-white rounded-2xl p-4 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col">
                  <div className="aspect-square rounded-xl bg-slate-50 mb-4 overflow-hidden relative p-4 flex items-center justify-center">
                    {product.weeklyOffer && (
                      <div className="absolute top-2 left-2 z-10 bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        Offer
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                         <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                      </div>
                    )}
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1 line-clamp-1">{product.categoryName}</div>
                    <h3 className="font-medium text-sm md:text-base text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="mt-auto pt-2 flex items-center flex-wrap gap-2">
                       <span className="font-bold text-base md:text-lg text-primary">{formatPrice(product.discountPrice || product.price)}</span>
                       {product.discountPrice && (
                         <span className="text-xs md:text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>
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
