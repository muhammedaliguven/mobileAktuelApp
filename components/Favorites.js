import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import API_ENDPOINTS from '../config';
import { useFavorites } from '../FavoritesContext';

function Favorites({ navigation }) {
  const { idList } = useFavorites();
  const [brochures, setBrochures] = useState([]);
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const marksCacheUri = `${FileSystem.cacheDirectory}marks.json`;

  useEffect(() => {
    const fetchFavoriteBrochures = async () => {
      try {
        console.log("idList Değeri:", idList);

        const cachedBrochures = [];
        const idsToFetch = [];

        // Broşürleri cache kontrolü ile al
        for (const id of idList) {
          const cacheFileUri = `${FileSystem.cacheDirectory}summary_brochure_${id}.json`;
          const fileInfo = await FileSystem.getInfoAsync(cacheFileUri);

          if (fileInfo.exists) {
            const cachedData = await FileSystem.readAsStringAsync(cacheFileUri);
            const parsedData = JSON.parse(cachedData);
            cachedBrochures.push(parsedData);
          } else {
            idsToFetch.push(id);
          }
        }

        // Cache'te olmayan broşürleri API'den al
        if (idsToFetch.length > 0) {
          const response = await fetch(API_ENDPOINTS.getSummaryBrochureByIds(idsToFetch));
          if (!response.ok) throw new Error('API çağrısı başarısız.');
          const responseData = await response.json();

          for (const brochure of responseData) {
            const cacheFileUri = `${FileSystem.cacheDirectory}summary_brochure_${brochure.id}.json`;
            await FileSystem.writeAsStringAsync(cacheFileUri, JSON.stringify(brochure));
            cachedBrochures.push(brochure);
          }
        }

        setBrochures(cachedBrochures);
      } catch (error) {
        console.error('Favori broşürleri çekerken hata oluştu: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Cache'den markaları oku
    const fetchMarksFromCache = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(marksCacheUri);
        if (fileInfo.exists) {
          const cachedData = await FileSystem.readAsStringAsync(marksCacheUri);
          setMarks(JSON.parse(cachedData));
        }
      } catch (error) {
        console.error("Markalar cache'ten okunamadı:", error);
      }
    };

    fetchFavoriteBrochures();
    fetchMarksFromCache();
  }, [idList]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!brochures || brochures.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Henüz favorilere eklenmiş broşür bulunmuyor.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    // Broşürün markId'sine göre markayı bul
    const mark = marks.find((m) => m.id === item.markId);
    const markImage = mark ? mark.image : null;

    return (
      <TouchableOpacity
        style={styles.brochureItem}
        onPress={() => navigation.navigate('BrochureDetail', { id: item.id })}
      >
          <Image
            source={{ uri: `data:image/jpeg;base64,${markImage}` }}
            style={styles.brochureImage}
          />
        <Text style={styles.brochureTitle}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favori Broşürler</Text>
      <FlatList
        data={brochures}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brochureItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  brochureImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  brochureTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
