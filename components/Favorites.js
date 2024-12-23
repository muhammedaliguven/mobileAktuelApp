// components/MarketsScreen.js
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import API_ENDPOINTS from '../config';

class Favorites extends Component {
  state = {
    marks: [],
    isLoading: true,
  };

  fetchMarks = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getAllMarks);
      const data = await response.json();
      this.setState({ marks: data, isLoading: false });
    } catch (error) {
      console.error("API'den veri çekme hatası: ", error);
      this.setState({ isLoading: false });
    }
  };

  componentDidMount() {
    this.fetchMarks();
  }

  renderMarkCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.link}</Text>
      </View>
    );
  };

  render() {
    const { marks, isLoading } = this.state;

    return (
      <View style={styles.mainContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <FlatList
            data={marks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderMarkCard}
            contentContainerStyle={styles.listContainer}
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
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#aaaaaa',
    fontSize: 16,
  },
});

export default Favorites;
