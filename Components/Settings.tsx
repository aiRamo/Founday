import React, {useState, useEffect} from 'react';
import { StyleSheet, Dimensions, View, Image, Text, TouchableOpacity, Alert, TextInput} from 'react-native';
import { firebase } from './firebaseConfig';
import {get ,ref, onValue} from 'firebase/database';

const { width, height } = Dimensions.get('window');

const db = firebase.database()

const Settings = ({navigation}) => {

  const user = firebase.auth().currentUser;
  

  const [currentFields, setCurrentFields] = useState({
    firstName: 'Name',
    lastName: 'Name',
    Email: 'Email',
  });

  useEffect(() => {
    if (user){
      const uid = user.uid;
      const userPath = 'users/' + uid;
      const userRef = ref(db, userPath);

      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          const { firstName, lastName, email } = userData;
          setCurrentFields({
            firstName: firstName || 'Name',
            lastName: lastName || 'Name',
            Email: email || 'Email',
          });
        }
      });
    }
  }, []);

  const [currentStep, setCurrentStep] = useState('enterPassword');

  const handlePasswordChange = () => {
    if (currentStep === 'enterPassword') {
      // Step 1: Prompt user to enter their password
      Alert.prompt('Enter your current password:', "", (password) => {
        // Step 2: Verify user's password
        const credential = firebase.auth.EmailAuthProvider.credential(
          firebase.auth().currentUser.email, password
        );
        firebase.auth().currentUser?.reauthenticateWithCredential(credential)
          .then(() => {
            // Step 3: Prompt user to enter a new password
            Alert.prompt('Enter a new password', "", (newPassword) => {
              // Step 4: Confirm the new password
              Alert.prompt('Confirm new password', "", (confirmPassword) => {
                if (newPassword === confirmPassword) {
                  // Step 5: Update user's password
                  firebase.auth().currentUser?.updatePassword(newPassword)
                    .then(() => {
                      Alert.alert('Password changed successfully');
                      setCurrentStep('enterPassword');
                    })
                    .catch((error) => {
                      Alert.alert('Error updating password: ' + error.message);
                    });
                } else {
                  Alert.alert('Passwords do not match');
                }
              });
            });
          })
          .catch((error) => {
            Alert.alert('Incorrect password: ' + error.message);
          });
      });
    } 
  }

  //handleLogout() uses navigation.reset() to remove all prior pages from the stack and restart it on the Login screen.

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  return (
    <View style={styles.container}>
      <View style = {styles.profileIconBackground}>
        <Image source = {require('../assets/defaultProfile.png')} style = {styles.img}/>
      </View>

      <View style = {styles.headerBar}>
        <Text style = {styles.headerText}>PROFILE</Text>
      </View>

      <View style = {styles.fieldBar}>
        <Text style = {styles.fieldText}>First name</Text>
        <TextInput
          style={styles.inputField}
          value={currentFields.firstName}
          onChangeText={(text) =>
            setCurrentFields((prevFields) => ({
              ...prevFields,
              firstName: text,
            }))
          }
        />
      </View>
      <View style = {styles.fieldBar}>
        <Text style = {styles.fieldText}>Last name</Text>
        <TextInput
          style={styles.inputField}
          value={currentFields.lastName}
          onChangeText={(text) =>
            setCurrentFields((prevFields) => ({
              ...prevFields,
              lastName: text,
            }))
          }
        />
      </View>
      <View style = {styles.fieldBar}>
        <Text style = {styles.fieldText}>Email</Text>
        <TextInput
          style={styles.inputField}
          value={currentFields.Email}
          onChangeText={(text) =>
            setCurrentFields((prevFields) => ({
              ...prevFields,
              Email: text,
            }))
          }
        />
      </View>

      <View style = {styles.profileButtonRow}>
        <TouchableOpacity style = {styles.updateButton}>
          <Text style = {{color: '#fff', fontWeight: '500'}}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      <View style = {styles.headerBar}>
        <Text style = {styles.headerText}>ACCOUNT</Text>
      </View>

      <TouchableOpacity style = {styles.fieldBar} onPress = {handlePasswordChange}>
        <Text style = {styles.fieldText}>Change password</Text>
      </TouchableOpacity>
      <TouchableOpacity style = {styles.fieldBar} onPress = {handleLogout}>
        <Text style = {styles.logOutText}>Log out</Text>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#EFF1F8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: height,
  },
  profileIconBackground: {
    width : width,
    backgroundColor: '#687089',
    paddingVertical: height * 0.025,
    alignItems: 'center',
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  headerBar: {
    backgroundColor: '#EFF1F8',
    width: width,
    height: height * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    paddingStart: 15,
    fontWeight: '600',
    color: 'gray'
  },
  fieldBar: {
    backgroundColor: '#fff',
    width: width,
    height: height * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#EFF1F8',
    borderBottomWidth: 1,
  },
  fieldText: {
    paddingStart: 15,
    fontWeight: '500',
    fontSize: 16,
  },
  logOutText: {
    paddingStart: 15,
    fontWeight: '500',
    fontSize: 16,
    color: 'red',
  },
  currentFieldText: {
    paddingStart: 15,
    fontWeight: '500',
    fontSize: 14,
    marginEnd: 15,
    color: 'gray',
  },
  updateButton: {
    backgroundColor: '#687089',
    width: width * 0.3,
    height: height * 0.05,
    maxWidth: 600,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  profileButtonRow: {
    backgroundColor: '#EFF1F8',
    width: width,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    marginEnd: 15,
    fontWeight: '500',
    color: 'gray',
    width: width * 0.7,
    height: height * 0.07,
    borderLeftWidth: 1,
    borderLeftColor: '#EFF1F8',
    paddingLeft: 15,
  }
  
});


export default Settings;