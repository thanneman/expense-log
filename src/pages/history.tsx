import { Layout } from "@/components/layout"
import { ExpenseTable, type Expense } from "@/components/expense-table"
import { useExpenses } from "@/hooks/use-expenses"
import { EditExpenseForm } from "@/components/edit-expense-form"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/router"

export default function HistoryPage() {
  const { expenses, loading, error, deleteExpense, updateExpense } = useExpenses()
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()

  // Listen for custom events from the ExpenseTable
  useEffect(() => {
    const handleExpenseSave = (event: CustomEvent) => {
      handleSaveEdit(event.detail.id, event.detail.data)
    }

    const handleExpenseCancel = () => {
      handleCancelEdit()
    }

    window.addEventListener('expense-save', handleExpenseSave as EventListener)
    window.addEventListener('expense-cancel', handleExpenseCancel)

    return () => {
      window.removeEventListener('expense-save', handleExpenseSave as EventListener)
      window.removeEventListener('expense-cancel', handleExpenseCancel)
    }
  }, [])

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
    // Scroll to the expense row
    setTimeout(() => {
      const element = document.getElementById(`expense-${expense.id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handleSaveEdit = async (id: string, data: { title: string; amount: number; date: string; category: string; note?: string }) => {
    try {
      await updateExpense(id, data)
      setEditingId(null)
    } catch (error) {
      console.error("Error updating expense:", error)
      throw error
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense? This action cannot be undone.")) {
      return
    }

    try {
      await deleteExpense(expenseId)
    } catch (error) {
      console.error("Error deleting expense:", error)
      alert("Failed to delete expense. Please try again.")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expense History</h1>
            <p className="text-muted-foreground">
              View and manage your expense records. Search, filter, and sort to find what you need.
            </p>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading expenses...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expense History</h1>
            <p className="text-muted-foreground">
              View and manage your expense records. Search, filter, and sort to find what you need.
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex md:items-center justify-between flex-col md:flex-row space-y-3 md:space-y-0">
          <div className="md:mr-2">
            <h1 className="text-3xl font-bold tracking-tight">Expense History</h1>
            <p className="text-muted-foreground">
              View and manage your expense records. Search, filter, and sort to find what you need.
            </p>
          </div>
          <Button onClick={() => router.push('/new')}>
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Expense Table */}
        <ExpenseTable 
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editingId={editingId}
          EditForm={({ expense, onSave, onCancel, isSubmitting }) => (
            <EditExpenseForm
              expense={expense}
              onSave={onSave}
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />
          )}
        />
      </div>
    </Layout>
  )
}