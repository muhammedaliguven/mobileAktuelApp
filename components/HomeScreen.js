// components/HomeScreen.js
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

class HomeScreen extends Component {
  state = {
    message: "Ana Sayfa'ya hoş geldiniz!",
  };

  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.text}>{this.state.message}</Text>
        <Button title="Mesajı Değiştir" onPress={() => this.setState({ message: "Mesaj değiştirildi!" })} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;
