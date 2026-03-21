import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout & UI
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

// Pages
import { Home } from "@/pages/home";
import { Shop } from "@/pages/shop";
import { ProductDetail } from "@/pages/product-detail";
import { Cart } from "@/pages/cart";
import { Checkout } from "@/pages/checkout";
import { OrderConfirmation } from "@/pages/order-confirmation";
import { Admin } from "@/pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function NotFound() {
  return (
    <div className="min-h-screen pt-32 w-full flex items-center justify-center bg-slate-50">
      <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-border">
        <h1 className="text-6xl font-black text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">The page you are looking for doesn't exist or has been moved.</p>
        <a href="/" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Return Home
        </a>
      </div>
    </div>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <MainLayout><Home /></MainLayout>
      </Route>
      <Route path="/shop">
        <MainLayout><Shop /></MainLayout>
      </Route>
      <Route path="/product/:id">
        <MainLayout><ProductDetail /></MainLayout>
      </Route>
      <Route path="/cart">
        <MainLayout><Cart /></MainLayout>
      </Route>
      <Route path="/checkout">
        <MainLayout><Checkout /></MainLayout>
      </Route>
      <Route path="/order/:id">
        <MainLayout><OrderConfirmation /></MainLayout>
      </Route>
      
      {/* Admin Route - No main layout (no header/footer) */}
      <Route path="/admin">
        <Admin />
      </Route>

      <Route>
        <MainLayout><NotFound /></MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
