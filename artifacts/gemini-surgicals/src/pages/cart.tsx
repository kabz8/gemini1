import { Link, useLocation } from "wouter";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCart();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-border p-12 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
             <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added any medical supplies to your cart yet.</p>
          <Button size="lg" className="w-full h-14 text-lg" asChild>
             <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500; // Example logic: Free shipping over 10k
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 space-y-4">
            {items.map((item) => {
              const currentPrice = item.product.discountPrice || item.product.price;
              return (
                <div key={item.product.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-full sm:w-32 aspect-square rounded-xl bg-slate-50 border border-border p-2 shrink-0">
                     {item.product.imageUrl ? (
                       <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                     ) : (
                       <div className="w-full h-full bg-slate-200 rounded"></div>
                     )}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start gap-4 mb-2">
                       <Link href={`/product/${item.product.id}`} className="font-semibold text-lg text-slate-900 hover:text-primary transition-colors line-clamp-2">
                         {item.product.name}
                       </Link>
                       <span className="font-bold text-lg whitespace-nowrap">{formatPrice(currentPrice * item.quantity)}</span>
                    </div>
                    
                    <div className="text-sm text-slate-500 mb-4">{formatPrice(currentPrice)} each</div>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center border border-border rounded-lg bg-slate-50">
                          <button 
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-slate-200 transition-colors text-slate-600 rounded-l-lg"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                            className="p-2 hover:bg-slate-200 transition-colors text-slate-600 rounded-r-lg"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                       </div>
                       
                       <button 
                         onClick={() => removeItem(item.product.id)}
                         className="text-destructive bg-destructive/10 p-2 rounded-lg hover:bg-destructive hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                       >
                         <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Remove</span>
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xl sticky top-28">
               <h2 className="text-xl font-bold mb-6 text-slate-900">Order Summary</h2>
               
               <div className="space-y-4 text-slate-600 mb-6">
                 <div className="flex justify-between">
                   <span>Subtotal ({items.length} items)</span>
                   <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Estimated Shipping</span>
                   <span className="font-medium text-slate-900">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                 </div>
               </div>
               
               <div className="border-t border-border pt-6 mb-8">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-lg font-bold text-slate-900">Total</span>
                   <span className="text-2xl font-extrabold text-primary">{formatPrice(total)}</span>
                 </div>
                 {shipping > 0 && (
                   <p className="text-xs text-slate-500 text-right">Add {formatPrice(10000 - subtotal)} more for free shipping</p>
                 )}
               </div>
               
               <Button size="lg" className="w-full h-14 text-lg" onClick={() => setLocation('/checkout')}>
                 Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
               
               <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Shield className="h-4 w-4 text-green-500" /> Secure Checkout
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
