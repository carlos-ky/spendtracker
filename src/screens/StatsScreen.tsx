import { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import { fetchMonthStats, getCurrentAndPreviousMonth, type MonthStats } from '../lib/stats'
import { colors, spacing, typography, radius } from '../theme/colors'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import PieChart from '../components/PieChart'

export default function StatsScreen() {
  const { user } = useAuth()
  const [currentStats, setCurrentStats] = useState<MonthStats | null>(null)
  const [previousStats, setPreviousStats] = useState<MonthStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = useCallback(async () => {
    if (!user) return

    const { current, previous } = getCurrentAndPreviousMonth()
    const [currentData, previousData] = await Promise.all([
      fetchMonthStats(user.id, current),
      fetchMonthStats(user.id, previous),
    ])

    setCurrentStats(currentData)
    setPreviousStats(previousData)
    setLoading(false)
  }, [user])

  useFocusEffect(
    useCallback(() => {
      loadStats()
    }, [loadStats])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  const total = currentStats?.total || 0
  const previousTotal = previousStats?.total || 0
  const diff = total - previousTotal
  const diffPercent = previousTotal > 0 ? (diff / previousTotal) * 100 : 0
  const isIncrease = diff > 0

  const monthLabel = format(new Date(), 'MMMM yyyy', { locale: fr })
  const isEmpty = total === 0

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.subtitle}>{monthLabel}</Text>

      {/* Total card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Dépensé ce mois</Text>
        <Text style={styles.totalAmount}>{total.toLocaleString('fr-FR')} FCFA</Text>

        {previousTotal > 0 && (
          <View style={styles.comparison}>
            <Ionicons
              name={isIncrease ? 'trending-up' : 'trending-down'}
              size={16}
              color={isIncrease ? colors.danger : colors.success}
            />
            <Text
              style={[
                styles.comparisonText,
                { color: isIncrease ? colors.danger : colors.success },
              ]}
            >
              {isIncrease ? '+' : ''}
              {diffPercent.toFixed(1)}% vs mois précédent
            </Text>
          </View>
        )}

        {previousTotal === 0 && total > 0 && (
          <Text style={styles.comparisonNeutral}>Premier mois de suivi</Text>
        )}
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>Pas encore de statistiques</Text>
          <Text style={styles.emptyText}>
            Ajoutez des dépenses pour voir leur répartition par catégorie.
          </Text>
        </View>
      ) : (
        <>
          {/* Graphique camembert */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Répartition par catégorie</Text>
            <View style={styles.chartContainer}>
              <PieChart
                slices={
                  currentStats?.categoryStats.map((s) => ({
                    value: s.total,
                    color: s.categoryColor,
                  })) || []
                }
                size={200}
                strokeWidth={36}
              />
              <View style={styles.chartCenter}>
                <Text style={styles.chartCenterCount}>
                  {currentStats?.count || 0}
                </Text>
                <Text style={styles.chartCenterLabel}>
                  dépense{(currentStats?.count || 0) > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Liste des catégories */}
          <View style={styles.listCard}>
            <Text style={styles.sectionTitle}>Détail par catégorie</Text>
            {currentStats?.categoryStats.map((stat) => (
              <View key={stat.categoryId || 'uncategorized'} style={styles.statRow}>
                <View style={styles.statLeft}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: stat.categoryColor + '30' },
                    ]}
                  >
                    <Text style={styles.statEmoji}>{stat.categoryIcon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statName}>{stat.categoryName}</Text>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.categoryColor,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.statRight}>
                  <Text style={styles.statAmount}>
                    {stat.total.toLocaleString('fr-FR')} F
                  </Text>
                  <Text style={styles.statPercent}>{stat.percentage.toFixed(1)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
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
  content: {
    padding: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizeXxl,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizeBase,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    textTransform: 'capitalize',
  },
  totalCard: {
    backgroundColor: colors.surfaceDark,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: typography.sizeXs,
    color: colors.textOnDark,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: typography.sizeDisplay,
    color: colors.textOnDark,
    fontWeight: typography.weightBold,
    letterSpacing: -1,
  },
  comparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  comparisonText: {
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
  },
  comparisonNeutral: {
    fontSize: typography.sizeSm,
    color: colors.textOnDark,
    opacity: 0.6,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
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
  chartCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 220,
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartCenterCount: {
    fontSize: typography.sizeXxl,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  chartCenterLabel: {
    fontSize: typography.sizeXs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 18,
  },
  statName: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.text,
    marginBottom: 6,
  },
  barContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 2,
  },
  statRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  statAmount: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightSemibold,
    color: colors.text,
  },
  statPercent: {
    fontSize: typography.sizeXs,
    color: colors.textMuted,
    marginTop: 2,
  },
})