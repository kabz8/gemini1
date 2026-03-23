import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { GeminiLogo } from "@/components/logo";

export function Navbar() {
  const [location] = useLocation();
  const itemCount = useCart((state) => state.getItemCount());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    { name: "Weekly Offers", href: "/shop?weeklyOffer=true" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white border-b border-border shadow-sm"
          : "bg-white border-b border-border"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center group opacity-90 hover:opacity-100 transition-opacity">
            <GeminiLogo size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors relative py-1",
                  location === link.href
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {link.name}
                {location === link.href && (
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/shop"
              className="p-2.5 text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggle}
              className="p-2.5 text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              className="md:hidden p-2.5 text-foreground/60 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border shadow-2xl">
          <div className="px-4 py-6 space-y-1 max-w-7xl mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block py-3 px-4 rounded-xl text-base font-semibold transition-colors",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
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
