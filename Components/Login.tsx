import React, { Component, useState } from 'react';
import { ref, set, push } from 'firebase/database';
import { firebase } from './firebaseConfig';
import { StyleSheet, TextInput, View, Dimensions, Text, Button, SafeAreaView} from 'react-native';
import { Divider, Header} from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const db = firebase.database();
const auth = getAuth();

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    if (!email.endsWith("uta.edu")) {
      alert('Please use your UTA specific email.')
      return;
    } 
    else if (password.length == 0){
        alert('Please Enter Password.');
        return;
    }
    navigation.navigate('Home')
  }
  
  const redirectToSignUp = () => {
    navigation.navigate('Sign Up');
  }
  return (
    <SafeAreaProvider>
        <Header 
            centerComponent={{ text: 'Login', style: styles.headingText }}
            backgroundColor={'#687089'}/>

        <View style={styles.container}>

            <Divider inset={true} insetType="middle" style = {styles.divider} color={'#EFF1F8'}/>

            <TextInput value={email} onChangeText={(text) => setEmail(text)} 
                placeholder='Email' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes}></TextInput>

            <TextInput value={password} onChangeText={(text) => setPassword(text)} 
                placeholder='Password' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes} secureTextEntry={true}></TextInput>

            <TouchableOpacity onPress={loginUser} style={styles.logInButton}>
                <View >
                    <Text style={styles.logInText}>Login</Text>
                </View>
            </TouchableOpacity>

            <View style ={styles.signUpRedirect}>
                <Text style={styles.infoText}>Don't have an account?</Text>
                <Text style={styles.signUpButton} onPress={redirectToSignUp}>Sign Up</Text>
            </View>
        </View>
    </SafeAreaProvider>
    );
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#EFF1F8',
      alignItems: 'center',
      justifyContent: 'center',
      
  },
  textBoxes: {
      width: width * 0.9,
      fontSize: 18,
      padding: 12,
      borderColor: 'gray',
      borderWidth: 0.2,
      borderRadius: 5,
      backgroundColor: '#FFFFFF',
      marginBottom: 10,
  },
  logInButton: {
      width: width * 0.9,
      maxWidth: 600,
      height: height * 0.05,
      borderRadius: 15,
      backgroundColor: '#687089',
      borderColor: '#687089',
      color: '#ffffff',
      position: 'absolute',
      bottom: '12.5%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10
  },
  logInText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
  },
  divider: {
      width: width * 1,
      marginTop: -(height * 0.25)
  },
  headingText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
  },
  infoText: {
      color: '#9DA2B2',
      paddingRight: 15,
  },
  signUpRedirect: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: '8%',
  },
  signUpButton: {
      color: '#9DA2B2',
      paddingRight: 15,
      textDecorationLine: 'underline',
  }
  });

export default Login;
