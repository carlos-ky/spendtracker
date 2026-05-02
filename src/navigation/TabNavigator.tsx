import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
import AddExpenseScreen from '../screens/AddExpenseScreen'
import StatsScreen from '../screens/StatsScreen'
import SettingsScreen from '../screens/SettingsScreen'
import { colors } from '../theme/colors'

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

          if (route.name === 'Home') iconName = 'list-outline'
          else if (route.name === 'Add') iconName = 'add-circle'
          else if (route.name === 'Stats') iconName = 'stats-chart-outline'
          else if (route.name === 'Settings') iconName = 'settings-outline'

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dépenses' }} />
      <Tab.Screen
        name="Add"
        component={AddExpenseScreen}
        options={{
          title: 'Ajouter',
          tabBarIconStyle: { marginBottom: -4 },
        }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Stats' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres' }} />
    </Tab.Navigator>
  )
}