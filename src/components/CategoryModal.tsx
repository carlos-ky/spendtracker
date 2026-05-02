import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from 'react-native'
import { colors, spacing, typography, radius } from '../theme/colors'
import type { Category, CategoryInput } from '../types/database'

interface CategoryModalProps {
  visible: boolean
  category: Category | null
  onSave: (input: CategoryInput) => void
  onClose: () => void
}

const ICONS = ['🍽️', '🚗', '🏠', '🎉', '⚕️', '📦', '👕', '📚', '💼', '🎁', '⛽', '☕', '🛒', '💡', '📱', '✈️']
const PALETTE_COLORS = ['#A64B28', '#7A361D', '#4A6B3A', '#5B7BA8', '#C68B3D', '#8B4789', '#4A4A4A', '#2D2D2D']

export default function CategoryModal({ visible, category, onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📦')
  const [color, setColor] = useState('#A64B28')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setIcon(category.icon)
      setColor(category.color)
    } else {
      setName('')
      setIcon('📦')
      setColor('#A64B28')
    }
  }, [category, visible])

  const handleSave = async () => {
    if (!name.trim()) {
      if (Platform.OS === 'web') window.alert('Donnez un nom à votre catégorie.')
      return
    }
    setSaving(true)
    await onSave({ name: name.trim(), icon, color })
    setSaving(false)
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.preview}>
              <View style={[styles.previewIcon, { backgroundColor: color + '30' }]}>
                <Text style={styles.previewEmoji}>{icon}</Text>
              </View>
              <Text style={styles.previewName}>{name || 'Nom de la catégorie'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex : Courses du marché"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Icône</Text>
              <View style={styles.grid}>
                {ICONS.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={[styles.iconChip, icon === ic && styles.iconChipSelected]}
                    onPress={() => setIcon(ic)}
                  >
                    <Text style={styles.iconChipEmoji}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Couleur</Text>
              <View style={styles.grid}>
                {PALETTE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorChip,
                      { backgroundColor: c },
                      color === c && styles.colorChipSelected,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(14,14,14,0.6)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    maxHeight: '90%',
  },
  scroll: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizeXl,
    fontWeight: typography.weightSemibold,
    color: colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: colors.textMuted,
    lineHeight: 24,
  },
  preview: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  previewIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  previewEmoji: {
    fontSize: 28,
  },
  previewName: {
    fontSize: typography.sizeBase,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizeXs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    fontWeight: typography.weightMedium,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.sizeBase,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconChipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FBE5DD',
  },
  iconChipEmoji: {
    fontSize: 20,
  },
  colorChip: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorChipSelected: {
    borderColor: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  saveBtnText: {
    color: colors.textOnDark,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightSemibold,
  },
})