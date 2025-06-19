import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Track Your Expenses, Master Your Budget
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Take control of your finances with our simple and powerful expense tracker. 
          Monitor your spending, identify patterns, and achieve your financial goals.
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto w-full">
        {/* Add New Expense Card */}
        <div className="bg-card border rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Add New Expense</h3>
          </div>
          <p className="text-muted-foreground">
            Record a new expense to keep track of your spending. 
            Categorize it and add notes for better organization.
          </p>
          <Link href="/new">
            <Button className="w-full" size="lg">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </Link>
        </div>

        {/* View History Card */}
        <div className="bg-card border rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">View History</h3>
          </div>
          <p className="text-muted-foreground">
            Review your expense history, analyze spending patterns, 
            and get insights into your financial habits.
          </p>
          <Link href="/history">
            <Button variant="outline" className="w-full" size="lg">
              <BarChart3 className="h-4 w-4" />
              View History
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto w-full">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">$0</div>
          <div className="text-sm text-muted-foreground">Total Expenses</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Transactions</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">$0</div>
          <div className="text-sm text-muted-foreground">Monthly Average</div>
        </div>
      </div>
    </Layout>
  )
}
