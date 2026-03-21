import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "254706072888";
  const defaultMessage = "Hello, I am interested in your medical supplies from Gemini Surgicals.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 group flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute right-full mr-4 bg-white text-foreground px-4 py-2 rounded-xl text-sm font-semibold shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap border border-border">
        Need Help? Chat with us!
      </span>
    </a>
  );
}
