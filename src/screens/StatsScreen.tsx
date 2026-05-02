import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { colors, spacing, typography } from '../theme/colors'

export default function HomeScreen() {
  const { user } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.placeholder}>
        Stats des depenses du mois
      </Text>
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
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.sizeSm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  placeholder: {
    fontSize: typography.sizeBase,
    color: colors.textLight,
    fontStyle: 'italic',
  },
})