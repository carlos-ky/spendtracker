import { useState, useEffect } from 'react'
import { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { colors, spacing, typography, radius } from '../theme/colors'
import type { Category } from '../types/database'

export default function AddExpenseScreen() {
  const { user } = useAuth()
  const navigation = useNavigation()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useFocusEffect(
    useCallback(() => {
      fetchCategories()
    }, [])
  )

  const fetchCategories = async () => {
    if (!user) return
    const { data } = await supabase
      .from('st_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    setCategories(data || [])
  }

  const handleSave = async () => {
    if (!user) return

    const amountNum = parseFloat(amount.replace(',', '.'))
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Montant invalide', 'Saisissez un montant supérieur à 0.')
      return
    }

    if (!description.trim()) {
      Alert.alert('Description manquante', 'Décrivez la dépense.')
      return
    }

    setSaving(true)

    const { error } = await supabase.from('st_expenses').insert({
      user_id: user.id,
      amount: amountNum,
      description: description.trim(),
      category_id: selectedCategory,
      date: new Date().toISOString().split('T')[0],
    })

    setSaving(false)

    if (error) {
      Alert.alert('Erreur', error.message)
      return
    }

    // Reset
    setAmount('')
    setDescription('')
    setSelectedCategory(null)

    // Retour Home
    navigation.navigate('Home' as never)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nouvelle dépense</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Montant (FCFA)</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Sandwich + boisson"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Catégorie</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    isSelected && {
                      backgroundColor: cat.color,
                      borderColor: cat.color,
                    },
                  ]}
                  onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryChipEmoji}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Enregistrement...' : 'Enregistrer la dépense'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: typography.sizeXxl,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizeXs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    fontWeight: typography.weightMedium,
  },
  amountInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: 32,
    color: colors.text,
    fontWeight: typography.weightBold,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.sizeBase,
    color: colors.text,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  categoryChipEmoji: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: typography.sizeSm,
    color: colors.text,
    fontWeight: typography.weightMedium,
  },
  categoryChipTextSelected: {
    color: colors.textOnDark,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textOnDark,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightSemibold,
  },
})