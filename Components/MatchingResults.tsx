import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { matchResults } from './Home'; // This is the Object Array that will be used to render/connect the matching item cards.
import { firebase } from './firebaseConfig';
import { CommonActions } from '@react-navigation/native';
import { he } from 'react-native-paper-dates';


/* const LeftContent = props => <Avatar.Icon {...props} icon="folder" /> */
{/* right and left elements to pass to the cards*/}
const { width, height } = Dimensions.get('window');


interface FoundItem {
  matchedWith: any;
  author: string;
  authorName: string;
  date: any;
  itemName: string;
  description: string;
  image: any;
  location: string;
  category: string;
  categoryImage: any;
  isStrong: boolean;
}

interface chatInfo {
  finder: string;
  loser: string;
  item: string;
}

const MatchingResults = ({navigation}: any) => {

  const [strongMatches, setStrongMatches] = useState<FoundItem[]>([]);
  const [weakMatches, setWeakMatches] = useState<FoundItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [firstMessage, setFirstMessage] = useState('');
  const [recipientUser, setRecipientUser] = useState<any>();
  const [chatObject, setChatObject] = useState<chatInfo>();
  const [currentUserName, setCurrentUserName] = useState<string>();

  const getAuthorName = async (authorId: any) => {
    const Fuser = firebase.auth().currentUser;
    const uid = Fuser?.uid;
    console.log('UID: ' + uid);
    const snapshot = await firebase.database().ref(`users/${authorId}`).once('value');
    const author = snapshot.val();
    const userSnapshot = await firebase.database().ref(`users/${uid}`).once('value');
    const user = userSnapshot.val();
    setCurrentUserName(user.firstName);
    return author.firstName; // assuming the author object has a 'name' property
  };

  const getCategoryImage = async (category: any) => {
    switch (category) {
      case 'Apparel':
        return require('../assets/default-apparel.png');
      case 'Electronics':
        return require('../assets/default-electronics.png');
      case 'Traversals':
        return require('../assets/default-traversals.png');
      case 'Bags':
        return require('../assets/default-bags.png');
      case 'ID/Documents':
        return require('../assets/default-ID.png');
      case 'Keys':
        return require('../assets/default-keys.png');
      default:
        return require('../assets/defaultProfile.png');
    } 
  }
  useEffect(() => {
    const strongItems: FoundItem[] = [];
    const weakItems: FoundItem[] = [];
  
    const retrieveImageUrl = async (author: string, imageKey: string): Promise<string> => {
      const url = await firebase.storage().ref(`UserFoundPhotos/${author}/${imageKey}`).getDownloadURL();
      return url;
    };
  
    const retrieveItems = async () => {
      for (const key in matchResults) {
        const matchingItems = matchResults[key].matchingItems;
        for (let i = 0; i < matchingItems.length; i++) {
          const authorId = matchingItems[i].author;
          const authorName = await getAuthorName(authorId);
          const imageUrl = await retrieveImageUrl(authorId, matchingItems[i].image);
          const categoryImage = await getCategoryImage(matchingItems[i].category)
          console.log(matchingItems[i]);
          const item: FoundItem = {
            matchedWith: key,
            date: matchingItems[i].date,
            author: authorId,
            authorName: authorName,
            isStrong: true,
            itemName: matchingItems[i].itemName,
            description: matchingItems[i].description,
            location: matchingItems[i].location,
            image: imageUrl,
            category: matchingItems[i].category,
            categoryImage: categoryImage,
          };
          strongItems.push(item);
        }
  
        const weakMatches = matchResults[key].weakMatches;
        for (let i = 0; i < weakMatches.length; i++) {
          const authorId = weakMatches[i].author;
          const authorName = await getAuthorName(authorId);
          const imageUrl = await retrieveImageUrl(authorId, weakMatches[i].image);
          const categoryImage = await getCategoryImage(weakMatches[i].category)
          console.log(weakMatches[i]);
          const item: FoundItem = {
            matchedWith: key,
            date: weakMatches[i].date,
            author: authorId,
            authorName: authorName,
            isStrong: false,
            itemName: weakMatches[i].itemName,
            description: weakMatches[i].description,
            location: weakMatches[i].location,
            image: imageUrl,
            category: weakMatches[i].category,
            categoryImage: categoryImage,
          };
          weakItems.push(item);
        }
      }
  
      setStrongMatches(strongItems);
      setWeakMatches(weakItems);
    };
  
    retrieveItems();
  }, [matchResults]);

  useEffect(() => {
  }, [strongMatches, weakMatches]);

  const handleChatEnter = (recipientUser: any, Finder: string, Loser: any, Item: string) => {
    console.log("THIS IS THE CURRENT USER: " + Loser);
    setRecipientUser(recipientUser);
    setChatObject({
      finder: Finder,
      loser: Loser,
      item: Item
    });
    setShowModal(true);
  }

  useEffect (() => {
    setFirstMessage('');
  }, [showModal])

  const cardStyle = (height < width) ? styles.Webcard : styles.Mobilecard;

  const containerStyle = (height < width) ? styles.WmodalContainer : styles.MmodalContainer;
  const panelStyle = (height < width) ? styles.WmodalPanel : styles.MmodalPanel;
  const titleStyle = (height < width) ? styles.WmodalTitle : styles.MmodalTitle;
  const inputStyle = (height < width) ? styles.WmodalInput : styles.MmodalInput;
  const rowStyle = (height < width) ? styles.WbuttonRow : styles.MbuttonRow;
  const buttonTextStyle = (height < width) ? styles.WmodalButtonText : styles.MmodalButtonText;
  const buttonStyle = (height < width) ? styles.WmodalButton : styles.MmodalButton;

  return (

  <View style={styles.container}>
    <ScrollView style={{marginTop: 1, marginHorizontal: 5, backgroundColor: '#EFF1F8', flexGrow: 1, width: 400}}>
      {[...strongMatches, ...weakMatches]
        .sort((a, b) => (a.isStrong ? -1 : 1))
        .map((item, index) => (
          <Card style={cardStyle} key={index}>
            <Card.Title
              title={item.itemName}
              subtitle={`${item.authorName} - ${item.date}`}
              left={props => <Image source={item.categoryImage} style={styles.img}/>}
              right={item.isStrong ? (props: { size: number }) => (
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.strongMatchText}>Matching Locations</Text>
                  <Image source={require('../assets/pin.png')} style={styles.pinImg} />
                </View>
              ) : undefined}
            />
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode='contain'/>
            <Card.Content>
              <Text style={{ fontWeight: 'bold', marginVertical: 10 }}>{item.itemName} - Matches with {item.matchedWith}</Text>
              <Text style={{ marginVertical: 5 }}>{item.description}</Text>
            </Card.Content>
            <TouchableOpacity style={styles.contactButton} onPress={() => handleChatEnter(item.author, item.authorName, currentUserName, item.itemName)}>
              <Text style={styles.contactText}>Contact Finder</Text>
            </TouchableOpacity>
          </Card>
        ))}
    </ScrollView>

    <Modal visible={showModal} animationType='slide' style={{maxHeight: 600, maxWidth: 1000}} transparent={true}>
      <View style={containerStyle}>
        <View style={panelStyle}>
          <Text style={titleStyle}>Send the first message</Text>
          <TextInput
            style={inputStyle}
            onChangeText={text => setFirstMessage(text)}
            multiline={true}
            numberOfLines={3}
            value={firstMessage}
            placeholder='Type your message here'
            blurOnSubmit={true}
          />
          <View style={rowStyle}>
            <TouchableOpacity style={buttonStyle} onPress={() => {

              if (firstMessage) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      { name: 'Home' },
                      {
                        name: 'Chat Room',
                        params: {
                          recipientUser,
                          firstMessage,
                          chatObject,
                        },
                      },
                    ],
                  })
                );
                setShowModal(false);
                setShowModal(false);
              } else {
                Alert.alert('No message written!')
              }
              
              
            }}>
              <Text style={buttonTextStyle}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyle} onPress={() => setShowModal(false)}>
              <Text style={buttonTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF1F8',
    marginTop: 5,
    height: height,
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop:  5,
    marginStart: 2,
    marginEnd: 200,
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
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    marginRight: 8,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    padding: 2,
    backgroundColor: '#ecf0f1',
    marginTop: 50,
    marginEnd: 50,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  Mobilecard: {
    flexGrow: 1,
    marginVertical: 15,
    height: height * 0.65,
    width: width * 0.95,
    maxWidth: 600,
    maxHeight: 780,
    alignSelf: 'center',
  },
  Webcard: {
    flexGrow: 1,
    marginVertical: 15,
    height: height * 1,
    width: width * 0.95,
    maxWidth: 600,
    maxHeight: 780,
    alignSelf: 'center',
  },
  itemImage: {
    width: '95%',
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  contactButton: {
    height: 50,
    width: 150,
    backgroundColor: '#687089',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 5,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff'
  },
  pinImg: {
    width: 30,
    height: 30,
    borderRadius: 100 / 2,
    marginRight: 8,
  },
  strongMatchText: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  MmodalContainer: {
    flex: 1,
    maxHeight: height,
    maxWidth: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(	104, 112, 137, 0.5)',
  },
  MmodalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 50,
    alignSelf: 'center',
  },
  MmodalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'center',
    color: '#ffffff',
  },
  MmodalInput: {
    height: 80,
    width: '115%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    fontSize: 13,
    borderRadius: 8,
  },
  MmodalButton: {
    backgroundColor: '#687089',
    marginHorizontal: 10,
    borderRadius: 12,
    width: 150,
    height: 50,
    justifyContent: 'center',
  },
  MmodalPanel: {
    backgroundColor: '#EFF1F8',
    height: height * 0.35,
    width: width * 0.8,
    maxWidth: 1100,
    borderRadius: 15,
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 40,
  },
  MbuttonRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 40,
  },
  WmodalContainer: {
    flex: 1,
    maxHeight: height,
    maxWidth: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(	104, 112, 137, 0.5)',
    padding: 20
  },
  WmodalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 50,
    alignSelf: 'center',
  },
  WmodalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'center',
    color: '#ffffff',
  },
  WmodalInput: {
    height: 120,
    width: '95%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    fontSize: 24,
    borderRadius: 8,
  },
  WmodalButton: {
    backgroundColor: '#687089',
    marginHorizontal: 20,
    borderRadius: 12,
    width: 160,
    height: 50,
    justifyContent: 'center',
  },
  WmodalPanel: {
    backgroundColor: '#EFF1F8',
    height: height * 0.5,
    width: width * 0.8,
    maxWidth: 1100,
    borderRadius: 15,
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 40,
  },
  WbuttonRow: {
    flexDirection: 'row',
    alignSelf: 'center',
  }
});


export default MatchingResults;