import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, options: { currency?: "INR" | "USD" | "EUR" | "GBP"; notation?: Intl.NumberFormatOptions["notation"] } = {}) {
  const { currency = "INR", notation = "standard" } = options;

  // Convert from USD to INR if using INR
  const convertedPrice = currency === "INR" ? price * 83.5 : price;
  
  const formatter = new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(convertedPrice);
}

export function truncate(str: string, length: number) {
  if (str.length <= length) {
    return str;
  }
  
  return `${str.slice(0, length)}...`;
}

export function calculateDiscountPercentage(originalPrice: number, salePrice: number) {
  if (originalPrice <= 0 || salePrice <= 0 || salePrice >= originalPrice) {
    return 0;
  }
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

export function generatePagination(currentPage: number, totalPages: number) {
  // If total pages is 7 or less, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  // If current page is among the first 3 pages
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages - 1, totalPages];
  }
  
  // If current page is among the last 3 pages
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  
  // If current page is somewhere in the middle
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
