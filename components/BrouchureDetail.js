import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import API_ENDPOINTS from '../config';

function BrochureDetail({ route }) {
  const { id } = route.params;

  const [pdfUri, setPdfUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSavePdf = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.getBrochureById(id));
        if (!response.ok) {
          throw new Error('PDF verisi alınamadı');
        }
        const data = await response.json();

        if (data.pdfData) {
          const localUri = `${FileSystem.cacheDirectory}brochure_${id}.pdf`;
          await FileSystem.writeAsStringAsync(localUri, data.pdfData, { encoding: FileSystem.EncodingType.Base64 });
          setPdfUri(localUri);
        } else {
          throw new Error('PDF verisi mevcut değil');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSavePdf();
  }, [id]);

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

  if (!pdfUri) {
    return (
      <View style={styles.container}>
        <Text>PDF bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']} // File URI'lere izin ver
        source={{ uri: pdfUri }}
        style={styles.webView}
        onError={(error) => {
          Alert.alert('Hata', 'PDF görüntülenemedi');
          console.error(error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default BrochureDetail;
