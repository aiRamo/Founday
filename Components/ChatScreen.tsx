import { firebase, auth, firestore } from './firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, limit, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

interface Message {
  _id: string;
  createdAt: any;
  text: any;
  user: any;
}

const RoomScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useLayoutEffect(() => {
    const collectionRef = collection(firestore, 'messages');
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
    return () => unsubscribe();
  }, []);
  

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(firestore, 'messages'), {
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
  }, []);

  return(
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: auth.currentUser?.email
      }}
      messagesContainerStyle={styles.messageContainer}
    />
  )
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: '#ffffff',
  },
});

export default RoomScreen;