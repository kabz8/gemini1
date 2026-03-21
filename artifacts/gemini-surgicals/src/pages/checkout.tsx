import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/store/use-cart";
import { useCreateOrder } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, CreditCard, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createOrder = useCreateOrder();
  
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    location: "",
    notes: "",
    paymentMethod: "mpesa" as "mpesa" | "cash_on_delivery",
  });

  // Redirect if cart empty
  if (items.length === 0 && !createOrder.isSuccess) {
    setLocation("/cart");
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customerName || !formData.phone || !formData.location) {
       toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
       return;
    }

    createOrder.mutate({
      data: {
        ...formData,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
      }
    }, {
      onSuccess: (data) => {
        clearCart();
        setLocation(`/order/${data.id}`);
      },
      onError: () => {
        toast({ title: "Order Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => setLocation("/cart")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-medium">
           <ArrowLeft className="h-4 w-4" /> Back to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-md border border-border overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-border bg-slate-50/50">
                 <h1 className="text-2xl font-bold text-slate-900">Checkout Details</h1>
              </div>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                 
                 {/* Contact & Shipping */}
                 <div>
                   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Shipping Information</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2 sm:col-span-2">
                       <label className="text-sm font-medium text-slate-700">Full Name *</label>
                       <input 
                         required
                         type="text" 
                         className="w-full p-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                         value={formData.customerName}
                         onChange={e => setFormData({...formData, customerName: e.target.value})}
                         placeholder="John Doe"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                       <input 
                         required
                         type="tel" 
                         className="w-full p-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                         placeholder="e.g. 0712 345 678"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Delivery Location/Address *</label>
                       <input 
                         required
                         type="text" 
                         className="w-full p-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                         value={formData.location}
                         onChange={e => setFormData({...formData, location: e.target.value})}
                         placeholder="e.g. Kilimani, Nairobi"
                       />
                     </div>
                     <div className="space-y-2 sm:col-span-2">
                       <label className="text-sm font-medium text-slate-700">Order Notes (Optional)</label>
                       <textarea 
                         className="w-full p-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px]"
                         value={formData.notes}
                         onChange={e => setFormData({...formData, notes: e.target.value})}
                         placeholder="Any special instructions for delivery?"
                       />
                     </div>
                   </div>
                 </div>

                 <hr className="border-border" />

                 {/* Payment Method */}
                 <div>
                   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment Method</h2>
                   <div className="space-y-4">
                     
                     <label className={`block relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <input 
                             type="radio" 
                             name="payment" 
                             value="mpesa" 
                             checked={formData.paymentMethod === 'mpesa'}
                             onChange={() => setFormData({...formData, paymentMethod: 'mpesa'})}
                             className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                           />
                           <span className="font-semibold text-slate-900">M-Pesa (Paybill)</span>
                         </div>
                         <div className="bg-[#52B44B] text-white text-xs font-bold px-2 py-1 rounded">Recommended</div>
                       </div>
                       {formData.paymentMethod === 'mpesa' && (
                         <div className="mt-4 ml-7 text-sm text-slate-600 bg-white p-4 rounded-lg border border-border/50">
                           Paybill Number: <span className="font-bold text-slate-900">123456</span><br/>
                           Account: <span className="font-bold text-slate-900">Order Name</span><br/>
                           <span className="text-xs text-muted-foreground mt-2 block">You will pay upon order confirmation.</span>
                         </div>
                       )}
                     </label>

                     <label className={`block relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                       <div className="flex items-center gap-3">
                         <input 
                           type="radio" 
                           name="payment" 
                           value="cash_on_delivery" 
                           checked={formData.paymentMethod === 'cash_on_delivery'}
                           onChange={() => setFormData({...formData, paymentMethod: 'cash_on_delivery'})}
                           className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                         />
                         <span className="font-semibold text-slate-900">Cash on Delivery</span>
                       </div>
                     </label>

                   </div>
                 </div>

              </form>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-md sticky top-28">
               <h2 className="text-xl font-bold mb-6 text-slate-900">Your Order</h2>
               
               <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {items.map(item => (
                   <div key={item.product.id} className="flex items-center justify-between text-sm">
                     <div className="flex items-center gap-3 flex-1 overflow-hidden">
                       <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-xs">{item.quantity}x</span>
                       <span className="text-slate-700 truncate">{item.product.name}</span>
                     </div>
                     <span className="font-medium text-slate-900 shrink-0 ml-2">
                       {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                     </span>
                   </div>
                 ))}
               </div>

               <hr className="border-border my-4" />
               
               <div className="space-y-3 text-sm text-slate-600 mb-6">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span className="font-medium text-slate-900">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                 </div>
               </div>
               
               <div className="border-t border-border pt-4 mb-8">
                 <div className="flex justify-between items-center">
                   <span className="text-lg font-bold text-slate-900">Total</span>
                   <span className="text-2xl font-extrabold text-primary">{formatPrice(total)}</span>
                 </div>
               </div>
               
               <Button 
                 type="submit" 
                 form="checkout-form" 
                 size="lg" 
                 className="w-full h-14 text-lg"
                 disabled={createOrder.isPending}
               >
                 {createOrder.isPending ? "Processing..." : "Place Order Now"}
               </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
