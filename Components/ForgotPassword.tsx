import React, { Component, Fragment, useState  } from 'react'
import { StyleSheet, TextInput, View, Dimensions, Text, Image, Alert, TouchableOpacity, Button} from 'react-native';
import { Divider, Header} from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { firebase } from './firebaseConfig';
import { getAuth, } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const auth = getAuth();

const ForgotPassword = ({navigation}) => {
    const [email, setEmail] = useState('');
    
    const sendEmail = async () => {
        if (email.length == 0) {
          alert('Please Enter Email.')
          return;
        } 

          try {
            firebase.auth().sendPasswordResetEmail(email)
            console.log('Password reset email sent successfully')
            navigation.navigate('Login')
          } catch (error) {
            alert(error)
          }
    
        
      }

    return (

      <SafeAreaProvider>
        <View style={styles.container}>

            <Divider inset={true} insetType="middle" style = {styles.divider} color={'#EFF1F8'}/>

            <Image 
                source = {require('../assets/FoundayLogo.png')}
                style={styles.logo}
            />

            <Text style={{marginBottom: 10, textAlign: 'left', fontSize: 17,}}>Forgot Password?</Text>
            <TextInput value={email} onChangeText={(text) => setEmail(text)} 
                placeholder='Enter email' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes}></TextInput>

            <TouchableOpacity onPress={sendEmail} style={styles.logInButton}>
                <View >
                    <Text style={styles.logInText}>Send Email</Text>
                </View>
            </TouchableOpacity>

        </View>
    </SafeAreaProvider>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF1F8',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    logo: {
      width: width * 0.8,
      height: height * 0.2,
      marginBottom: 100,
      marginTop: -25,
      marginLeft: 5,
      resizeMode: 'contain',
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
        bottom: '22.5%',
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

export default ForgotPassword;