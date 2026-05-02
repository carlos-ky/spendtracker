import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet, Platform } from 'react-native'
import { AuthProvider } from './src/contexts/AuthContext'
import { CategoriesProvider } from './src/contexts/CategoriesContext'
import RootNavigator from './src/navigation/RootNavigator'

export default function App() {
  return (
    <AuthProvider>
      <CategoriesProvider>
        <NavigationContainer>
          <View style={styles.appWrapper}>
            <RootNavigator />
          </View>
          <StatusBar style="dark" />
        </NavigationContainer>
      </CategoriesProvider>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
      minHeight: '100vh' as any,
    }),
  },
})