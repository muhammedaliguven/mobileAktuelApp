import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, StyleSheet, Image } from 'react-native';

function Anasayfa({ navigation }) {
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

  const handleMarkSelect = (markId) => {
    navigation.navigate('BrochuresList', { markId }); // Mark ID'yi gönder
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Kategoriler */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
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

          {/* Dinamik Başlık */}
          <Text style={styles.sectionTitle}>
            {categories.find(cat => cat.id === selectedCategory)?.name || 'Seçili Kategori'}
          </Text>

          {/* Markalar */}
          <ScrollView contentContainerStyle={styles.marksContainer}>
            {filteredMarks.map((mark) => (
              <TouchableOpacity
                key={mark.id}
                onPress={() => handleMarkSelect(mark.id)} // Mark ID'yi gönder
                style={styles.markCard}
              >
                <Image
                  source={{ uri: mark.logoUrl }}
                  style={styles.markLogo}
                />
                <Text style={styles.markText}>{mark.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

export default Anasayfa;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  categoriesScroll: {
    marginBottom: 16,
    paddingVertical: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  categoryButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    borderRadius: 40,
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  categoryText: {
    color: '#212529',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
  },
  marksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  markCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  markLogo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  markText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#212529',
  },
});
