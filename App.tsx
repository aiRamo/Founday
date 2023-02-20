import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import SignUp from './Components/SignUp'
import { Divider } from '@rneui/themed';

export default function App() {

  return (
    <View style={styles.container}>
      <SignUp/> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
