import { useParams } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { useState } from "react";
import { Check, Minus, Plus, Share2, Shield, Truck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ProductImage } from "@/components/product-image";

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
        <div className="w-full md:w-1/2 aspect-square bg-card border border-border rounded-3xl animate-pulse" />
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-5 bg-muted rounded w-1/4 animate-pulse" />
          <div className="h-10 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-10 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-32 bg-muted rounded w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-2xl font-bold text-foreground mb-2">Product not found</p>
        <p className="text-muted-foreground mb-8 text-sm">This item may be unavailable or removed.</p>
        <Link href="/shop">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({ title: "Added to cart", description: `${quantity}× ${product.name}` });
  };

  const currentPrice = product.discountPrice ?? product.price;
  const whatsappMsg = encodeURIComponent(
    `Hi Gemini Surgicals, I'd like to order: ${product.name} at ${formatPrice(currentPrice)}. Please advise on delivery.`
  );
  const whatsappUrl = `https://wa.me/254706072888?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen pt-20 bg-background pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Shop
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">{product.categoryName}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="rounded-3xl overflow-hidden aspect-square border border-border relative group">
              {product.weeklyOffer && (
                <span className="absolute top-5 left-5 z-10 bg-destructive text-white text-xs font-bold px-3 py-1 rounded-lg">
                  Weekly Offer
                </span>
              )}
              <ProductImage
                imageUrl={product.imageUrl}
                categoryName={product.categoryName}
                alt={product.name}
                iconClassName="h-32 w-32"
              />
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                {product.categoryName}
              </span>
              <button className="p-2 hover:bg-accent rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-5 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 pb-6 mb-6 border-b border-border">
              <span className="text-4xl font-black text-primary">{formatPrice(currentPrice)}</span>
              {product.discountPrice != null && (
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
              )}
              {product.discountPrice != null && (
                <span className="text-sm font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-lg">
                  Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-muted-foreground text-base mb-6 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Actions Box */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-5 mb-6">
              {/* Stock status */}
              <div className="flex items-center gap-3">
                {product.inStock ? (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block" />
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                      In Stock — {product.stock} available
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive inline-block" />
                    <span className="text-destructive font-semibold text-sm">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity */}
              {product.inStock && (
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm text-foreground">Qty:</span>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-accent transition-colors text-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-accent transition-colors text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button size="lg" className="flex-1 h-12 font-bold" disabled={!product.inStock} onClick={handleAddToCart}>
                  <Check className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#22c55e] text-white font-bold rounded-xl transition-colors text-sm"
                >
                  Order via WhatsApp
                </a>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                <Shield className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-xs font-semibold text-foreground">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                <Truck className="h-5 w-5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground">Fast Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-border pt-10">
          <div className="flex border-b border-border mb-8 overflow-x-auto">
            {[
              { id: "desc", label: "Description" },
              { id: "specs", label: "Specifications" },
              { id: "delivery", label: "Delivery Info" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-4 px-6 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
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
              <div
                dangerouslySetInnerHTML={{
                  __html: (product.description ?? "No description available.").replace(/\n/g, "<br/>"),
                }}
              />
            )}
            {activeTab === "specs" && (
              <div
                dangerouslySetInnerHTML={{
                  __html: (product.specifications ?? "No specifications available.").replace(/\n/g, "<br/>"),
                }}
              />
            )}
            {activeTab === "delivery" && (
              <div
                dangerouslySetInnerHTML={{
                  __html: (product.deliveryInfo ?? "Standard delivery applies. Free within Nairobi CBD.").replace(/\n/g, "<br/>"),
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sticky mobile bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40 flex gap-3">
        <Button className="flex-1 font-bold" disabled={!product.inStock} onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center bg-[#25D366] hover:bg-[#22c55e] text-white font-bold rounded-xl transition-colors text-sm"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
