import { createClient } from '@supabase/supabase-js'
import { config, validateConfig } from './config'

// Validate configuration on import (client-side only)
if (typeof window !== 'undefined') {
  validateConfig()
}

const supabaseUrl = config.supabase.url
const supabaseAnonKey = config.supabase.anonKey

// Only create client if we have the required environment variables
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface Expense {
  id: string
  title: string
  amount: number
  date: string
  category: string
  category_id?: string
  note?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface CreateExpenseData {
  title: string
  amount: number
  date: string
  category: string
  category_id?: string
  note?: string
}

export interface UpdateExpenseData {
  title?: string
  amount?: number
  date?: string
  category?: string
  category_id?: string
  note?: string
}

export interface CreateCategoryData {
  name: string
  color: string
}

export interface UpdateCategoryData {
  name?: string
  color?: string
} 