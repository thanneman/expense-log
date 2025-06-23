import * as React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CategoryBadge } from "@/components/ui/category-badge"
import { getCategoryColor } from "@/lib/category-colors"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ChevronDown, ChevronUp, MoreHorizontal, Search, Filter, Calendar, BarChart3, RotateCcw } from "lucide-react"
import type { Expense as SupabaseExpense } from "@/lib/supabase"

// Expense type definition - using Supabase type with mapping
export interface Expense {
  id: string
  title: string
  amount: number
  date: string
  category: string
  note?: string
  createdAt: string
}

// Helper function to map Supabase expense to component expense
export const mapSupabaseExpense = (expense: SupabaseExpense): Expense => ({
  id: expense.id,
  title: expense.title,
  amount: expense.amount,
  date: expense.date,
  category: expense.category,
  note: expense.note,
  createdAt: expense.created_at
})

interface ExpenseTableProps {
  expenses: Expense[]
  onEdit?: (expense: Expense) => void
  onDelete?: (expenseId: string) => void
  editingId?: string | null
  EditForm?: React.ComponentType<{
    expense: Expense
    onSave: (id: string, data: { title: string; amount: number; date: string; category: string; note?: string }) => Promise<void>
    onCancel: () => void
    isSubmitting: boolean
  }>
}

type SortField = 'title' | 'amount' | 'date' | 'category'
type SortDirection = 'asc' | 'desc'
type GroupBy = 'none' | 'month' | 'category'

