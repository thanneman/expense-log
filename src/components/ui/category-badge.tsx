import { getCategoryColor } from "@/lib/category-colors"

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const color = getCategoryColor(category)
  
  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color.bgColor} ${color.textColor} ${color.borderColor} ${className}`}
    >
      {category}
    </span>
  )
} 