import { useParams, Link } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { useState } from "react";
import { Check, Minus, Plus, Share2, Shield, Truck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductImage } from "@/components/product-image";
import { motion } from "framer-motion";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useGetProduct(Number(id));
  const { addItem } = useCart();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "delivery">("desc");

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 aspect-square rounded-3xl glass-card animate-pulse" />
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
          <div className="h-10 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-10 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-foreground mb-2">Product not found</p>
        <p className="text-muted-foreground mb-8 text-sm">This item may be unavailable or removed.</p>
        <Link href="/shop"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop</Button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({ title: "Added to cart ✓", description: `${quantity}× ${product.name}` });
  };

  const currentPrice = product.discountPrice ?? product.price;
  const savePct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-[4.5rem] bg-background pb-28 md:pb-12 overflow-hidden">
      {/* Ambient blobs */}
      <div aria-hidden className="fixed top-0 right-0 w-96 h-96 bg-primary rounded-full opacity-10 blur-[130px] pointer-events-none" />
      <div aria-hidden className="fixed bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-[130px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> Shop
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">{product.categoryName}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-10 lg:gap-16"
        >
          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="glass-card rounded-3xl overflow-hidden aspect-square border border-border/50 relative group shadow-2xl">
              {product.weeklyOffer && (
                <span className="absolute top-5 left-5 z-10 bg-primary text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                  Weekly Offer
                </span>
              )}
              <ProductImage
                imageUrl={product.imageUrl}
                categoryName={product.categoryName}
                alt={product.name}
                iconClassName="h-32 w-32"
                className="group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full uppercase tracking-wider">
                {product.categoryName}
              </span>
              <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-5 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 pb-6 mb-6 border-b border-border/50">
              <span className="text-4xl font-black text-primary">{formatPrice(currentPrice)}</span>
              {product.discountPrice != null && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  <span className="text-sm font-bold bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-lg">
                    Save {savePct}%
                  </span>
                </>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Actions Box */}
            <div className="glass-card rounded-2xl border border-border/50 p-5 space-y-5 mb-6">
              {/* Stock */}
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-destructive"}`} />
                <span className={`font-semibold text-sm ${product.inStock ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                  {product.inStock ? `In Stock — ${product.stock} available` : "Out of Stock"}
                </span>
              </div>

              {/* Quantity */}
              {product.inStock && (
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm text-foreground">Qty:</span>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background/50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3.5 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-1">
                <Button size="lg" className="w-full h-12 font-bold text-base" disabled={!product.inStock} onClick={handleAddToCart}>
                  <Check className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl px-4 py-3 border border-border/50 flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-xs font-semibold">1 Year Warranty</span>
              </div>
              <div className="glass-card rounded-xl px-4 py-3 border border-border/50 flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary shrink-0" />
                <span className="text-xs font-semibold">Fast Dispatch</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mt-16 border-t border-border/50 pt-10">
          <div className="flex border-b border-border/50 mb-8">
            {[
              { id: "desc", label: "Description" },
              { id: "specs", label: "Specifications" },
              { id: "delivery", label: "Delivery" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-4 px-6 text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition-all",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            {activeTab === "desc" && (
              <div dangerouslySetInnerHTML={{ __html: (product.description ?? "No description available.").replace(/\n/g, "<br/>") }} />
            )}
            {activeTab === "specs" && (
              <div dangerouslySetInnerHTML={{ __html: (product.specifications ?? "No specifications available.").replace(/\n/g, "<br/>") }} />
            )}
            {activeTab === "delivery" && (
              <div dangerouslySetInnerHTML={{ __html: (product.deliveryInfo ?? "Standard delivery. Free within Nairobi CBD.").replace(/\n/g, "<br/>") }} />
            )}
          </div>
        </div>
      </div>

      {/* Sticky mobile bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 z-40 shadow-2xl">
        <Button className="w-full font-bold" disabled={!product.inStock} onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
