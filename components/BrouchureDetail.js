import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import API_ENDPOINTS from '../config';
import { useFavorites } from '../FavoritesContext'; // Context'ten hook'u içe aktarın
import { Ionicons } from '@expo/vector-icons'; // Kalp simgesi için

function BrochureDetail({ route }) {
  const { id } = route.params;

  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { idList, addToFavorites, removeFromFavorites } = useFavorites(); // Favori ekleme/çıkarma ve listeye erişim
  const [isFavorite, setIsFavorite] = useState(false);

  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat
  const cacheFileUri = `${FileSystem.cacheDirectory}brochure_response_${id}.json`; // ID bazlı cache

  const fetchAndCacheResponse = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(cacheFileUri);
      // Cache kontrolü
      if (fileInfo.exists && new Date().getTime() - fileInfo.modificationTime * 1000 < CACHE_DURATION) {
        const cachedData = await FileSystem.readAsStringAsync(cacheFileUri);
        handlePdfData(JSON.parse(cachedData));
      } else {
        // API'den veri çek ve cache'e kaydet
        const response = await fetch(API_ENDPOINTS.getBrochureById(id));
        if (!response.ok) throw new Error("API çağrısı başarısız.");
  
        const responseData = await response.json();
        if (!responseData || !responseData.pdfData) {
          throw new Error("API'den geçersiz veya boş veri döndü.");
        }
  
        await FileSystem.writeAsStringAsync(cacheFileUri, JSON.stringify(responseData)); // Cache'e yaz
        handlePdfData(responseData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfData = async (data) => {
    if (!data || !data.pdfData) {
      throw new Error("PDF verisi mevcut değil veya geçersiz.");
    }
  
    const pdfFileUri = `${FileSystem.cacheDirectory}brochure_${id}.pdf`;
    await FileSystem.writeAsStringAsync(pdfFileUri, data.pdfData, { encoding: FileSystem.EncodingType.Base64 });
    setPdfUri(pdfFileUri);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(id);
      Alert.alert('Başarılı', 'Broşür favorilerden çıkarıldı!');
    } else {
      addToFavorites(id);
      Alert.alert('Başarılı', 'Broşür favorilere eklendi!');
    }
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    fetchAndCacheResponse();
    // İlk yüklemede favori durumunu kontrol et
    setIsFavorite(idList.includes(id));
  }, [id, idList]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Hata: {error}</Text>
      </View>
    );
  }

  if (!pdfUri) {
    return (
      <View style={styles.container}>
        <Text>PDF bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: pdfUri }}
        style={styles.webView}
        onError={() => Alert.alert('Hata', 'PDF görüntülenemedi')}
      />
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={30}
          color={isFavorite ? 'red' : 'gray'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
    elevation: 3,
  },
});

export default BrochureDetail;
