import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { firebase, auth, firestore } from './firebaseConfig';

 const ClaimsManagement = ({navigation}: any) => {
  const [chats, setChats] = useState<any[]>([]);
  const currentUserUid = auth.currentUser?.uid;

  useEffect(() => {
    // This useEffect() is used retrieve EACH user from the realtime database users directory. It then stores these users in the users state.
    const usersRef = firebase.database().ref('ChatRooms');
    usersRef.on('value', (snapshot) => {
      const chatRoomData = snapshot.val();
      if (chatRoomData) {
        // Convert the object of users into an array of users
        const chatsArray = Object.keys(chatRoomData).map((chatId) => ({
          id: chatId,
          ...chatRoomData[chatId],
        }));
        // Update the state with the array of users
        setChats(chatsArray);
      }
    });
  }, []);

  const handleChatEnter = (chatRoomID: any) => {
    navigation.navigate('Chat Room', {chatRoomID}); // chatRoomID is sent with the chat screen.tsx to implement 1 to 1 functionality. 
  }

  return (
    <View style= {{backgroundColor: '#EFF1F8'}} >
      <ScrollView style={styles.scrollView}>
         {/* Items you lost View*/}
        <Text style={{fontSize: 20, marginTop: 15, marginLeft: 8,}}>Items you lost</Text>
        <View style={{borderWidth: 0.5, borderColor: 'black', margin: 10}}/>
        {chats        // **** This .map() is used to cycle through every chat and generate a chat card by default.
                      //1.  We will need to create a way to check if the chat belongs in lost or found, AND to check if it has any contents at all.
                      //2.  ALSO IN HERE, when the cards are generated, we need to PULL the correct firestore data for that specific chat and DISPLAY the most recent message.
                      //3.  I guess while we are at it, lets fix that date section in the card to also pull the date data from the firestore object.
        .filter((chat) => chat.id.split("_")[1] == currentUserUid)
        .reverse()
        .map((chat) => (
        <View key={chat.email} style={styles.container}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.img} />

          {/* inner texts view*/}
          <View style={styles.innerContainer}>
            <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>
              {chat.Finder} found your {chat.Item}
            </Text>
            <Text style={{ fontSize: 12, color: 'gray', marginTop: 3 }}>{chat.Time}</Text>
            <Text style={{ fontSize: 15, color: 'gray', marginTop: 8 }}></Text>
          </View>

          {/* pin icon*/}
          <AntDesign
            name="wechat"
            size={25}
            onPress={() => handleChatEnter(chat.id)}
            style={styles.pin}
          />
        </View>
        ))}

         {/* Items you Found View*/}
        <Text style={{fontSize: 20, marginTop: 50, marginLeft: 8, }}>Items you found</Text>
        {/* horizontal line*/}
        <View style={{borderWidth: 0.5, borderColor: 'black', margin: 10}}/>  
        {chats        // **** This .map() is used to cycle through every chat and generate a chat card by default.
                      //1.  We will need to create a way to check if the chat belongs in lost or found, AND to check if it has any contents at all.
                      //2.  ALSO IN HERE, when the cards are generated, we need to PULL the correct firestore data for that specific chat and DISPLAY the most recent message.
                      //3.  I guess while we are at it, lets fix that date section in the card to also pull the date data from the firestore object.
        .filter((chat) => chat.id.split("_")[0] == currentUserUid)
        .sort()
        .reverse()
        .map((chat) => (
        <View key={chat.email} style={styles.container}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.img} />

          {/* inner texts view*/}
          <View style={styles.innerContainer}>
            <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>
              You found {chat.Loser}'s {chat.Item}
            </Text>
            <Text style={{ fontSize: 12, color: 'gray', marginTop: 3 }}>{chat.Time}</Text>
            <Text style={{ fontSize: 15, color: 'gray', marginTop: 8 }}></Text>
          </View>

          {/* pin icon*/}
          <AntDesign
            name="wechat"
            size={25}
            onPress={() => handleChatEnter(chat.id)}
            style={styles.pin}
          />
        </View>
        ))}
        
      </ScrollView>

    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 8,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    marginTop:  5,
    marginStart: 15,
    marginEnd: 5,
  },
  vertical: {
    flex: 1,
  },
  text: {
    color: 'black',
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    alignItems: 'flex-start',
    marginTop: 8,
    marginStart: 10,
  },
  scrollView: {
    marginHorizontal: 3,
    height: '100%',
    flexGrow: 1,
  },
  pin: {
    marginTop: 10, 
    alignItems: 'flex-end',
    marginRight: 25,
  }
});


export default ClaimsManagement;