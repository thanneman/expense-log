import { supabase, type Category, type CreateCategoryData, type UpdateCategoryData } from './supabase'

export class CategoryAPI {
  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories')
    }

    return data || []
  }

  // Get category by ID
  static async getCategoryById(id: string): Promise<Category | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      throw new Error('Failed to fetch category')
    }

    return data
  }

  // Get category by name
  static async getCategoryByName(name: string): Promise<Category | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching category by name:', error)
      throw new Error('Failed to fetch category by name')
    }

    return data
  }

  // Create new category
  static async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      if (error.code === '23505') {
        throw new Error('A category with this name already exists')
      }
      throw new Error('Failed to create category')
    }

    return data
  }

  // Update category
  static async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<Category> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      if (error.code === '23505') {
        throw new Error('A category with this name already exists')
      }
      throw new Error('Failed to update category')
    }

    return data
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      if (error.message.includes('Cannot delete category')) {
        throw new Error(error.message)
      }
      throw new Error('Failed to delete category')
    }
  }

  // Check if category is being used
  static async isCategoryInUse(id: string): Promise<boolean> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    if (error) {
      console.error('Error checking category usage:', error)
      throw new Error('Failed to check category usage')
    }

    return data && data.length > 0
  }

  // Get category usage count
  static async getCategoryUsageCount(id: string): Promise<number> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { count, error } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (error) {
      console.error('Error getting category usage count:', error)
      throw new Error('Failed to get category usage count')
    }

    return count || 0
  }
} 