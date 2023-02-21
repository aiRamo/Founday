import React, { Component } from 'react';
import { ref, set, push } from 'firebase/database';
import { firebase } from './firebaseConfig';
import { StyleSheet, TextInput, View, Dimensions, Text, Button} from 'react-native';
import { Divider, Header} from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const db = firebase.database();
const auth = getAuth();

interface MyComponentProps {}

interface MyComponentStates {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  email: string
}

class SignUp extends Component<MyComponentProps, MyComponentStates> {
  constructor(props: MyComponentProps) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      email: ''
    };
  }

  //createUser() checks fields for correctness then inserts the user's credentials into Firebase via push(ref(), {...})
  createUser = async () => {
    const path = 'users/';

    if (!(this.state.firstName.length > 0 && this.state.lastName.length > 0 && this.state.email.length > 0 && this.state.password.length > 0)){
        alert('Please fill out all boxes.');
        return;
    }
    else if (!this.state.email.endsWith("uta.edu")) {
        alert('please use a UTA specific email.')
        return;
    } 
    else if (this.state.password != this.state.confirmPassword){
        alert('Password fields do not match.');
        return;
    } else {

        try {
            const {user} = await createUserWithEmailAndPassword(auth, this.state.email, this.state.password);
            const uid = user.uid;
            const path = 'users/' + uid;

            const userObject = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.password
            };

            if (!user.emailVerified) {
            await sendEmailVerification(user, { url: 'https://typescriptexample-112dd.web.app' });
            alert('Verification email sent.');
            }

            await set(ref(db, path), userObject);
          } catch (error) {
            alert(error)
            return;
          }
    }

  };

  redirectToSignIn = () => {
    alert('WIP, will redirect to sign in page.');
  }

  render() {
    const { firstName } = this.state;

    return (
    <SafeAreaProvider>
        <Header 
            centerComponent={{ text: 'Sign Up', style: this.styles.headingText }}
            backgroundColor={'#687089'}/>

        <View style={this.styles.container}>

            <Divider inset={true} insetType="middle" style = {this.styles.divider} color={'#EFF1F8'}/>

            <TextInput value={this.state.firstName} onChangeText={(text) => this.setState({ firstName: text })} 
                placeholder='First Name' placeholderTextColor={'#9DA2B2'} style={this.styles.textBoxes } ></TextInput>

            <TextInput value={this.state.lastName} onChangeText={(text) => this.setState({ lastName: text })} 
                placeholder='Last Name' placeholderTextColor={'#9DA2B2'} style={this.styles.textBoxes}></TextInput>
                
            <TextInput value={this.state.email} onChangeText={(text) => this.setState({ email: text })} 
                placeholder='Email' placeholderTextColor={'#9DA2B2'} style={this.styles.textBoxes}></TextInput>

            <TextInput value={this.state.password} onChangeText={(text) => this.setState({ password: text })} 
                placeholder='Password' placeholderTextColor={'#9DA2B2'} style={this.styles.textBoxes} secureTextEntry={true}></TextInput>

            <TextInput value={this.state.confirmPassword} onChangeText={(text) => this.setState({ confirmPassword: text })} 
                placeholder='Confirm Password' placeholderTextColor={'#9DA2B2'} style={this.styles.textBoxes} secureTextEntry={true}></TextInput>

            <TouchableOpacity onPress={this.createUser} style={this.styles.signUpButton}>
                <View >
                    <Text style={this.styles.signUpText}>Sign Up</Text>
                </View>
            </TouchableOpacity>

            <View style ={this.styles.signInRedirect}>
                <Text style={this.styles.infoText}>Already have an account?</Text>
                <Text style={this.styles.signInButton} onPress={this.redirectToSignIn}>Sign In</Text>
            </View>
        </View>
    </SafeAreaProvider>
    
    );
  }

  styles = StyleSheet.create({
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
    signUpButton: {
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
    signUpText: {
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
    signInRedirect: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: '8%',
    },
    signInButton: {
        color: '#9DA2B2',
        paddingRight: 15,
        textDecorationLine: 'underline',
    }
  });
}

export default SignUp;