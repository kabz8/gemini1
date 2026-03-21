import { useParams, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Package, MapPin, Phone, CreditCard } from "lucide-react";
import { format } from "date-fns";

export function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrder(Number(id));

  if (isLoading) return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!order) return <div className="min-h-screen pt-32 text-center">Order not found</div>;

  const whatsappMsg = encodeURIComponent(`Hi Gemini Surgicals, I have just placed order #${order.id} for ${formatPrice(order.totalAmount)}. Name: ${order.customerName}.`);
  const whatsappUrl = `https://wa.me/254706072888?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-lg border border-border overflow-hidden">
          
          {/* Header */}
          <div className="bg-primary/5 p-8 sm:p-12 text-center border-b border-border">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-600 text-lg">Thank you for shopping with Gemini Surgicals.</p>
            <div className="mt-6 inline-block bg-white px-4 py-2 rounded-lg border border-border font-mono text-lg font-bold text-primary shadow-sm">
               Order #{order.id}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-border pb-2">Customer Details</h3>
                <div className="text-sm text-slate-600 space-y-3">
                   <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400"/> {order.customerName}</p>
                   <p className="flex items-center gap-2 ml-6">{order.location}</p>
                   <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400"/> {order.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-border pb-2">Order Info</h3>
                <div className="text-sm text-slate-600 space-y-3">
                   <p className="flex justify-between"><span>Date:</span> <span className="font-medium text-slate-900">{format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}</span></p>
                   <p className="flex justify-between">
                     <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-slate-400"/> Method:</span> 
                     <span className="font-medium text-slate-900 uppercase">{order.paymentMethod.replace('_', ' ')}</span>
                   </p>
                   <p className="flex justify-between items-center">
                     <span>Status:</span> 
                     <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase">{order.status}</span>
                   </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-border mb-10">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Package className="h-5 w-5" /> Items Ordered</h3>
              <div className="space-y-3 divide-y divide-border">
                {order.items.map(item => (
                  <div key={item.productId} className="flex justify-between items-center pt-3 first:pt-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-900">{item.quantity}x</span>
                      <span className="text-sm text-slate-600">{item.productName}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                 <span className="font-bold text-slate-900">Total Paid</span>
                 <span className="text-xl font-extrabold text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Confirm via WhatsApp</a>
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
