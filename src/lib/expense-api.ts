import { supabase, type Expense, type CreateExpenseData, type UpdateExpenseData } from './supabase'

export class ExpenseAPI {
  // Get all expenses
  static async getAllExpenses(): Promise<Expense[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error)
      throw new Error('Failed to fetch expenses')
    }

    return data || []
  }

  // Get expense by ID
  static async getExpenseById(id: string): Promise<Expense | null> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching expense:', error)
      throw new Error('Failed to fetch expense')
    }

    return data
  }

  // Create new expense
  static async createExpense(expenseData: CreateExpenseData): Promise<Expense> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select()
      .single()

    if (error) {
      console.error('Error creating expense:', error)
      throw new Error('Failed to create expense')
    }

    return data
  }

  // Update expense
  static async updateExpense(id: string, expenseData: UpdateExpenseData): Promise<Expense> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .update(expenseData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating expense:', error)
      throw new Error('Failed to update expense')
    }

    return data
  }

  // Delete expense
  static async deleteExpense(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting expense:', error)
      throw new Error('Failed to delete expense')
    }
  }

  // Get expenses by date range
  static async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching expenses by date range:', error)
      throw new Error('Failed to fetch expenses by date range')
    }

    return data || []
  }

  // Get expenses by category
  static async getExpensesByCategory(category: string): Promise<Expense[]> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching expenses by category:', error)
      throw new Error('Failed to fetch expenses by category')
    }

    return data || []
  }

  // Get total expenses amount
  static async getTotalAmount(): Promise<number> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('amount')

    if (error) {
      console.error('Error fetching total amount:', error)
      throw new Error('Failed to fetch total amount')
    }

    return data?.reduce((sum, expense) => sum + expense.amount, 0) || 0
  }

  // Get monthly average
  static async getMonthlyAverage(): Promise<number> {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('amount, date')

    if (error) {
      console.error('Error fetching monthly average:', error)
      throw new Error('Failed to fetch monthly average')
    }

    if (!data || data.length === 0) return 0

    // Group by month and calculate average
    const monthlyTotals: Record<string, number> = {}
    
    data.forEach(expense => {
      const monthKey = expense.date.substring(0, 7) // YYYY-MM format
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount
    })

    const totalAmount = Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0)
    const numberOfMonths = Object.keys(monthlyTotals).length

    return numberOfMonths > 0 ? totalAmount / numberOfMonths : 0
  }
} 