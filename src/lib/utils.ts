import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatting utilities
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatAmount = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '')
  
  // Prevent multiple decimal points
  const parts = cleanValue.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit to 2 decimal places
  if (parts.length === 2 && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2)
  }
  
  // Always format to 2 decimal places
  if (parts.length === 1) {
    // No decimal point, add .00
    return cleanValue + '.00'
  } else if (parts.length === 2) {
    // Has decimal point, pad to 2 decimal places
    const wholePart = parts[0] || '0'
    const decimalPart = parts[1].padEnd(2, '0').substring(0, 2)
    return wholePart + '.' + decimalPart
  }
  
  return cleanValue
}
