import { type ClassValue, clsx } from "clsx"

// Simple implementation of twMerge since tailwind-merge might not be available
function twMerge(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(...inputs);
}
