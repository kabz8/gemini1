import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X, Stethoscope } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const itemCount = useCart((state) => state.getItemCount());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    { name: "Categories", href: "/shop?sort=popular" },
    { name: "Offers", href: "/shop?weeklyOffer=true" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-border shadow-sm"
          : "bg-white border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary to-blue-400 p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
              Gemini<span className="text-primary">Surgicals</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
                {location === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/shop" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent">
              <Search className="h-5 w-5" />
            </Link>
            
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 bg-destructive text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-border shadow-lg animate-in slide-in-from-top-4">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-foreground hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
