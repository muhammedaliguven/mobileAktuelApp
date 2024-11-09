import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const exampleBrochures = {
  1: [
    { id: 1, title: 'Teknosa Kampanya', pdfUrl: 'https://www.example.com/teknosa_kampanya.pdf' },
    { id: 2, title: 'MediaMarkt İndirim', pdfUrl: 'https://www.example.com/mediamarkt_indirim.pdf' },
  ],
  2: [
    { id: 3, title: 'LC Waikiki Kış Sezonu', pdfUrl: 'https://www.example.com/lcwaikiki_kis_sezonu.pdf' },
    { id: 4, title: 'Mavi Yaz Sezonu', pdfUrl: 'https://www.example.com/mavi_yaz_sezonu.pdf' },
  ],
  3: [
    { id: 5, title: 'IKEA Ev Dekorasyonu', pdfUrl: 'https://www.example.com/ikea_ev_dekorasyonu.pdf' },
    { id: 6, title: 'Koçtaş Bahçe Ürünleri', pdfUrl: 'https://www.example.com/kocatas_bahce_urunleri.pdf' },
  ],
};

function BrochuresList({ route, navigation }) {
  const { selectedBrand } = route.params; // Seçili marka parametresini alıyoruz
  const [brochures, setBrochures] = useState([]);

  useEffect(() => {
    // Seçili markaya ait broşürleri alıyoruz
    setBrochures(exampleBrochures[selectedBrand] || []);
  }, [selectedBrand]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Seçili Markaya Ait Broşürler</Text>

      <ScrollView>
        {brochures.map((brochure) => (
          <TouchableOpacity
            key={brochure.id}
            onPress={() => navigation.navigate('BrochureDetail', { id: brochure.id, pdfUrl: brochure.pdfUrl })}
            style={styles.brochureItem}
          >
            <Text>{brochure.title}</Text>
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
  },
  header: {
    fontSize: 18,
    marginBottom: 16,
  },
  brochureItem: {
    padding: 10,
    backgroundColor: 'orange',
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default BrochuresList;
