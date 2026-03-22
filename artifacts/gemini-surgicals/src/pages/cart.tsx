import { Link } from "wouter";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, ShieldCheck, Truck } from "lucide-react";

function buildWhatsAppMessage(items: ReturnType<typeof useCart>["items"], total: number): string {
  const lines = items.map((item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return `• ${item.quantity}× ${item.product.name} — ${formatPrice(price * item.quantity)}`;
  });
  const msg = [
    "Hi Gemini Surgicals! I'd like to place an order:",
    "",
    ...lines,
    "",
    `*Total: ${formatPrice(total)}*`,
    "",
    "Please confirm availability and delivery details. Thank you!",
  ].join("\n");
  return `https://wa.me/254706072888?text=${encodeURIComponent(msg)}`;
}

export function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-12 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some products and come back to order via WhatsApp.</p>
          <Button size="lg" className="w-full h-14 text-lg" asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;
  const whatsappUrl = buildWhatsAppMessage(items, total);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 space-y-4">
            {items.map((item) => {
              const currentPrice = item.product.discountPrice ?? item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="glass-card p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6"
                >
                  <div className="w-full sm:w-28 aspect-square rounded-xl bg-white border border-border p-2 shrink-0 overflow-hidden">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full rounded bg-muted animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <span className="font-bold text-lg whitespace-nowrap text-foreground">
                        {formatPrice(currentPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4">
                      {formatPrice(currentPrice)} each
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background/60">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                          className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-destructive bg-destructive/10 p-2.5 rounded-xl hover:bg-destructive hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="glass-card rounded-3xl p-6 sm:p-8 sticky top-28">
              <h2 className="text-xl font-bold mb-6 text-foreground">Order Summary</h2>

              <div className="space-y-3 text-muted-foreground mb-6 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-foreground">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/50 pt-5 mb-7">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-extrabold text-primary">{formatPrice(total)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5 text-right">
                    Add {formatPrice(10000 - subtotal)} more for free shipping
                  </p>
                )}
              </div>

              {/* WhatsApp Checkout — the only checkout option */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="h-5 w-5" />
                Checkout via WhatsApp
              </a>

              <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                Your cart details will be sent to our team on WhatsApp to complete your order.
              </p>

              {/* Trust signals */}
              <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
                  Genuine products
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  Nairobi delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
