import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/router"
import { CategoryBadge } from "@/components/ui/category-badge"
import { getCategoryNames } from "@/lib/category-colors"

export default function CategoriesPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#DBEAFE" // Default muted blue color
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Category name is required"
        if (value.trim().length < 2) return "Category name must be at least 2 characters"
        if (value.trim().length > 50) return "Category name must be less than 50 characters"
        // Check if category already exists (case insensitive)
        const existingCategories = getCategoryNames()
        if (existingCategories.some(cat => cat.toLowerCase() === value.trim().toLowerCase())) {
          return "Category already exists"
        }
        return ""
      
      case "description":
        if (value.trim().length > 200) return "Description must be less than 200 characters"
        return ""
      
      case "color":
        if (!value) return "Color is required"
        // Basic hex color validation
        if (!/^#[0-9A-F]{6}$/i.test(value)) return "Please enter a valid hex color"
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

    const value = formData[field as keyof typeof formData]
    const error = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    setTouched({
      name: true,
      description: true,
      color: true
    })

    // Validate all required fields
    const requiredFields = ['name', 'color']
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData])
      if (error) {
        newErrors[field] = error
      }
    })

    // Validate optional fields
    const optionalFields = ['description']
    optionalFields.forEach(field => {
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
      // TODO: Implement category saving logic
      console.log("Category data:", formData)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // For now, just redirect back to home
      router.push("/")
    } catch (error) {
      console.error("Error saving category:", error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const presetColors = [
    "#FEF3C7", // Amber-100 (Food & Dining)
    "#DBEAFE", // Blue-100 (Transportation)
    "#F3E8FF", // Purple-100 (Shopping)
    "#FCE7F3", // Pink-100 (Entertainment)
    "#D1FAE5", // Green-100 (Healthcare)
    "#F1F5F9", // Slate-100 (Utilities)
    "#FFEDD5", // Orange-100 (Housing)
    "#E0E7FF", // Indigo-100 (Education)
    "#CFFAFE", // Cyan-100 (Travel)
    "#F3F4F6", // Gray-100 (Other)
  ]

  const existingCategories = getCategoryNames()

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your expense categories
          </p>
        </div>
      </div>

      {/* Existing Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {existingCategories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between p-3 border rounded-lg bg-card"
            >
              <CategoryBadge category={category} />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-6">Add New Category</h2>
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className={errors.name ? "border-red-500 focus-visible:border-red-500" : ""}
                required
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  onBlur={() => handleBlur("color")}
                  className={`w-16 h-10 p-1 border rounded-md cursor-pointer ${
                    errors.color ? "border-red-500" : "border-input"
                  }`}
                  required
                />
                <Input
                  type="text"
                  placeholder="#3B82F6"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  onBlur={() => handleBlur("color")}
                  className={`flex-1 ${errors.color ? "border-red-500 focus-visible:border-red-500" : ""}`}
                  required
                />
              </div>
              {errors.color && <p className="text-sm text-red-500 mt-1">{errors.color}</p>}
              
              {/* Preset Colors */}
              <div className="flex flex-wrap gap-2 mt-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-input hover:border-ring transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => handleInputChange("color", color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                placeholder="Add a description for this category..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                className={`flex min-h-[80px] w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${
                  errors.description ? "border-red-500 focus-visible:border-red-500" : ""
                }`}
                rows={3}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
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
      </div>
    </Layout>
  )
}