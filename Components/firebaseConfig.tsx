import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDQqfRPGCpR0qpCOaloCD4eiFRCYybQr1I",
    authDomain: "typescriptexample-112dd.firebaseapp.com",
    databaseURL: "https://typescriptexample-112dd-default-rtdb.firebaseio.com",
    projectId: "typescriptexample-112dd",
    storageBucket: "typescriptexample-112dd.appspot.com",
    messagingSenderId: "959163838773",
    appId: "1:959163838773:web:44542cb26a7a680a859c7c",
    measurementId: "G-TDQ6FFB7VH"
  };

  firebase.initializeApp(firebaseConfig);

  export {firebase};