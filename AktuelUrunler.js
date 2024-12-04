// AktuelUrunler.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Favorites from './components/Favorites';
import CategoriesScreen from './components/CategoriesScreen';
import Notifications from './components/Notifications';
import Main from './components/Main';
import BrochuresList from './components/BrouchureList';
import BrochureDetail from './components/BrouchureDetail';
// Tab bar oluşturma
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


// Stack Navigator ile Broşürler Listesi ve Broşür Detayı Sayfası
function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="BrochuresList" component={BrochuresList} options={{ title: 'Broşürler' }} />
      <Stack.Screen name="BrochureDetail" component={BrochureDetail} options={{ title: 'Broşür Detayı' }} />
    </Stack.Navigator>
  );
}

// Alt menülerin olduğu Tab Navigator
function AppTabs() {
  return (
    <Tab.Navigator     initialRouteName="Ayarlar"
    screenOptions={{
      tabBarStyle: { backgroundColor: '#1c1c1c' }, // Alt menü rengi
      tabBarActiveTintColor: '#ffa500', // Aktif sekme rengi
      tabBarInactiveTintColor: 'gray', // Pasif sekme rengi
    }}
  >
    <Tab.Screen name="Categoriler" component={CategoriesScreen} />
    <Tab.Screen name="Favoriler" component={Favorites} />
    <Tab.Screen name="Bildirimler" component={Notifications} />
    <Tab.Screen name="Anasayfa" component={Main} />

  </Tab.Navigator>
  );
}


const AktuelUrunler = () => {
  return (
    <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
  );
};

export default AktuelUrunler;
