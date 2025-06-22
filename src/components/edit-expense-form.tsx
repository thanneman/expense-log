import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, X } from "lucide-react"
import { formatAmount } from "@/lib/utils"
import { useCategories } from "@/hooks/use-categories"
import type { Expense } from "@/components/expense-table"

interface EditExpenseFormProps {
  expense: Expense
  onSave: (id: string, data: { title: string; amount: number; date: string; category: string; note?: string }) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function EditExpenseForm({ expense, onSave, onCancel, isSubmitting }: EditExpenseFormProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount.toString(),
    date: expense.date,
    category: expense.category,
    note: expense.note || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "title":
        if (!value.trim()) return "Title is required"
        if (value.trim().length < 2) return "Title must be at least 2 characters"
        if (value.trim().length > 100) return "Title must be less than 100 characters"
        return null
      
      case "amount":
        if (!value.trim()) return "Amount is required"
        if (parseFloat(value) < 0) return "Amount cannot be negative"
        if (isNaN(parseFloat(value))) return "Please enter a valid number"
        if (value.includes('.') && value.split('.')[1]?.length > 2) return "Amount can have maximum 2 decimal places"
        if (parseFloat(value) > 999999.99) return "Amount cannot exceed $999,999.99"
        return null
      
      case "date":
        if (!value) return "Date is required"
        const todayAZ = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Phoenix' })
        
        if (value > todayAZ) return "Date cannot be in the future"
        if (value < '1900-01-01') return "Date cannot be before 1900"
        return null
      
      case "category":
        if (!value) return "Category is required"
        return null
      
      default:
        return null
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handleBlur = (field: string) => {
    let value = formData[field as keyof typeof formData]
    
    if (field === "amount" && value) {
      const formattedValue = formatAmount(value)
      setFormData(prev => ({
        ...prev,
        [field]: formattedValue
      }))
      value = formattedValue
    }

    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({
        ...prev,
        [field]: error
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate all required fields
    const requiredFields = ['title', 'amount', 'date', 'category']
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData])
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSave(expense.id, {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        note: formData.note.trim() || undefined
      })
    } catch (error) {
      console.error("Error updating expense:", error)
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to update expense'
      }))
    }
  }

  // Show loading state while categories are being fetched
  if (categoriesLoading) {
    return (
      <div className="bg-muted/20 border p-4 space-y-4">
        <h3 className="font-semibold">Edit Expense</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted/20 border p-4 space-y-4">
      <h3 className="font-semibold">Edit Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor={`title-${expense.id}`}>Title</Label>
            <Input
              id={`title-${expense.id}`}
              type="text"
              placeholder="Enter expense title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor={`amount-${expense.id}`}>Amount</Label>
            <Input
              id={`amount-${expense.id}`}
              type="text"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              onBlur={() => handleBlur("amount")}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor={`date-${expense.id}`}>Date</Label>
            <Input
              id={`date-${expense.id}`}
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              onBlur={() => handleBlur("date")}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor={`category-${expense.id}`}>Category</Label>
            <select
              id={`category-${expense.id}`}
              className={`flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] ${
                errors.category ? "border-red-500" : "focus-visible:border-ring"
              }`}
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor={`note-${expense.id}`}>Note (Optional)</Label>
          <textarea
            id={`note-${expense.id}`}
            placeholder="Add any additional notes..."
            value={formData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
            className="flex min-h-[80px] w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            rows={3}
          />
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-3 w-3 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 