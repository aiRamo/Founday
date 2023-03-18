import React, { Component, useState } from 'react';
import { ref, set, get, push } from 'firebase/database';
import { firebase } from './firebaseConfig';
import { StyleSheet, TextInput, View, Dimensions, Text, Image} from 'react-native';
import { Divider, Header} from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import {getStorage, ref as storageReference, uploadBytes } from 'firebase/storage';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const { width, height } = Dimensions.get('window');
const db = firebase.database();
const auth = getAuth();
const storage = getStorage();




const SignUp = ({navigation}) =>  {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');

    const submitData = () => {
        const storageRef = storageReference(storage, 'child');
    
        uploadBytes(storageRef, image).then((snapshot) =>{
            alert('Uploaded file!')
        })
    }

    //createUser() checks fields for correctness then inserts the user's credentials into Firebase via push(ref(), {...})
    const createUser = async ({navigation}) => {

        if (!(firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0)){
            alert('Please fill out all boxes.');
            return;
        }
        else if (password != confirmPassword){
            alert('Password fields do not match.');
            return;
        } else {

            try {
                const {user} = await createUserWithEmailAndPassword(auth, email, password);
                const uid = user.uid;
                const path = 'users/' + uid;

                const userObject = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                };

                const userSnapshot = await get(ref(db, path));
                    if (!userSnapshot.exists()) {
                        await set(ref(db, path), userObject);
                    }

                // Create subdirectories for lost and found items
                const lostItemsPath = 'LostItems/';
                const foundItemsPath ='FoundItems/';

                const lostItemsRef = db.ref(lostItemsPath);

                const foundItemsRef = db.ref(foundItemsPath);

                await Promise.all([
                    lostItemsRef.push().set({
                        itemName: 'Necklace',
                        category: 'Apparel',
                        description: 'Gold necklace with diamond pendant',
                        date: new Date().toISOString(),
                        author: uid,
                        image: 'uriExample1.jpg',
                    }),
                    lostItemsRef.push().set({
                        itemName: 'Dell Laptop',
                        category: 'Electronics',
                        description: 'Dell XPS 15 laptop with black case',
                        date: new Date().toISOString(),
                        author: uid,
                        image: 'N/A',
                    }),
                    foundItemsRef.push().set({
                        itemName: 'Airpods',
                        category: 'Electronics',
                        description: 'Airpods with custom evelyn inscription',
                        date: new Date().toISOString(),
                        author: uid,
                        image: 'uriExample3.jpg',
                    }),
                    foundItemsRef.push().set({
                        itemName: 'Samsung Phone',
                        category: 'Electronics',
                        description: 'Samsung Galaxy S21 with cracked screen',
                        date: new Date().toISOString(),
                        author: uid,
                        image: 'uriExample4.jpg',
                    })
                    
                ])
                .catch(error => {
                    // handle the error
                    console.error(error);
                });

                if (!user.emailVerified) {
                    firebase.auth().onAuthStateChanged(function(user) {
                        if (user) {
                            user.sendEmailVerification(); 
                        }
                      });

                alert('Verification email sent.'); 
                
                }
                navigation.navigate('Login');
                
            } catch (error) {
                alert(error)
                return;
            }
        }
        return
  };


    return (
    <SafeAreaProvider>
        <Header 
            centerComponent={{ text: 'Sign Up', style: styles.headingText }}
            backgroundColor={'#687089'}
            />
            

        <View style={styles.container}>

            <Divider inset={true} insetType="middle" style = {styles.divider} color={'#EFF1F8'}/>

            <TextInput value={firstName} onChangeText={(text) => setFirstName(text)} 
                placeholder='First Name' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes } ></TextInput>

            <TextInput value={lastName} onChangeText={(text) => setLastName(text)} 
                placeholder='Last Name' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes}></TextInput>
                
            <TextInput value={email} onChangeText={(text) => setEmail(text)} 
                placeholder='Email' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes}></TextInput>

            <TextInput value={password} onChangeText={(text) => setPassword(text)} 
                placeholder='Password' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes} secureTextEntry={true}></TextInput>

            <TextInput value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} 
                placeholder='Confirm Password' placeholderTextColor={'#9DA2B2'} style={styles.textBoxes} secureTextEntry={true}></TextInput>

            <TouchableOpacity onPress={ () => {createUser({navigation});}} style={styles.signUpButton}>
                <View >
                    <Text style={styles.signUpText}>Sign Up</Text>
                </View>
            </TouchableOpacity>

            <View style ={styles.signInRedirect}>
                <Text style={styles.infoText}>Already have an account?</Text>
                <Text style={styles.signInButton} onPress={() => navigation.navigate('Login')}>Sign In</Text>
            </View>
        </View>
    </SafeAreaProvider>
    );
}

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

export default SignUp;