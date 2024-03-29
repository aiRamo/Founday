import { firebase, auth, firestore } from './firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, limit, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

interface Message {
  _id: string;
  createdAt: any;
  text: any;
  user: any;
}
const RoomScreen = ({ navigation, route }: { navigation: any, route: any }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { recipientUser, firstMessage, chatObject } = route.params;
  const currentUserId = auth.currentUser?.uid;

  console.log("recipientUser:", recipientUser);

  let chatRoom: string

  if (recipientUser.includes('_')) {
    chatRoom = `chats/${recipientUser}/messages`;
  } else {
    chatRoom = `chats/${recipientUser}_${currentUserId}/messages`;
  }

  console.log("FIRST MESSAGE: " + firstMessage)

  useLayoutEffect(() => {
    const collectionRef = collection(firestore, chatRoom);
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      console.log('snapshot');
      setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      )
    })

    if (firstMessage) {
      const newMessage = [{      
        _id: Date.now().toString(),      
        text: firstMessage,      
        createdAt: new Date(),      
        user: {        
          _id: auth.currentUser?.email ?? '',        
          name: auth.currentUser?.displayName ?? ''      
        }    
      }];
      onSend(newMessage);
    }
    return () => unsubscribe();
  }, []);
  

  const onSend = useCallback((messages: Message[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(firestore, chatRoom), {
      _id,
      createdAt,
      text,
      user
    })
      .then(() => {
        console.log('Data uploaded successfully.');
      })
      .catch((error) => {
        console.error('Error uploading data: ', error);
        alert('Failed to upload data to Firestore.');
        alert(error);
      });

      var date = new Date();
      if (chatObject){
        firebase.database().ref('ChatRooms/' + `${recipientUser}_${currentUserId}`)
        .set({
          id: `${recipientUser}_${currentUserId}`, 
          Loser: chatObject.loser, 
          Finder: chatObject.finder, 
          Item: chatObject.item, 
          Time: date.getFullYear() + "/" + ("0" + (date.getMonth() + 1))
            .slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours() )
            .slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2)
        });
      }
      
  }, []);

  return(
    <View style= {{backgroundColor: '#ffffff', height: '100%'}}>
      <View style={{ flex: 1, marginBottom: 35}}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: auth.currentUser?.email ?? ''
          }}
          messagesContainerStyle={styles.messageContainer}
        />
      </View>
    </View>
    
  )
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: '#ffffff',
  },
});

export default RoomScreen;