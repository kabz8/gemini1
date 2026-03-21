import { Link } from "wouter";
import { Stethoscope, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="bg-primary p-2 rounded-xl text-white">
                <Stethoscope className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Gemini<span className="text-primary">Surgicals</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Your trusted partner in affordable, reliable diagnostic and surgical equipment across Kenya. Quality you can count on.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop" className="hover:text-primary transition-colors">Shop All Products</Link></li>
              <li><Link href="/shop?weeklyOffer=true" className="hover:text-primary transition-colors">Weekly Offers</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">My Cart</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop?category=Diagnostic Devices" className="hover:text-primary transition-colors">Diagnostic Devices</Link></li>
              <li><Link href="/shop?category=Surgical Tools" className="hover:text-primary transition-colors">Surgical Tools</Link></li>
              <li><Link href="/shop?category=Lab Equipment" className="hover:text-primary transition-colors">Lab Equipment</Link></li>
              <li><Link href="/shop?category=Test Kits" className="hover:text-primary transition-colors">Test Kits</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Nairobi CBD, Kenya<br/>Delivery nationwide available.</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+254 706 072 888</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>sales@geminisurgicals.co.ke</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Gemini Surgicals. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
