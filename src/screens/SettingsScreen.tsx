import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { colors, spacing, typography, radius } from '../theme/colors'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizeXxl,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizeXs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.sizeBase,
    color: colors.text,
  },
  signOutButton: {
    backgroundColor: colors.surfaceDark,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  signOutText: {
    color: colors.textOnDark,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightSemibold,
  },
})