import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

function BrochureDetail({ route }) {
  const { id } = route.params;

  const [brochure, setBrochure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API çağrısı yapılıyor
  useEffect(() => {
    const fetchBrochure = async () => {
      try {
        console.log("burda");
        const response = await fetch(`http://192.168.1.74:8080/api/brochure/getById/${id}`);
        if (!response.ok) {
          throw new Error('Veri alınamadı');
        }
        const data = await response.json();
        setBrochure(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrochure();
  }, [id]);

  const openPdf = async () => {
    if (brochure && brochure.pdfUrl) {
      await WebBrowser.openBrowserAsync(brochure.pdfUrl);
    }
  };

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

  if (!brochure) {
    return (
      <View style={styles.container}>
        <Text>Broşür bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{brochure.description || 'Broşür Başlığı'}</Text>
      <Button title="PDF'yi Görüntüle" onPress={openPdf} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default BrochureDetail;
