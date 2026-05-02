export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  is_default: boolean
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  description: string
  date: string
  created_at: string
}

export interface ExpenseWithCategory extends Expense {
  category: Category | null
}

export type ExpenseInput = {
  amount: number
  description: string
  category_id: string | null
  date: string
}

export type CategoryInput = {
  name: string
  icon: string
  color: string
}