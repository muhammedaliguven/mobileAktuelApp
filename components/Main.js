import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import API_ENDPOINTS from '../config';

function Main({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat
  const categoriesCacheUri = `${FileSystem.cacheDirectory}categories.json`;
  const marksCacheUri = `${FileSystem.cacheDirectory}marks.json`;

  const fetchCategories = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(categoriesCacheUri);

      if (fileInfo.exists && new Date().getTime() - fileInfo.modificationTime * 1000 < CACHE_DURATION) {
        const cachedData = await FileSystem.readAsStringAsync(categoriesCacheUri);
        const parsedData = JSON.parse(cachedData);
        setCategories(parsedData);
        setSelectedCategory(parsedData[0]?.id);
      } else {
        const response = await fetch(API_ENDPOINTS.getAllCategories);
        const data = await response.json();
        await FileSystem.writeAsStringAsync(categoriesCacheUri, JSON.stringify(data));
        setCategories(data);
        setSelectedCategory(data[0]?.id);
      }
    } catch (error) {
      console.error("Kategoriler API veya cache hatası: ", error);
    }
  };

  const fetchMarks = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(marksCacheUri);

      if (fileInfo.exists && new Date().getTime() - fileInfo.modificationTime * 1000 < CACHE_DURATION) {
        const cachedData = await FileSystem.readAsStringAsync(marksCacheUri);
        setMarks(JSON.parse(cachedData));
      } else {
        const response = await fetch(API_ENDPOINTS.getAllMarks);
        const data = await response.json();
        await FileSystem.writeAsStringAsync(marksCacheUri, JSON.stringify(data));
        setMarks(data);
      }
    } catch (error) {
      console.error("Markalar API veya cache hatası: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchMarks();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = marks.filter((mark) => mark.categoryId === selectedCategory);
      setFilteredMarks(filtered);
    }
  }, [selectedCategory, marks]);

  const handleMarkSelect = (markId, markImage) => {
    navigation.navigate('BrochuresList', { markId, markImage });
  };

  const renderMark = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleMarkSelect(item.id, item.image)}
      style={styles.markCard}
    >
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        style={styles.markLogo}
      />
      <Text style={styles.markText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category) => (
    <View key={category.id} style={styles.categoryItem}>
      <TouchableOpacity
        onPress={() => setSelectedCategory(category.id)}
        style={[
          styles.categoryButton,
          selectedCategory === category.id && styles.categoryButtonSelected,
        ]}
      >
        <Image
          source={{ uri: `data:image/jpeg;base64,${category.image}` }}
          style={styles.categoryButton}
        />
      </TouchableOpacity>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryText}>{category.name}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Kategoriler */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => renderCategoryButton(category))}
            </ScrollView>
          </View>

          {/* Dinamik Başlık */}
          <Text style={styles.sectionTitle}>
            {categories.find((cat) => cat.id === selectedCategory)?.name || 'Seçili Kategori'}
          </Text>

          {/* Markalar */}
          <FlatList
            data={filteredMarks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMark}
            numColumns={2}
            contentContainerStyle={styles.marksContainer}
            columnWrapperStyle={styles.columnWrapper}
          />
        </>
      )}
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
  },
  categoriesContainer: {
    height: 140, // Kategoriler konteynerinin yüksekliği
    marginBottom: 8,
    paddingVertical: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  categoryItem: {
    alignItems: 'center', // Kategori öğesi yatayda ortalanır
    marginRight: 12, // Kategoriler arası boşluk
  },
  categoryButton: {
    width: 80, // Buton genişliği
    height: 80, // Buton yüksekliği
    backgroundColor: '#e0e0e0',
    borderRadius: 40, // Yuvarlak buton
    justifyContent: 'center', // İçerik dikeyde ortalanır
    alignItems: 'center', // İçerik yatayda ortalanır
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff', // Seçili buton rengi
  },
  categoryContent: {
    marginTop: 8, // Buton ile metin arasındaki boşluk
  },
  categoryText: {
    color: '#212529',
    fontSize: 12, // Metin boyutu
    textAlign: 'center', // Metin yatayda ortalanır
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  marksContainer: {
    paddingBottom: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  markCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  markLogo: {
    width: 70,
    height: 70,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  markText: { 
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: '#212529',
  },
});