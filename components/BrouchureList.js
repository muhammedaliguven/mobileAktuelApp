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
import API_ENDPOINTS from '../config';


function BrochuresList({ navigation, route }) {
  const { markId, markImage } = route.params;

  const [brochures, setBrochures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.getBrochuresByMarkId(markId));
        const data = await response.json();
        setBrochures(data);
      } catch (error) {
        console.error("API'den broşür verisi çekme hatası: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrochures();
  }, [markId]);

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
        <Text style={styles.title}>Broşürler Bulunamadı</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Broşürler</Text>
      <FlatList
        data={brochures}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Her satırda 2 eleman
        columnWrapperStyle={styles.row} // Satır stili
      />
    </View>
  );
}

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
    elevation: 2, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  brochureImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain', // Resmin tam görünmesi için
    marginBottom: 10,
  },
  brochureTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BrochuresList;
