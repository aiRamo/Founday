import React, { useState, useEffect } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import { firebase, auth, db } from './firebaseConfig'
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';

const RoomScreen = ({navigation}) => {

 // const [messages, setMessages] = useState([]);
   const [messages, setMessages] = useState([
    
    //Mock message data
    
    // example of system message
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true
    },
    // example of chat message
    {
      _id: 1,
      text: 'Henlo!',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Test User'
      }
    }
  ]); 

  // helper method that is sends a message
   function handleSend(newMessage = []) {
    setMessages(GiftedChat.append(messages, newMessage));
  } 



  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32}  /> 
          {/* color='#6646ee' */}
        </View>
      </Send>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage)} 
      user={{ _id: 1 }}
      alwaysShowSend
      scrollToBottom
      renderSend={renderSend}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default RoomScreen;