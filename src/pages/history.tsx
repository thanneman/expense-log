import { Layout } from "@/components/layout"
import { ExpenseTable, type Expense } from "@/components/expense-table"
import { useState } from "react"

// Sample data for demonstration
const sampleExpenses: Expense[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    amount: 85.50,
    date: "2024-01-15",
    category: "Food & Dining",
    note: "Weekly groceries from Whole Foods",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Gas Station",
    amount: 45.00,
    date: "2024-01-14",
    category: "Transportation",
    note: "Full tank fill-up",
    createdAt: "2024-01-14T16:45:00Z"
  },
  {
    id: "3",
    title: "Netflix Subscription",
    amount: 15.99,
    date: "2024-01-13",
    category: "Entertainment",
    note: "Monthly subscription",
    createdAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    title: "Electric Bill",
    amount: 120.75,
    date: "2024-01-12",
    category: "Utilities",
    note: "December electricity bill",
    createdAt: "2024-01-12T14:20:00Z"
  },
  {
    id: "5",
    title: "Coffee Shop",
    amount: 4.50,
    date: "2024-01-11",
    category: "Food & Dining",
    note: "Morning coffee",
    createdAt: "2024-01-11T08:30:00Z"
  },
  {
    id: "6",
    title: "Amazon Purchase",
    amount: 67.89,
    date: "2024-01-10",
    category: "Shopping",
    note: "New headphones",
    createdAt: "2024-01-10T19:45:00Z"
  },
  {
    id: "7",
    title: "Restaurant Dinner",
    amount: 65.00,
    date: "2024-01-09",
    category: "Food & Dining",
    note: "Date night at Italian restaurant",
    createdAt: "2024-01-09T20:15:00Z"
  },
  {
    id: "8",
    title: "Movie Tickets",
    amount: 24.00,
    date: "2024-01-08",
    category: "Entertainment",
    note: "Two tickets for new release",
    createdAt: "2024-01-08T18:30:00Z"
  },
  {
    id: "9",
    title: "Pharmacy",
    amount: 32.45,
    date: "2024-01-07",
    category: "Healthcare",
    note: "Prescription medication",
    createdAt: "2024-01-07T11:20:00Z"
  },
  {
    id: "10",
    title: "Uber Ride",
    amount: 18.50,
    date: "2024-01-06",
    category: "Transportation",
    note: "Ride to airport",
    createdAt: "2024-01-06T06:45:00Z"
  },
  {
    id: "11",
    title: "Gym Membership",
    amount: 45.00,
    date: "2024-01-05",
    category: "Healthcare",
    note: "Monthly gym fee",
    createdAt: "2024-01-05T12:00:00Z"
  },
  {
    id: "12",
    title: "Book Store",
    amount: 28.99,
    date: "2024-01-04",
    category: "Shopping",
    note: "New programming book",
    createdAt: "2024-01-04T15:30:00Z"
  },
  {
    id: "13",
    title: "Dinner",
    amount: 38.99,
    date: "2024-03-04",
    category: "Food & Dining",
    note: "Dinner with friends",
    createdAt: "2024-03-04T15:30:00Z"
  },
  {
    id: "14",
    title: "Car parts",
    amount: 198.99,
    date: "2024-03-06",
    category: "Shopping",
    note: "Front brake pads",
    createdAt: "2024-03-06T15:30:00Z"
  }
]

export default function HistoryPage() {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses)
  const handleEdit = (expense: Expense) => {
    // TODO: Implement edit functionality
    console.log("Edit expense:", expense)
  }

  const handleDelete = (expenseId: string) => {
    // TODO: Implement delete functionality
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId))
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense History</h1>
          <p className="text-muted-foreground">
            View and manage your expense records. Search, filter, and sort to find what you need.
          </p>
        </div>

        {/* Expense Table */}
        <ExpenseTable 
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  )
}