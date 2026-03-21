import { useParams } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { useState } from "react";
import { Check, Info, Minus, Plus, Share2, Shield, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useGetProduct(Number(id));
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "delivery">("desc");

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
         <div className="w-full md:w-1/2 aspect-square bg-slate-100 rounded-3xl animate-pulse"></div>
         <div className="w-full md:w-1/2 space-y-6">
            <div className="h-10 bg-slate-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-slate-100 rounded w-1/4 animate-pulse"></div>
            <div className="h-32 bg-slate-100 rounded w-full animate-pulse"></div>
         </div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="min-h-screen pt-32 text-center text-xl text-muted-foreground">Product not found</div>;
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added.`,
    });
  };

  const currentPrice = product.discountPrice || product.price;
  const whatsappMsg = encodeURIComponent(`Hi Gemini Surgicals, I would like to order: ${product.name} at ${formatPrice(currentPrice)}. Please advise on delivery.`);
  const whatsappUrl = `https://wa.me/254706072888?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen pt-20 bg-white pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="bg-slate-50 rounded-3xl p-8 aspect-square flex items-center justify-center border border-border relative overflow-hidden group">
              {product.weeklyOffer && (
                 <div className="absolute top-6 left-6 z-10 bg-destructive text-white text-sm font-bold px-3 py-1 rounded-lg shadow-sm">
                   Weekly Offer
                 </div>
              )}
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="text-slate-300 flex flex-col items-center">
                  <Info className="h-16 w-16 mb-2" />
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{product.categoryName}</span>
              <button className="text-muted-foreground hover:text-primary transition-colors p-2 bg-slate-50 rounded-full">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-border">
              <span className="text-4xl font-extrabold text-primary">{formatPrice(currentPrice)}</span>
              {product.discountPrice && (
                <span className="text-xl text-slate-400 line-through mb-1">{formatPrice(product.price)}</span>
              )}
            </div>

            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Actions */}
            <div className="space-y-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-border">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900">Status:</span>
                {product.inStock ? (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <Check className="h-5 w-5" /> In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
              </div>

              {product.inStock && (
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-900">Quantity:</span>
                  <div className="flex items-center border-2 border-border rounded-xl bg-white overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="flex-1 text-lg h-14" 
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="whatsapp" 
                  size="lg" 
                  className="flex-1 text-lg h-14"
                  asChild
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Order via WhatsApp</a>
                </Button>
              </div>
            </div>

            {/* Quick guarantees */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Shield className="h-5 w-5" /></div>
                <span className="font-medium">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Truck className="h-5 w-5" /></div>
                <span className="font-medium">Fast Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-border pt-12">
           <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar">
             {[
               { id: "desc", label: "Description" },
               { id: "specs", label: "Specifications" },
               { id: "delivery", label: "Delivery Info" },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={cn(
                   "pb-4 px-6 text-lg font-semibold whitespace-nowrap border-b-2 transition-colors",
                   activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                 )}
               >
                 {tab.label}
               </button>
             ))}
           </div>
           
           <div className="prose prose-slate max-w-none prose-p:leading-relaxed">
             {activeTab === "desc" && (
               <div dangerouslySetClassName={{ __html: product.description.replace(/\n/g, '<br/>') || "No description available." }} />
             )}
             {activeTab === "specs" && (
               <div dangerouslySetClassName={{ __html: product.specifications?.replace(/\n/g, '<br/>') || "No specifications available." }} />
             )}
             {activeTab === "delivery" && (
               <div dangerouslySetClassName={{ __html: product.deliveryInfo?.replace(/\n/g, '<br/>') || "Standard delivery applies. Free within Nairobi CBD." }} />
             )}
           </div>
        </div>

      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40 flex gap-3">
         <Button 
            className="flex-1" 
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button 
            variant="whatsapp" 
            className="flex-1"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </Button>
      </div>
    </div>
  );
}
