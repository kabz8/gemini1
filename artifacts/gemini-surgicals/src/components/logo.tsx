interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function GeminiLogo({ size = "md" }: LogoProps) {
  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.35 : 1;

  return (
    <svg
      width={140 * scale}
      height={36 * scale}
      viewBox="0 0 140 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* "gemini" text */}
      <text
        x="0"
        y="26"
        fontFamily="DM Sans, system-ui, sans-serif"
        fontWeight="700"
        fontSize="26"
        fontStyle="italic"
        fill="#D81B8A"
        letterSpacing="-0.5"
      >
        gemini
      </text>

      {/* Globe icon */}
      <g transform="translate(106, 4)">
        {/* Outer circle */}
        <circle cx="14" cy="14" r="13" stroke="#D81B8A" strokeWidth="1.6" fill="none"/>
        {/* Vertical ellipse (longitude) */}
        <ellipse cx="14" cy="14" rx="6.5" ry="13" stroke="#D81B8A" strokeWidth="1.3" fill="none"/>
        {/* Equator */}
        <line x1="1.5" y1="14" x2="26.5" y2="14" stroke="#D81B8A" strokeWidth="1.3"/>
        {/* Upper latitude */}
        <path d="M4 8.5 Q14 10.5 24 8.5" stroke="#D81B8A" strokeWidth="1" fill="none"/>
        {/* Lower latitude */}
        <path d="M4 19.5 Q14 17.5 24 19.5" stroke="#D81B8A" strokeWidth="1" fill="none"/>
      </g>

      {/* "SURGICALS" subtitle */}
      <text
        x="106"
        y="34"
        fontFamily="DM Sans, system-ui, sans-serif"
        fontWeight="500"
        fontSize="6.5"
        fill="#888"
        letterSpacing="1.2"
      >
        SURGICALS
      </text>
    </svg>
  );
}
