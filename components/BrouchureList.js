import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

function BrochuresList({ route, navigation }) {
  const { brochures } = route.params;

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
            <Text>{brochure.brochureImage}</Text>
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
  },
});

export default BrochuresList;
