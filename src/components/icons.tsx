import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Udyog Sahayak Logo</title>
      <path d="M12 20V12" />
      <path d="M12 12V4" />
      <path d="M12 12H4" />
      <path d="M12 12H20" />
      <path d="M12 12L6.8 6.8" />
      <path d="M12 12L17.2 17.2" />
      <path d="M12 12L6.8 17.2" />
      <path d="M12 12L17.2 6.8" />
      <circle cx="12" cy="12" r="3" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}
