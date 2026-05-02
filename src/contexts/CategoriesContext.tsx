import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { Category, CategoryInput } from '../types/database'

interface CategoriesContextType {
  categories: Category[]
  loading: boolean
  refresh: () => Promise<void>
  addCategory: (input: CategoryInput) => Promise<{ error: Error | null }>
  updateCategory: (id: string, input: CategoryInput) => Promise<{ error: Error | null }>
  deleteCategory: (id: string) => Promise<{ error: Error | null }>
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setCategories([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('st_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }, [user])

  // Charger automatiquement quand user change (login/logout)
  useEffect(() => {
    setLoading(true)
    refresh()
  }, [refresh])

  const addCategory = async (input: CategoryInput) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('st_categories')
      .insert({ ...input, user_id: user.id, is_default: false })
      .select()
      .single()

    if (error) return { error }

    // Mise à jour optimiste de l'état local
    setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return { error: null }
  }

  const updateCategory = async (id: string, input: CategoryInput) => {
    const { data, error } = await supabase
      .from('st_categories')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) return { error }

    setCategories((prev) =>
      prev
        .map((cat) => (cat.id === id ? data : cat))
        .sort((a, b) => a.name.localeCompare(b.name))
    )
    return { error: null }
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('st_categories').delete().eq('id', id)

    if (error) return { error }

    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    return { error: null }
  }

  return (
    <CategoriesContext.Provider
      value={{ categories, loading, refresh, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider')
  }
  return context
}