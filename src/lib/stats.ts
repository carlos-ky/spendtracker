import { supabase } from './supabase'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export interface CategoryStat {
  categoryId: string | null
  categoryName: string
  categoryIcon: string
  categoryColor: string
  total: number
  count: number
  percentage: number
}

export interface MonthStats {
  total: number
  count: number
  categoryStats: CategoryStat[]
}

export async function fetchMonthStats(userId: string, monthDate: Date): Promise<MonthStats> {
  const start = format(startOfMonth(monthDate), 'yyyy-MM-dd')
  const end = format(endOfMonth(monthDate), 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('st_expenses')
    .select('amount, category_id, category:st_categories(id, name, icon, color)')
    .eq('user_id', userId)
    .gte('date', start)
    .lte('date', end)

  if (error || !data) {
    return { total: 0, count: 0, categoryStats: [] }
  }

  const total = data.reduce((sum, e) => sum + Number(e.amount), 0)
  const count = data.length

  // Grouper par catégorie
  const grouped = new Map<string, CategoryStat>()

  data.forEach((expense: any) => {
    const cat = expense.category
    const key = cat?.id || 'uncategorized'

    if (!grouped.has(key)) {
      grouped.set(key, {
        categoryId: cat?.id || null,
        categoryName: cat?.name || 'Sans catégorie',
        categoryIcon: cat?.icon || '📦',
        categoryColor: cat?.color || '#4A4A4A',
        total: 0,
        count: 0,
        percentage: 0,
      })
    }

    const stat = grouped.get(key)!
    stat.total += Number(expense.amount)
    stat.count += 1
  })

  // Calculer pourcentages et trier
  const categoryStats = Array.from(grouped.values())
    .map((stat) => ({
      ...stat,
      percentage: total > 0 ? (stat.total / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)

  return { total, count, categoryStats }
}

export function getCurrentAndPreviousMonth() {
  const now = new Date()
  return {
    current: now,
    previous: subMonths(now, 1),
  }
}