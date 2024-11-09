import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

class CategoriesScreen extends Component {
  state = {
    categories: [],
    brochures: [], // Broşür verilerini saklayacak dizi
    filteredBrochures: [], // Filtrelenmiş broşürleri saklayacak dizi
    isLoading: true,
    selectedCategoryId: null, // Seçilen kategorinin id'sini saklayacak
  };

  componentDidMount() {
    this.fetchCategories();
    this.fetchBrochures(); // Broşürleri de başlatma sırasında çek
  }

  fetchCategories = async () => {
    try {
      const response = await fetch('http://172.20.10.8:8080/api/category/getAll');
      const data = await response.json();
      this.setState({ categories: data, isLoading: false });
    } catch (error) {
      console.error("API'den veri çekme hatası: ", error);
      this.setState({ isLoading: false });
    }
  };

  fetchBrochures = async () => {
    try {
      const response = await fetch('http://172.20.10.8:8080/api/brochure/getAll');
      const data = await response.json();
      this.setState({ brochures: data });
    } catch (error) {
      console.error("Broşürleri çekerken hata: ", error);
    }
  };

  handleCategoryPress = (categoryId) => {
    // Seçilen kategoriye ait broşürleri filtrele
    const filtered = this.state.brochures.filter(
      (brochure) => brochure.categoryId === categoryId
    );
    this.setState({ selectedCategoryId: categoryId, filteredBrochures: filtered });
  };

  renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => this.handleCategoryPress(item.id)}
    >
      <Image source={{ uri: item.link }} style={styles.image} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  renderBrochureItem = ({ item }) => (
    <View style={styles.brochureCard}>
      <Image source={{ uri: item.brochureImage }} style={styles.brochureImage} />
      <Text style={styles.brochureName}>{item.name}</Text>
    </View>
  );

  render() {
    const { categories, isLoading, filteredBrochures, selectedCategoryId } = this.state;

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      );
    }

    return (
      <View style={styles.mainContainer}>
        {/* Kategoriler */}
        <FlatList
          data={categories}
          renderItem={this.renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.container}
          horizontal
        />

        {/* Seçilen Kategoriye Ait Broşürler */}
        {selectedCategoryId && (
          <FlatList
            data={filteredBrochures}
            renderItem={this.renderBrochureItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.brochureContainer}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 15,
    width: 120,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryName: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  brochureContainer: {
    paddingVertical: 20,
  },
  brochureCard: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    alignItems: 'center',
  },
  brochureImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  brochureName: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CategoriesScreen;
