import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ref, set } from 'firebase/database';
import { db } from './Components/firebaseConfig';

export default function App() {

  const [username, setName] = useState('');
  const [email, setEmail] =  useState('');

  function create () {

    set(ref(db, 'users/' + username), {
      username: username,
      email: email
    }).then(() => {
      alert('data uploaded')
    })
      .catch((error) => {
        alert(error)
      });

  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start workidng on your app!</Text>
      <TextInput value={username} onChangeText={(username) => {setName(username)}} placeholder='Username' style={styles.textBoxes}></TextInput>
      <TextInput value={email} onChangeText={(email) => {setEmail(email)}} placeholder='Email' style={styles.textBoxes}></TextInput>
      <button onClick={create}>Submit Data</button>
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
  textBoxes: {
    width: '90%',
    fontSize: 18,
    padding: 12,
    borderColor: 'gray',
    borderWidth: 0.2,
    borderRadius: 15
  }
});
