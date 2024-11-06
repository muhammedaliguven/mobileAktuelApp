// components/MarketsScreen.js
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class MarketsScreen extends Component {
  state = {
    marketList: ['Market 1', 'Market 2', 'Market 3'],
  };

  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.text}>Marketler:</Text>
        {this.state.marketList.map((market, index) => (
          <Text key={index} style={styles.text}>{market}</Text>
        ))}
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

export default MarketsScreen;
