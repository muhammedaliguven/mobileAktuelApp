import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const exampleCategories = [
  { id: 1, name: 'Elektronik' },
  { id: 2, name: 'Giyim' },
  { id: 3, name: 'Ev & Yaşam' },
];

const exampleBrands = {
  1: [
    { id: 1, name: 'Teknosa' },
    { id: 2, name: 'MediaMarkt' },
  ],
  2: [
    { id: 3, name: 'LC Waikiki' },
    { id: 4, name: 'Mavi' },
  ],
  3: [
    { id: 5, name: 'IKEA' },
    { id: 6, name: 'Koçtaş' },
  ],
};

const exampleBrochures = {
  1: [
    { id: 1, title: 'Teknosa Kampanya' },
    { id: 2, title: 'Teknosa Kampanya2' },
  ],
  3: [
    { id: 3, title: 'LC Waikiki Kış Sezonu' },
    { id: 4, title: 'LC Waikiki Kış Sezonu2' },
  ],
  5: [
    { id: 5, title: 'IKEA Ev Dekorasyonu' },
    { id: 6, title: 'IKEA Ev Dekorasyonu2' },
  ],
};

function Anasayfa({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(exampleCategories[0].id); // Varsayılan kategori
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [brochures, setBrochures] = useState([]);

  // Seçili kategoriye göre markaları filtreleme
  useEffect(() => {
    setBrands(exampleBrands[selectedCategory] || []);
    setBrochures([]); // Kategori değişince broşür listesini sıfırla
    setSelectedBrand(null); // Kategori değişince seçili markayı sıfırla
  }, [selectedCategory]);

  // Seçili markaya göre broşürleri filtreleme
  useEffect(() => {
    if (selectedBrand !== null) {
      setBrochures(exampleBrochures[selectedBrand] || []);
    }
  }, [selectedBrand]);

  // Markaya tıklanınca BrochuresList'e yönlendir
  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId);
    navigation.navigate('BrochuresList', { brochures: exampleBrochures[brandId] });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Kategoriler için yatay ScrollView */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {exampleCategories.map((category) => (
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
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            onPress={() => handleBrandSelect(brand.id)} // Marka seçildiğinde BrochuresList'e yönlendir
            style={{
              padding: 10,
              backgroundColor: selectedBrand === brand.id ? 'green' : 'lightgray',
              marginBottom: 10,
              borderRadius: 5,
            }}
          >
            <Text>{brand.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default Anasayfa;
