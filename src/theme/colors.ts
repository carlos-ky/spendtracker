export const colors = {
  // Fond et texte
  background: '#F8F6F0',
  surface: '#FFFFFF',
  surfaceDark: '#0E0E0E',
  text: '#0E0E0E',
  textOnDark: '#F8F6F0',
  textMuted: '#4A4A4A',
  textLight: '#8B8680',

  // Accent
  primary: '#A64B28',
  primaryDark: '#7A361D',
  primaryLight: '#C56B49',

  // Gris
  border: '#E5E0D8',
  borderDark: '#4A4A4A',

  // États sémantiques (basés sur la palette)
  success: '#4A6B3A',
  danger: '#A64B28',
  warning: '#C68B3D',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const typography = {
  // Tailles
  sizeXs: 11,
  sizeSm: 13,
  sizeBase: 15,
  sizeLg: 18,
  sizeXl: 22,
  sizeXxl: 28,
  sizeDisplay: 36,

  // Poids
  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemibold: '600' as const,
  weightBold: '700' as const,
}

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
}