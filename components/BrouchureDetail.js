import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

function BrochureDetail({ route }) {
  const { id } = route.params;

  // Broşür verisini ID'ye göre alıyoruz
  const brochureData = {
    1: { title: 'Teknosa Kampanya', pdfUrl: 'https://www.example.com/teknosa_kampanya.pdf' },
    2: { title: 'MediaMarkt İndirim', pdfUrl: 'https://www.example.com/mediamarkt_indirim.pdf' },
    // Diğer broşürler için URL'ler ekleyebilirsiniz
  };

  const brochure = brochureData[id];

  if (!brochure) {
    return (
      <View style={styles.container}>
        <Text>Broşür bulunamadı.</Text>
      </View>
    );
  }

  // PDF'yi tarayıcıda açmak için WebBrowser kullanıyoruz
  const openPdf = async () => {
    await WebBrowser.openBrowserAsync(brochure.pdfUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{brochure.title}</Text>
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
