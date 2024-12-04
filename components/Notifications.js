// components/SettingsScreen.js
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Notifications extends Component {
  state = {
    settings: 'Burada bildirimleri yönetebilirsiniz.',
  };

  render() {
    return (
      <View style={styles.screen}>
        <Text style={styles.text}>{this.state.settings}</Text>
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

export default Notifications;
