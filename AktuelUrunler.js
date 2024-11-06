// AktuelUrunler.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/HomeScreen';
import MarketsScreen from './components/MarketsScreen';
import CategoriesScreen from './components/CategoriesScreen';
import SettingsScreen from './components/SettingsScreen';

// Tab bar oluşturma
const Tab = createBottomTabNavigator();

const AktuelUrunler = () => {
  return (
    <NavigationContainer>
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
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AktuelUrunler;
