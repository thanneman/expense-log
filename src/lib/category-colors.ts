// Category color definitions with muted, professional colors
export interface CategoryColor {
  name: string
  bgColor: string
  textColor: string
  borderColor: string
}

// Muted, professional color palette
export const categoryColors: CategoryColor[] = [
  {
    name: "Food & Dining",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800"
  },
  {
    name: "Transportation",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800"
  },
  {
    name: "Shopping",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800"
  },
  {
    name: "Entertainment",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    textColor: "text-pink-700 dark:text-pink-300",
    borderColor: "border-pink-200 dark:border-pink-800"
  },
  {
    name: "Healthcare",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-200 dark:border-green-800"
  },
  {
    name: "Utilities",
    bgColor: "bg-slate-50 dark:bg-slate-950/30",
    textColor: "text-slate-700 dark:text-slate-300",
    borderColor: "border-slate-200 dark:border-slate-800"
  },
  {
    name: "Housing",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    name: "Education",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    borderColor: "border-indigo-200 dark:border-indigo-800"
  },
  {
    name: "Travel",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    textColor: "text-cyan-700 dark:text-cyan-300",
    borderColor: "border-cyan-200 dark:border-cyan-800"
  },
  {
    name: "Other",
    bgColor: "bg-gray-50 dark:bg-gray-950/30",
    textColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800"
  }
]

// Get category color by name
export function getCategoryColor(categoryName: string): CategoryColor {
  const category = categoryColors.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  )
  return category || categoryColors[categoryColors.length - 1] // Default to "Other"
}

// Get all category names
export function getCategoryNames(): string[] {
  return categoryColors.map(cat => cat.name)
}

// Get color dot component styles
export function getCategoryDotStyles(categoryName: string): string {
  const color = getCategoryColor(categoryName)
  return `w-2 h-2 rounded-full ${color.bgColor.replace('bg-', 'bg-').replace('/30', '')} border ${color.borderColor}`
} 