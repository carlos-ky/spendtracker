import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { colors, spacing, typography, radius } from '../theme/colors'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email et mot de passe requis')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Compte créé. Vous pouvez vous connecter.')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.brandEmoji}>💰</Text>
          <Text style={styles.brand}>SpendTracker</Text>
          <Text style={styles.tagline}>Suivez vos dépenses, simplement.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>
            {isSignUp ? 'Créer un compte' : 'Connexion'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="vous@exemple.com"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="6 caractères minimum"
              placeholderTextColor={colors.textLight}
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
          {message && <Text style={styles.success}>{message}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnDark} />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Créer le compte' : 'Se connecter'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setMessage(null)
            }}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Déjà un compte ? Se connecter'
                : 'Pas de compte ? Créer un compte'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Carlos KY · 2026</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  brand: {
    fontSize: typography.sizeDisplay,
    fontWeight: typography.weightBold,
    color: colors.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: typography.sizeSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: typography.sizeXl,
    fontWeight: typography.weightSemibold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizeSm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
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
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textOnDark,
    fontSize: typography.sizeBase,
    fontWeight: typography.weightSemibold,
  },
  switchButton: {
    marginTop: spacing.md,
    alignItems: 'center',
    padding: spacing.sm,
  },
  switchText: {
    color: colors.primary,
    fontSize: typography.sizeSm,
    fontWeight: typography.weightMedium,
  },
  error: {
    color: colors.danger,
    backgroundColor: '#FBE5DD',
    padding: spacing.sm,
    borderRadius: radius.sm,
    fontSize: typography.sizeSm,
    marginTop: spacing.xs,
  },
  success: {
    color: colors.success,
    backgroundColor: '#E5EDD8',
    padding: spacing.sm,
    borderRadius: radius.sm,
    fontSize: typography.sizeSm,
    marginTop: spacing.xs,
  },
  brandEmoji: {
  fontSize: 48,
  marginBottom: spacing.sm,
},
footer: {
  alignItems: 'center',
  marginTop: spacing.xl,
},
footerText: {
  fontSize: typography.sizeXs,
  color: colors.textLight,
  letterSpacing: 1,
},
})