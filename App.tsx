import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Components/Home';
import Login from './Components/Login';
import LostReport from './Components/LostReport';
import Settings from './Components/Settings';
import FoundReport from './Components/FoundReport';
import { SignInMethod } from 'firebase/auth';
import SignUp from './Components/SignUp';

const Stack = createNativeStackNavigator();

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
      <Stack.Screen name="Home" component={Home} options={{title: 'Homepage', headerBackVisible: false}}/>
      <Stack.Screen name="Lost Report" component={LostReport} options={{title: 'Lost Item Report'}}/>
      <Stack.Screen name="Found Report" component={FoundReport} options={{title: 'Found Item Report'}}/>
      <Stack.Screen name="Sign Up" component={SignUp} options={{headerShown: false}}/>
      <Stack.Screen name="User Settings" component={Settings} options={{title: 'Settings'}}/>
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
  }
});


export default App;