export function ExpenseTable({ expenses, onEdit, onDelete, editingId, EditForm }: ExpenseTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [groupBy, setGroupBy] = useState<GroupBy>('none')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const itemsPerPage = 10

  // Memoize the EditForm component to prevent unnecessary re-renders
  const MemoizedEditForm = useMemo(() => {
    return EditForm
  }, [EditForm])

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))]
    return uniqueCategories.sort()
  }, [expenses])

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    const filtered = expenses.filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (expense.note && expense.note.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = !categoryFilter || expense.category === categoryFilter
      
      const matchesDateRange = (!dateRange.start || expense.date >= dateRange.start) &&
                              (!dateRange.end || expense.date <= dateRange.end)
      
      return matchesSearch && matchesCategory && matchesDateRange
    })

    // Sort expenses
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number = a[sortField]
      let bValue: string | number = b[sortField]

      // Handle date sorting
      if (sortField === 'date') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      // Handle amount sorting
      if (sortField === 'amount') {
        aValue = parseFloat(aValue.toString())
        bValue = parseFloat(bValue.toString())
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toString().toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sorted
  }, [expenses, searchTerm, categoryFilter, dateRange, sortField, sortDirection])

  // Group expenses
  const groupedExpenses = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Expenses': filteredAndSortedExpenses }
    }

    const groups: Record<string, Expense[]> = {}
    
    filteredAndSortedExpenses.forEach(expense => {
      let groupKey: string
      
      if (groupBy === 'month') {
        const date = new Date(expense.date)
        groupKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      } else if (groupBy === 'category') {
        groupKey = expense.category
      } else {
        groupKey = 'All Expenses'
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(expense)
    })

    // Sort group keys
    const sortedGroups: Record<string, Expense[]> = {}
    Object.keys(groups)
      .sort((a, b) => {
        if (groupBy === 'month') {
          return new Date(groups[a][0].date).getTime() - new Date(groups[b][0].date).getTime()
        }
        return a.localeCompare(b)
      })
      .forEach(key => {
        sortedGroups[key] = groups[key]
      })

    return sortedGroups
  }, [filteredAndSortedExpenses, groupBy])

  // Calculate totals
  const totalAmount = useMemo(() => {
    return filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [filteredAndSortedExpenses])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedExpenses = filteredAndSortedExpenses.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field ? (
          sortDirection === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <div className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  )

  const handleSaveEdit = async (id: string, data: { title: string; amount: number; date: string; category: string; note?: string }) => {
    setIsSubmitting(true)
    try {
      // This will be handled by the parent component
      if (onEdit) {
        // We need to find a way to call the parent's save function
        // For now, we'll use a custom event
        const event = new CustomEvent('expense-save', { detail: { id, data } })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error("Error updating expense:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    // This will be handled by the parent component
    if (onEdit) {
      const event = new CustomEvent('expense-cancel')
      window.dispatchEvent(event)
    }
  }

  const renderExpenseRow = (expense: Expense) => {
    const isEditing = editingId === expense.id

    if (isEditing && MemoizedEditForm) {
      return (
        <TableRow key={expense.id} id={`expense-${expense.id}`}>
          <TableCell colSpan={6} className="p-0">
            <MemoizedEditForm
              expense={expense}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </TableCell>
        </TableRow>
      )
    }

    return (
      <TableRow key={expense.id} id={`expense-${expense.id}`}>
        <TableCell className="font-medium max-w-[120px] md:max-w-none truncate text-xs md:text-base">
          {expense.title}
        </TableCell>
        <TableCell className="font-mono text-xs md:text-sm">
          {formatCurrency(expense.amount)}
        </TableCell>
        <TableCell className="text-xs md:text-sm">
          {formatDate(expense.date)}
        </TableCell>
        <TableCell>
          <CategoryBadge category={expense.category} />
        </TableCell>
        <TableCell className="hidden md:table-cell max-w-[200px] truncate">
          {expense.note || "-"}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 md:h-8 md:w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(expense)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(expense.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    )
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setCategoryFilter("")
    setDateRange({ start: "", end: "" })
    setSortField('date')
    setSortDirection('desc')
    setGroupBy('none')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || categoryFilter || dateRange.start || dateRange.end || groupBy !== 'none'

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        {/* Search and Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {categoryFilter || "All Categories"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setCategoryFilter("")
                setCurrentPage(1)
              }}>
                All Categories
              </DropdownMenuItem>
              {categories.map((category) => {
                const color = getCategoryColor(category)
                return (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => {
                      setCategoryFilter(category)
                      setCurrentPage(1)
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${color.bgColor.replace('bg-', 'bg-').replace('/30', '')} border ${color.borderColor}`} />
                    {category}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Date Range Filter and Group By */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Date Range:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="date"
              placeholder="Start date"
              value={dateRange.start}
              onChange={(e) => {
                setDateRange(prev => ({ ...prev, start: e.target.value }))
                setCurrentPage(1)
              }}
              className="w-full sm:w-auto"
            />
            <span className="text-muted-foreground self-center">to</span>
            <Input
              type="date"
              placeholder="End date"
              value={dateRange.end}
              onChange={(e) => {
                setDateRange(prev => ({ ...prev, end: e.target.value }))
                setCurrentPage(1)
              }}
              className="w-full sm:w-auto"
            />
            {(dateRange.start || dateRange.end) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateRange({ start: "", end: "" })
                  setCurrentPage(1)
                }}
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Group by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {groupBy === 'none' && 'None'}
                  {groupBy === 'month' && 'Month'}
                  {groupBy === 'category' && 'Category'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setGroupBy('none')}>
                  None
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGroupBy('month')}>
                  Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setGroupBy('category')}>
                  Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results Summary and Clear All */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground flex-1">
            <span className="font-medium">Total: {formatCurrency(totalAmount)}</span>
            {groupBy === 'none' && (
              <span> • Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedExpenses.length)} of {filteredAndSortedExpenses.length} expenses</span>
            )}
            {categoryFilter && ` • Filtered by ${categoryFilter}`}
          </div>
          
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className={!hasActiveFilters ? "opacity-50" : ""}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="title">Title</SortableHeader>
                <SortableHeader field="amount">Amount</SortableHeader>
                <SortableHeader field="date">Date</SortableHeader>
                <SortableHeader field="category">Category</SortableHeader>
                <TableHead className="hidden md:table-cell">Note</TableHead>
                <TableHead className="w-[80px] md:w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupBy === 'none' ? (
                // Regular table view
                paginatedExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm || categoryFilter || dateRange.start || dateRange.end ? "No expenses found matching your filters." : "No expenses found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedExpenses.map(renderExpenseRow)
                )
              ) : (
                // Grouped view
                Object.keys(groupedExpenses).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm || categoryFilter || dateRange.start || dateRange.end ? "No expenses found matching your filters." : "No expenses found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(groupedExpenses).map(([groupKey, groupExpenses]) => {
                    const groupTotal = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0)
                    
                    // Get category color if grouping by category
                    const categoryColor = groupBy === 'category' ? getCategoryColor(groupKey) : null
                    
                    return (
                      <React.Fragment key={groupKey}>
                        {/* Group Header */}
                        <TableRow className={`${groupBy === 'category' ? `${categoryColor?.bgColor} ${categoryColor?.borderColor}` : 'bg-muted/30'}`}>
                          <TableCell colSpan={groupBy === 'category' ? 4 : 5} className={`font-semibold ${groupBy === 'category' ? categoryColor?.textColor : ''}`}>
                            {groupBy === 'category' && (
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${categoryColor?.bgColor.replace('bg-', 'bg-').replace('/30', '')} border ${categoryColor?.borderColor}`} />
                                {groupKey}
                              </div>
                            )}
                            {groupBy !== 'category' && groupKey}
                          </TableCell>
                          <TableCell className="font-semibold text-right">
                            {formatCurrency(groupTotal)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        {/* Group Expenses */}
                        {groupExpenses.map(renderExpenseRow)}
                      </React.Fragment>
                    )
                  })
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination - Only show when not grouped */}
      {groupBy === 'none' && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 