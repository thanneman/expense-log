import { Layout } from "@/components/layout"
import { ExpenseTable, type Expense } from "@/components/expense-table"
import { useExpenses } from "@/hooks/use-expenses"

export default function HistoryPage() {
  const { expenses, loading, error, deleteExpense } = useExpenses()

  const handleEdit = (expense: Expense) => {
    // TODO: Implement edit functionality
    console.log("Edit expense:", expense)
  }

  const handleDelete = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId)
    } catch (error) {
      console.error("Error deleting expense:", error)
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