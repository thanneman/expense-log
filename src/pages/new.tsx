import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/router"

export default function NewExpensePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Phoenix' }),
    category: "",
    note: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatAmount = (value: string): string => {
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

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "title":
        if (!value.trim()) return "Title is required"
        if (value.trim().length < 2) return "Title must be at least 2 characters"
        if (value.trim().length > 100) return "Title must be less than 100 characters"
        return ""
      
      case "amount":
        if (!value.trim()) return "Amount is required"
        if (parseFloat(value) < 0) return "Amount cannot be negative"
        if (isNaN(parseFloat(value))) return "Please enter a valid number"
        if (value.includes('.') && value.split('.')[1]?.length > 2) return "Amount can have maximum 2 decimal places"
        if (parseFloat(value) > 999999.99) return "Amount cannot exceed $999,999.99"
        return ""
      
      case "date":
        if (!value) return "Date is required"
        const todayAZ = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Phoenix' })
        
        if (value > todayAZ) return "Date cannot be in the future"
        if (value < '1900-01-01') return "Date cannot be before 1900"
        return ""
      
      case "category":
        if (!value) return "Category is required"
        return ""
      
      default:
        return ""
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({
        ...prev,
        [field]: error
      }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))

    let value = formData[field as keyof typeof formData]
    
    // Format amount to 2 decimal places on blur
    if (field === "amount" && value) {
      const formattedValue = formatAmount(value)
      setFormData(prev => ({
        ...prev,
        [field]: formattedValue
      }))
      value = formattedValue
    }

    const error = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    setTouched({
      title: true,
      amount: true,
      date: true,
      category: true
    })

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

    setIsSubmitting(true)
    
    try {
      // TODO: Implement expense saving logic
      console.log("Expense data:", formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // For now, just redirect back to home
      router.push("/")
    } catch (error) {
      console.error("Error saving expense:", error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Utilities",
    "Housing",
    "Education",
    "Travel",
    "Other"
  ]

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Expense</h1>
          <p className="text-muted-foreground">
            Record a new expense to track your spending
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter expense title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              className={errors.title ? "border-red-500 focus-visible:border-red-500" : ""}
              required
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              onBlur={() => handleBlur("amount")}
              className={errors.amount ? "border-red-500 focus-visible:border-red-500" : ""}
              required
            />
            {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              onBlur={() => handleBlur("date")}
              className={errors.date ? "border-red-500 focus-visible:border-red-500" : ""}
              required
            />
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className={`flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-ring/50 focus-visible:ring-[3px] ${
                errors.category ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-ring"
              }`}
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <textarea
              id="note"
              placeholder="Add any additional notes..."
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              className="flex min-h-[80px] w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Expense
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
