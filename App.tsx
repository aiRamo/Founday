import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Components/Home';
import Login from './Components/Login';
import LostReport from './Components/LostReport';
import Settings from './Components/Settings';
import FoundReport from './Components/FoundReport';
import SignUp from './Components/SignUp';
import ClaimsManagement from './Components/ClaimsManagement';
import MatchingResults from './Components/MatchingResults';
import PrivateMessage from './Components/PrivateMessage';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

 const App = () => {
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
          )
        })}
      />
      <Stack.Screen name="Lost Report" component={LostReport} options={{title: 'Lost Item Report'}}/>
      <Stack.Screen name="Found Report" component={FoundReport} options={{title: 'Found Item Report'}}/>
      <Stack.Screen name="Sign Up" component={SignUp} options={{headerShown: false}}/>
      <Stack.Screen name="User Settings" component={Settings} options={{title: 'Settings'}}/>
      <Stack.Screen name="Claims" component={ClaimsManagement} options={{title: 'Open Claims'}}/>
      <Stack.Screen name="Matches" component={MatchingResults} options={{title: 'Possible Matching Items'}}/>
      <Stack.Screen name="Private Message" component={PrivateMessage} options={{title: 'Username'}}/>
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
  }
});


export default App;