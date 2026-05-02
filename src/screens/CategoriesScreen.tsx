import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useCategories } from '../contexts/CategoriesContext'
import { colors, spacing, typography, radius } from '../theme/colors'
import type { Category, CategoryInput } from '../types/database'
import CategoryModal from '../components/CategoryModal'


export default function CategoriesScreen() {
  const navigation = useNavigation()
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleSave = async (input: CategoryInput) => {
    const { error } = editingCategory
      ? await updateCategory(editingCategory.id, input)
      : await addCategory(input)

    if (error) {
      if (Platform.OS === 'web') window.alert('Erreur : ' + error.message)
      else Alert.alert('Erreur', error.message)
      return
    }

    setModalVisible(false)
    setEditingCategory(null)
  }

  const handleDelete = (cat: Category) => {
    const message = `Supprimer "${cat.name}" ? Les dépenses gardées ne seront pas supprimées mais détachées de cette catégorie.`

    const doDelete = async () => {
      const { error } = await deleteCategory(cat.id)
      if (error) {
        if (Platform.OS === 'web') window.alert('Erreur : ' + error.message)
        else Alert.alert('Erreur', error.message)
      }
    }

    if (Platform.OS === 'web') {
      if (window.confirm(message)) doDelete()
      return
    }

    Alert.alert('Supprimer', message, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: doDelete },
    ])
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catégories</Text>
        <TouchableOpacity
          onPress={() => {
            setEditingCategory(null)
            setModalVisible(true)
          }}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={24} color={colors.textOnDark} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setEditingCategory(item)
              setModalVisible(true)
            }}
            activeOpacity={0.7}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconWrap, { backgroundColor: item.color + '30' }]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View>
                <Text style={styles.cardName}>{item.name}</Text>
                {item.is_default && <Text style={styles.cardBadge}>par défaut</Text>}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDelete(item)}
              style={styles.deleteBtn}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune catégorie. Créez-en une avec le bouton +.</Text>
          </View>
        }
      />

      <CategoryModal
        visible={modalVisible}
        category={editingCategory}
        onSave={handleSave}
        onClose={() => {
          setModalVisible(false)
          setEditingCategory(null)
        }}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.sizeXl,
    fontWeight: typography.weightSemibold,
    color: colors.text,
  },
  addBtn: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  cardName: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
  cardBadge: {
    fontSize: typography.sizeXs,
    color: colors.textLight,
    marginTop: 2,
    fontStyle: 'italic',
  },
  deleteBtn: {
    padding: 4,
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
})