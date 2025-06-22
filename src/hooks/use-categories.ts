import { useState, useEffect, useCallback } from 'react'
import { CategoryAPI } from '@/lib/category-api'
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/lib/supabase'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await CategoryAPI.getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new category
  const createCategory = useCallback(async (categoryData: CreateCategoryData) => {
    try {
      setError(null)
      const newCategory = await CategoryAPI.createCategory(categoryData)
      setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)))
      return newCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
      throw err
    }
  }, [])

  // Update category
  const updateCategory = useCallback(async (id: string, categoryData: UpdateCategoryData) => {
    try {
      setError(null)
      const updatedCategory = await CategoryAPI.updateCategory(id, categoryData)
      setCategories(prev => 
        prev.map(category => 
          category.id === id ? updatedCategory : category
        ).sort((a, b) => a.name.localeCompare(b.name))
      )
      return updatedCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      throw err
    }
  }, [])

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null)
      await CategoryAPI.deleteCategory(id)
      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      throw err
    }
  }, [])

  // Get category by ID
  const getCategoryById = useCallback(async (id: string) => {
    try {
      setError(null)
      return await CategoryAPI.getCategoryById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category')
      throw err
    }
  }, [])

  // Get category by name
  const getCategoryByName = useCallback(async (name: string) => {
    try {
      setError(null)
      return await CategoryAPI.getCategoryByName(name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category by name')
      throw err
    }
  }, [])

  // Check if category is being used
  const isCategoryInUse = useCallback(async (id: string) => {
    try {
      setError(null)
      return await CategoryAPI.isCategoryInUse(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check category usage')
      throw err
    }
  }, [])

  // Get category usage count
  const getCategoryUsageCount = useCallback(async (id: string) => {
    try {
      setError(null)
      return await CategoryAPI.getCategoryUsageCount(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get category usage count')
      throw err
    }
  }, [])

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryByName,
    isCategoryInUse,
    getCategoryUsageCount
  }
} 