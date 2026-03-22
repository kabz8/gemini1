import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  imageUrl?: string | null;
  categoryName?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}

export function ProductImage({ imageUrl, alt, className }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!imageUrl || error) {
    /* Skeleton placeholder — no icons, just a clean shimmer */
    return (
      <div className="w-full h-full relative overflow-hidden bg-muted">
        <div className="absolute inset-0 animate-pulse bg-muted" />
        {/* Shimmer sweep */}
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-muted overflow-hidden">
      {/* Skeleton shown until image loads */}
      {!loaded && (
        <div className="absolute inset-0">
          <div className="w-full h-full animate-pulse bg-muted" />
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
            }}
          />
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full object-contain p-4 transition-all duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        style={{ backgroundColor: "white" }}
      />
    </div>
  );
}
