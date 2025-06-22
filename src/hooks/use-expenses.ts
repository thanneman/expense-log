import { useState, useEffect, useCallback, useMemo } from 'react'
import { ExpenseAPI } from '@/lib/expense-api'
import type { CreateExpenseData, UpdateExpenseData } from '@/lib/supabase'
import { mapSupabaseExpense } from '@/components/expense-table'

// Component expense type
export interface ComponentExpense {
  id: string
  title: string
  amount: number
  date: string
  category: string
  note?: string
  createdAt: string
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<ComponentExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate stats during render instead of storing in state
  const stats = useMemo(() => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const transactionCount = expenses.length
    
    // Calculate monthly average
    const monthlyAverage = (() => {
      if (expenses.length === 0) return 0
      
      const now = new Date()
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      const recentExpenses = expenses.filter(expense => 
        new Date(expense.date) >= sixMonthsAgo
      )
      
      if (recentExpenses.length === 0) return 0
      
      const totalRecent = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      return totalRecent / 6 // Average over 6 months
    })()
    
    return {
      totalAmount,
      transactionCount,
      monthlyAverage
    }
  }, [expenses])

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ExpenseAPI.getAllExpenses()
      const mappedExpenses = data.map(mapSupabaseExpense)
      setExpenses(mappedExpenses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new expense
  const createExpense = useCallback(async (expenseData: CreateExpenseData) => {
    try {
      setError(null)
      const newExpense = await ExpenseAPI.createExpense(expenseData)
      const mappedExpense = mapSupabaseExpense(newExpense)
      setExpenses(prev => [mappedExpense, ...prev])
      
      // Refresh stats
      await fetchExpenses()
      return newExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense')
      throw err
    }
  }, [fetchExpenses])

  // Update expense
  const updateExpense = useCallback(async (id: string, expenseData: UpdateExpenseData) => {
    try {
      setError(null)
      const updatedExpense = await ExpenseAPI.updateExpense(id, expenseData)
      const mappedExpense = mapSupabaseExpense(updatedExpense)
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === id ? mappedExpense : expense
        )
      )
      
      // Refresh stats
      await fetchExpenses()
      return updatedExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense')
      throw err
    }
  }, [fetchExpenses])

  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    try {
      setError(null)
      await ExpenseAPI.deleteExpense(id)
      setExpenses(prev => prev.filter(expense => expense.id !== id))
      
      // Refresh stats
      await fetchExpenses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense')
      throw err
    }
  }, [fetchExpenses])

  // Get expense by ID
  const getExpenseById = useCallback(async (id: string) => {
    try {
      setError(null)
      const expense = await ExpenseAPI.getExpenseById(id)
      return expense ? mapSupabaseExpense(expense) : null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense')
      throw err
    }
  }, [])

  // Get expenses by date range
  const getExpensesByDateRange = useCallback(async (startDate: string, endDate: string) => {
    try {
      setError(null)
      const data = await ExpenseAPI.getExpensesByDateRange(startDate, endDate)
      return data.map(mapSupabaseExpense)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses by date range')
      throw err
    }
  }, [])

  // Get expenses by category
  const getExpensesByCategory = useCallback(async (category: string) => {
    try {
      setError(null)
      const data = await ExpenseAPI.getExpensesByCategory(category)
      return data.map(mapSupabaseExpense)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses by category')
      throw err
    }
  }, [])

  // Load expenses on mount
  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  return {
    expenses,
    loading,
    error,
    stats,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    getExpensesByDateRange,
    getExpensesByCategory
  }
} 