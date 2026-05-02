import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { colors, spacing, typography, radius } from '../theme/colors'
import type { ExpenseWithCategory } from '../types/database'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Platform } from 'react-native'



export default function HomeScreen() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchExpenses = useCallback(async () => {
    if (!user) return

    const start = startOfMonth(new Date()).toISOString().split('T')[0]
    const end = endOfMonth(new Date()).toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('st_expenses')
      .select('*, category:st_categories(*)')
      .eq('user_id', user.id)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error)
    } else {
      setExpenses((data as ExpenseWithCategory[]) || [])
    }

    setLoading(false)
    setRefreshing(false)
  }, [user])

  // Refetch à chaque fois que l'écran devient actif (après ajout depuis Add)
  useFocusEffect(
    useCallback(() => {
      fetchExpenses()
    }, [fetchExpenses])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchExpenses()
  }

  const handleDelete = (id: string) => {
  const confirmed = Platform.OS === 'web'
    ? window.confirm('Supprimer cette dépense ? Cette action est irréversible.')
    : true // sur mobile on garde l'Alert

  if (Platform.OS === 'web') {
    if (!confirmed) return
    supabase
      .from('st_expenses')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) window.alert('Erreur : ' + error.message)
        else fetchExpenses()
      })
    return
  }

  // Mobile : Alert natif
  Alert.alert(
    'Supprimer cette dépense ?',
    'Cette action est irréversible.',
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('st_expenses').delete().eq('id', id)
          if (error) Alert.alert('Erreur', error.message)
          else fetchExpenses()
        },
      },
    ]
  )
}

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const monthLabel = format(new Date(), 'MMMM yyyy', { locale: fr })

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header avec total */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>Total {monthLabel}</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn} activeOpacity={0.7}>
            <Ionicons name="refresh" size={20} color={colors.textOnDark} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerAmount}>{total.toLocaleString('fr-FR')} FCFA</Text>
        <Text style={styles.headerCount}>
          {expenses.length} dépense{expenses.length !== 1 ? 's' : ''} ce mois
        </Text>
      </View>

      {/* Liste */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💰</Text>
            <Text style={styles.emptyTitle}>Aucune dépense ce mois</Text>
            <Text style={styles.emptyText}>
              Appuyez sur "Ajouter" pour enregistrer votre première dépense.
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.expenseCard}>
            <View style={styles.expenseLeft}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: (item.category?.color || colors.textMuted) + '20' },
                ]}
              >
                <Text style={styles.categoryEmoji}>{item.category?.icon || '📦'}</Text>
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDescription} numberOfLines={1}>
                  {item.description}
                </Text>
                <Text style={styles.expenseMeta}>
                  {item.category?.name || 'Sans catégorie'} •{' '}
                  {format(new Date(item.date), 'd MMM', { locale: fr })}
                </Text>
              </View>
            </View>
            <View style={styles.expenseRight}>
              <Text style={styles.expenseAmount}>
                {Number(item.amount).toLocaleString('fr-FR')} F
              </Text>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteBtn}
                activeOpacity={0.6}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surfaceDark,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerLabel: {
    fontSize: typography.sizeSm,
    color: colors.textOnDark,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  headerAmount: {
    fontSize: typography.sizeDisplay,
    color: colors.textOnDark,
    fontWeight: typography.weightBold,
    letterSpacing: -1,
  },
  headerCount: {
    fontSize: typography.sizeSm,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: typography.weightMedium,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
  },
  expenseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: typography.sizeBase,
    color: colors.text,
    fontWeight: typography.weightMedium,
    marginBottom: 2,
  },
  expenseMeta: {
    fontSize: typography.sizeXs,
    color: colors.textMuted,
  },
  expenseAmount: {
    fontSize: typography.sizeBase,
    color: colors.text,
    fontWeight: typography.weightSemibold,
    marginLeft: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizeLg,
    color: colors.text,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sizeSm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  hint: {
    textAlign: 'center',
    fontSize: typography.sizeXs,
    color: colors.textLight,
    paddingVertical: spacing.sm,
    fontStyle: 'italic',
  },
  headerTop: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing.xs,
},
refreshBtn: {
  padding: 6,
  borderRadius: radius.full,
  backgroundColor: 'rgba(255,255,255,0.1)',
},
expenseRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
},
deleteBtn: {
  padding: 4,
},
})