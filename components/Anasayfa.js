import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

function Anasayfa({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMark, setSelectedMark] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBrochureLoading, setIsBrochureLoading] = useState(false);  // Broşürlerin yüklenme durumunu takip etmek için

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://192.168.1.74:8080/api/category/getAll');
      const data = await response.json();
      setCategories(data);
      setSelectedCategory(data[0]?.id); // İlk kategoriyi varsayılan olarak seçili yap
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

  const fetchBrochures = async (markId) => {
    setIsBrochureLoading(true);  // Broşürler yüklenmeye başlıyor
    try {
      const response = await fetch('http://192.168.1.74:8080/api/brochure/getAll');
      const data = await response.json();
      const filteredData = data.filter(brochure => brochure.markId === markId);
      setBrochures(filteredData);
    } catch (error) {
      console.error("Broşürleri çekerken hata: ", error);
    } finally {
      setIsBrochureLoading(false);  // Yükleme tamamlandığında, durumu değiştir
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
      setFilteredMarks(filtered); // Filtrelenmiş markaları ayrı bir durumda sakla
      setBrochures([]); // Kategori değiştiğinde broşür listesini sıfırla
      setSelectedMark(null); // Kategori değiştiğinde seçili markayı sıfırla
    }
  }, [selectedCategory, marks]);

  useEffect(() => {
    if (selectedMark) {
      fetchBrochures(selectedMark);
    }
  }, [selectedMark]);

  const handleMarkSelect = (markId) => {
    if (isBrochureLoading) {
      console.log("Broşürler henüz yüklenmedi. Lütfen bekleyin...");
      return; // Eğer broşürler yükleniyorsa, markayı değiştirmeyi engelle
    }

    console.log('Marka seçildi:', markId);
    if (selectedMark === markId) {
      fetchBrochures(markId);
    } else {
      setSelectedMark(markId);
      fetchBrochures(markId);
    }

    // Broşürleri logla ve navigasyona yönlendir
    console.log('Broşürler:', brochures);
    if (brochures.length > 0) {
      navigation.navigate('BrochuresList', { brochures });
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Kategoriler için yatay ScrollView */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={{
                  padding: 10,
                  backgroundColor: selectedCategory === category.id ? 'blue' : 'gray',
                  marginRight: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: 'white' }}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Seçili kategoriye ait markalar */}
          <ScrollView style={{ marginBottom: 16 }}>
            {filteredMarks.map((mark) => (
              <TouchableOpacity
                key={mark.id}
                onPress={() => handleMarkSelect(mark.id)}
                style={{
                  padding: 10,
                  backgroundColor: selectedMark === mark.id ? 'green' : 'lightgray',
                  marginBottom: 10,
                  borderRadius: 5,
                }}
              >
                <Text>{mark.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Broşürler yükleniyorsa gösterilecek spinner */}
          {isBrochureLoading && <ActivityIndicator size="large" color="#0000ff" />}
        </>
      )}
    </View>
  );
}

export default Anasayfa;
