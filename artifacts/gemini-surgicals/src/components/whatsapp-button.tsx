import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const url = `https://wa.me/254706072888?text=${encodeURIComponent("Hello, I am interested in your medical supplies from Gemini Surgicals.")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl shadow-[#25D366]/30 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 shrink-0" />
      <span className="text-sm font-bold hidden sm:block">Chat with us</span>
    </a>
  );
}
