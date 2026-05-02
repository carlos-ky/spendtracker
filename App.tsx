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
      maxWidth: 480,
      alignSelf: 'center',
      width: '100%',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#E5E0D8',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
    }),
  },
})
