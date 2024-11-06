// components/CategoriesScreen.js
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

class CategoriesScreen extends Component {
  state = {
    categories: [],
    isLoading: true,
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.1.74:8080/api/category/getAll');
      console.log(response);
      const data = await response.json();
      this.setState({ categories: data, isLoading: false });
    } catch (error) {
      console.error("API'den veri çekme hatası: ", error);
      this.setState({ isLoading: false });
    }
  };

  renderCategoryItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.link }} style={styles.image} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </View>
  );

  render() {
    const { categories, isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={categories}
        renderItem={this.renderCategoryItem}
        keyExtractor={item => item.id.toString()} // id değerini anahtar olarak kullan
        contentContainerStyle={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Yatay hizalama
    paddingVertical: 10, // Dikey boşluk
    alignItems: 'center', // Dikeyde ortala
  },
  card: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    marginHorizontal: 10, // Yatay boşluk
    padding: 15,
    width: 120, // Kart genişliği
    alignItems: 'center',
  },
  image: {
    width: 80, // Resim genişliği
    height: 80, // Resim yüksekliği
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
});
export default CategoriesScreen;
