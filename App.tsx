import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, Dimensions, Image, View } from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Components/Home';
import Login from './Components/Login';
import Settings from './Components/Settings';
import FoundUploadScreen from './Components/FoundReport';
import SignUp from './Components/SignUp';
import ForgotPassword from './Components/ForgotPassword';
import ClaimsManagement from './Components/ClaimsManagement';
import MatchingResults from './Components/MatchingResults';
import PrivateMessage from './Components/PrivateMessage';
import ChatScreen from './Components/ChatScreen'
import LostUploadScreen from './Components/LostReport';
import { firebase } from './Components/firebaseConfig';
import {ref, onValue} from 'firebase/database';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

const db = firebase.database()

const App = () => {

  const user = firebase.auth().currentUser;
  

  const [displayName, setDisplayName] = React.useState('name');

  React.useEffect(() => {
    if (user){
      const uid = user.uid;
      const userPath = 'users/' + uid;
      const userRef = ref(db, userPath);

      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          const {firstName} = userData;
          setDisplayName(firstName);
        }
      });
    }
  }, []);

  return (
    <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#fff'
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Login',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText}}
      />
      <Stack.Screen name="Home" component={Home} 
        options={({navigation}) => ({
          title: 'Homepage', 
          headerBackVisible: false, 
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('User Settings')} style = {styles.settingsClickOpacity}>
              <Image
                source={require('./assets/SettingsWheel.png')}
                style={styles.settingsIcon}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => { // Profile Icon loaded here!
            return (
              /*<View style={styles.profile}>
                <Image
                  source={require('./assets/defaultProfile.png')}
                  style={styles.profileIcon}
                />
                <Text style = {styles.profileText}>
                  {displayName}
                </Text>
            </View>*/
            true
            );
          }
        })}
      />
      <Stack.Screen name="Lost Report" component={LostUploadScreen} options={{title: 'Lost Item Report'}}/>
      <Stack.Screen name="Found Report" component={FoundUploadScreen} options={{title: 'Found Item Report'}}/>
      <Stack.Screen name="Sign Up" component={SignUp} options={{headerShown: false}}/>
      <Stack.Screen name="Forgot Password" component={ForgotPassword} options={{title: 'Reset Password'}}/>
      <Stack.Screen name="User Settings" component={Settings} options={{title: 'Settings'}}/>
      <Stack.Screen name="Claims" component={ClaimsManagement} options={{title: 'Open Claims'}}/>
      <Stack.Screen name="Matches" component={MatchingResults} options={{title: 'Possible Matching Items'}}/>
      <Stack.Screen name="Private Message" component={PrivateMessage} options={{title: 'Private Message'}}/>
      <Stack.Screen name="Chat Room" component={ChatScreen} options={{title: 'chat room'}}/>
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: "#687089",
  },
  headerText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  settingsClickOpacity : {
  },
  settingsIcon : {
    width: height * 0.03, 
    maxWidth: 100,
    height: height * 0.03, 
    resizeMode: 'contain',
    marginRight: width * 0.005,
  },
  profileIcon: {
    width: height * 0.03, 
    maxWidth: 100,
    height: height * 0.03, 
    resizeMode: 'contain',
  },
  profile: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileText: {
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginLeft: 4,
  }
});


export default App;