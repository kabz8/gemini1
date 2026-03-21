import { Microscope, Activity, HeartPulse, Stethoscope, FlaskConical, Droplets, Image, Package, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { icon: React.ElementType; bg: string; iconColor: string }> = {
  "diagnostic-devices": { icon: Activity, bg: "bg-blue-50 dark:bg-blue-950", iconColor: "text-blue-500 dark:text-blue-400" },
  "test-kits": { icon: FlaskConical, bg: "bg-purple-50 dark:bg-purple-950", iconColor: "text-purple-500 dark:text-purple-400" },
  "surgical-tools": { icon: Stethoscope, bg: "bg-indigo-50 dark:bg-indigo-950", iconColor: "text-indigo-500 dark:text-indigo-400" },
  "student-kits": { icon: HeartPulse, bg: "bg-rose-50 dark:bg-rose-950", iconColor: "text-rose-500 dark:text-rose-400" },
  "lab-equipment": { icon: Microscope, bg: "bg-teal-50 dark:bg-teal-950", iconColor: "text-teal-500 dark:text-teal-400" },
  "blood-collection": { icon: Droplets, bg: "bg-red-50 dark:bg-red-950", iconColor: "text-red-400 dark:text-red-400" },
  "imaging": { icon: Image, bg: "bg-gray-50 dark:bg-gray-900", iconColor: "text-gray-400 dark:text-gray-500" },
  "wellness": { icon: Pill, bg: "bg-green-50 dark:bg-green-950", iconColor: "text-green-500 dark:text-green-400" },
};

function getConfigByName(categoryName?: string | null) {
  if (!categoryName) return { icon: Package, bg: "bg-blue-50 dark:bg-blue-950", iconColor: "text-blue-400" };
  const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
  return categoryConfig[slug] ?? { icon: Package, bg: "bg-blue-50 dark:bg-blue-950", iconColor: "text-blue-400" };
}

interface ProductImageProps {
  imageUrl?: string | null;
  categoryName?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}

export function ProductImage({ imageUrl, categoryName, alt, className, iconClassName }: ProductImageProps) {
  const config = getConfigByName(categoryName);
  const Icon = config.icon;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={cn("w-full h-full object-contain transition-transform duration-500 group-hover:scale-105", className)}
      />
    );
  }

  return (
    <div className={cn("w-full h-full flex items-center justify-center", config.bg)}>
      <Icon className={cn("h-16 w-16 opacity-60", config.iconColor, iconClassName)} />
    </div>
  );
}
