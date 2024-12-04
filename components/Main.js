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

function Main({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.1.74:8080/api/category/getAll');
      const data = await response.json();
      setCategories(data);
      setSelectedCategory(data[0]?.id);
    } catch (error) {
      console.error("API'den kategori verisi çekme hatası: ", error);
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await fetch('http://192.168.1.74:8080/api/mark/getAll');
      const data = await response.json();
      setMarks(data);
    } catch (error) {
      console.error("API'den marka verisi çekme hatası: ", error);
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Kategoriler */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonSelected,
                  ]}
                >
                  <Image
                    source={{ uri: category.iconUrl }}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
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
    height: 90, // Sabit yükseklik
    marginBottom: 8,
    paddingVertical: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  categoryButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    borderRadius: 35,
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  categoryText: {
    color: '#212529',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: 'bold',
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
