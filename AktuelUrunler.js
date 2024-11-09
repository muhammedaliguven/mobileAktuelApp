// AktuelUrunler.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import MarketsScreen from './components/MarketsScreen';
import CategoriesScreen from './components/CategoriesScreen';
import SettingsScreen from './components/SettingsScreen';
import AnasayfaTest from './components/Anasayfa';
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
    <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: '#1c1c1c' }, // Alt menü rengi
      tabBarActiveTintColor: '#ffa500', // Aktif sekme rengi
      tabBarInactiveTintColor: 'gray', // Pasif sekme rengi
    }}
  >
    <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
    <Tab.Screen name="Marketler" component={MarketsScreen} />
    <Tab.Screen name="Kategoriler" component={CategoriesScreen} />
    <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    <Tab.Screen name="Anasayfa Test" component={AnasayfaTest} />

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
