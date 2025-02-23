import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context oluştur
const FavoritesContext = createContext();

// Custom hook: Kolay erişim için
export const useFavorites = () => useContext(FavoritesContext);

// Anahtar adı (AsyncStorage için)
const STORAGE_KEY = 'favorites_id_list';

// Context Provider bileşeni
export const FavoritesProvider = ({ children }) => {
  const [idList, setIdList] = useState([]); // Favori ID'leri global state

  // Favori listesini AsyncStorage'a kaydet
  const saveFavoritesToStorage = async (list) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      console.error('Favori listesi kaydedilirken hata oluştu:', error);
    }
  };

  // Favori listesini AsyncStorage'dan yükle
  const loadFavoritesFromStorage = async () => {
    try {
      const storedList = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedList) {
        setIdList(JSON.parse(storedList));
      }
    } catch (error) {
      console.error('Favori listesi yüklenirken hata oluştu:', error);
    }
  };

  // Favorilere ekleme fonksiyonu
  const addToFavorites = (id) => {
    if (!idList.includes(id)) {
      const updatedList = [...idList, id];
      setIdList(updatedList);
      saveFavoritesToStorage(updatedList); // AsyncStorage'a kaydet
    }
  };

  // Favorilerden çıkarma fonksiyonu
  const removeFromFavorites = (id) => {
    const updatedList = idList.filter((item) => item !== id);
    setIdList(updatedList);
    saveFavoritesToStorage(updatedList); // AsyncStorage'a kaydet
  };

  // Uygulama başladığında favori listesini yükle
  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  return (
    <FavoritesContext.Provider value={{ idList, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
