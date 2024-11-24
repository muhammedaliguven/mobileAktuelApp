import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';

function BrochuresList({ navigation, route }) {
  const { markId } = route.params;

  const [brochures, setBrochures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const response = await fetch(`http://192.168.1.74:8080/api/brochure/getByMarkId/${markId}`);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Broşürler</Text>
      <ScrollView>
        {brochures.map((brochure) => (
          <TouchableOpacity
            key={brochure.id}
            onPress={() => navigation.navigate('BrochureDetail', { id: brochure.id })}
            style={styles.brochureItem}
          >
            <Image source={{ uri: brochure.brochureImage }} style={styles.brochureImage} />
            <Text style={styles.brochureText}>{brochure.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  brochureItem: {
    padding: 10,
    backgroundColor: 'lightgray',
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brochureImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  brochureText: {
    fontSize: 16,
    color: '#333',
  },
});
export default BrochuresList;

