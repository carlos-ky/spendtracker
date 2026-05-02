import { supabase } from './supabase'

const DEFAULT_CATEGORIES = [
  { name: 'Alimentation', icon: '🍽️', color: '#A64B28' },
  { name: 'Transport', icon: '🚗', color: '#4A6B3A' },
  { name: 'Logement', icon: '🏠', color: '#5B7BA8' },
  { name: 'Loisirs', icon: '🎉', color: '#C68B3D' },
  { name: 'Santé', icon: '⚕️', color: '#7A361D' },
  { name: 'Autre', icon: '📦', color: '#4A4A4A' },
]

let ensuredFor: string | null = null

export async function ensureDefaultCategories(userId: string) {
  // Garde-fou en mémoire : si on a déjà fait l'appel pour ce user dans cette session, on saute.
  if (ensuredFor === userId) return
  ensuredFor = userId

  // Vérifie d'abord en BDD
  const { data: existing, error: fetchError } = await supabase
    .from('st_categories')
    .select('id')
    .eq('user_id', userId)
    .eq('is_default', true)
    .limit(1)

  if (fetchError) {
    console.error('Error checking categories:', fetchError)
    ensuredFor = null // permet de réessayer
    return
  }

  if (existing && existing.length > 0) return

  // Pas de catégories : on insère
  const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    user_id: userId,
    is_default: true,
  }))

  const { error } = await supabase.from('st_categories').insert(categoriesToInsert)
  if (error) {
    console.error('Error creating default categories:', error)
    ensuredFor = null
  }
}