import React, {useEffect, useCallback, useLayoutEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { firebase, auth, db } from './firebaseConfig'
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';

 const PrivateMessage = ({navigation}) => {
  const [messages, setMessages] = useState([]);

  // here
  useLayoutEffect(() => {

    const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
    /* const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
        snapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
        }))
    )); */

    return () => {
      // unsubscribe();
    };

}, [navigation]);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const { _id, createdAt, text, user,} = messages[0]

    addDoc(collection(db, 'chats'), { _id, createdAt,  text, user });
}, []);
// here

  return (
    <View >
        
              <Card style={styles.card}>
                  <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                  <Card.Content>
                    <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold',}} >Apple earpods</Text>
                    <Text style={{fontSize: 13, color: 'gray',}} >1 hour ago</Text>
                  </Card.Content>
              </Card>
        

        {/* <GiftedChat 
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={messages => onSend(messages)}
           user={{
              _id: auth?.currentUser?.email,
              name: auth?.currentUser?.displayName,
              avatar: auth?.currentUser?.photoURL
          }}  
        /> */}

        <IconButton
          icon='message-plus'
          size={28}
          //color='#fffff'
          onPress={() => navigation.navigate('Chat Room')}
        />

    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vertical: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  card: {
    marginTop: 15,
  },

});


export default PrivateMessage;