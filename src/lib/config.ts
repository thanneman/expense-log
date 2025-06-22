// Configuration for the application
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  app: {
    name: 'Expense Log',
    description: 'Track your expenses, master your budget',
  },
}

// Validate required environment variables
export function validateConfig() {
  // Only validate on client side
  if (typeof window === 'undefined') {
    return
  }

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  )

  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars)
    console.error('Please check your .env.local file and ensure all required variables are set.')
    console.error('Current config:', {
      url: config.supabase.url ? 'Set' : 'Missing',
      anonKey: config.supabase.anonKey ? 'Set' : 'Missing'
    })
  }
} 