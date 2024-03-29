import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ImageBackground, Dimensions, ScrollView, Alert, Image, Modal} from 'react-native';
import Card from './utilities/homepageCard';
import { firebase } from './firebaseConfig';
import {ref, onValue} from 'firebase/database';
import { getMatchingFoundItems } from './utilities/serverless';
import * as RootNavigation from './RootNavigation';

const db = firebase.database()
export let matchResults: any; // This is what we will use to store the matchResults (for the time being)

interface LostItem {
  author: string;
  title: string;
  description: string;
  image: any;
  button: boolean;
  imageCategory: string;
}

interface MatchingResult {
  matchingItems: any;
  weakMatches: any;
}
  
const { width, height } = Dimensions.get('window');

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel, itemName }: any ) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalWindow} >
        <View style={styles.modalContent}>
          <Text style={styles.deleteText}>Delete report: {itemName}?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.deleteButton}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

  
const Item = ({title, description, image, button, onPress, imageCategory}: any) => {

  const user = firebase.auth().currentUser;
  const uid = user?.uid;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const storageRef = firebase.storage().ref(`${imageCategory}/${uid}/${image}`);
  const items = db.ref(`${imageCategory === 'UserLostPhotos' ? 'LostItems' : 'FoundItems'}`)
  const [confirmVisible, setConfirmVisible] = useState(false);


  useEffect(() => {
    if (image) {
      storageRef.getDownloadURL().then((url) => {
        setImageUrl(url);
      });
    }
  }, [image]);

  const deleteItem = () => {
    items.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();

        if (childData.image === image) {
          // Delete the item from the Firebase Realtime Database
          childSnapshot.ref.remove()
            .then(() => {
              console.log(`Item with image "${image}" deleted successfully`);
            })
            .catch((error) => {
              console.log(`Error deleting item with image "${image}": ${error.message}`);
            });
            //Since there is an associated image, delete the image from storage aswell.
            storageRef.delete()
            .then(() => {
              console.log('Image deleted successfully');
            })
            .catch((error) => {
              console.error('Error deleting image: ', error);
            });
        } else if (childData.image == 'N/A' && childData.itemName == title && childData.description == description) {
          // Delete the item from the Firebase Realtime Database
          childSnapshot.ref.remove()
            .then(() => {
              console.log(`Item with name "${title}" deleted successfully`);
            })
            .catch((error) => {
              console.log(`Error deleting item with name "${title}": ${error.message}`);
            });
        }
      });
    });
  };

  // For each card, we check if button == true (which means it is the create report button), if true, change render to handle button pressing.
  return (
  <Card>
    {button ? (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground source={image} style={styles.itemImage}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </ImageBackground>
    </TouchableOpacity>
  ) : (
    <View>
      {imageUrl ? (
        <ImageBackground source={{ uri: imageUrl }} style={styles.itemImage}>
          <View style = {styles.cardHeader}>
            <Text style={styles.title}>{title}</Text>
            <View style = {styles.headerButtonRow}>   
              <TouchableOpacity style = {styles.trashView} onPress = {() => setConfirmVisible(true)}>
                <Image source = {require('../assets/trashBin.png')} style = {styles.trashImg}/>
              </TouchableOpacity>

              {/* edit here*/}
              <TouchableOpacity style = {styles.editView} onPress = {() => {RootNavigation.navigate('Edit Item', {userName: 'Lucy'})}}>
                <Image source = {require('../assets/outline_edit_white_24.png')} style = {styles.editImg} />
              </TouchableOpacity>
            </View>

            <ConfirmDeleteModal
              visible={confirmVisible}
              onConfirm={() => {
                deleteItem();
                setConfirmVisible(false);
              }}
              onCancel={() => setConfirmVisible(false)}
              itemName = {title}
            />

          </View>
          <Text style={styles.description}>{description}</Text>
        </ImageBackground>
      ) : (
        <ImageBackground source={image} style={styles.itemImage}>
          <View style = {styles.cardHeader}>
            <Text style={styles.title}>{title}</Text>
            <View style = {styles.headerButtonRow}>
              <TouchableOpacity style = {styles.trashView} onPress = {() => setConfirmVisible(true)}>
                <Image source = {require('../assets/trashBin.png')} style = {styles.trashImg}/>
              </TouchableOpacity>

              {/* edit here*/}
              <TouchableOpacity style = {styles.editView} onPress = {() => RootNavigation.navigate('Edit Item', {userName: 'Lucy'})}>
                <Image source = {require('../assets/outline_edit_white_24.png')} style = {styles.editImg} />
              </TouchableOpacity>
            </View>

            <ConfirmDeleteModal
              visible={confirmVisible}
              onConfirm={() => {
                deleteItem();
                setConfirmVisible(false);
              }}
              onCancel={() => setConfirmVisible(false)}
              itemName = {title}
            />
            
          </View>
          <Text style={styles.description}>{description}</Text>
        </ImageBackground>
      )}
    </View>
    )}
  </Card>
  );
};

const Home = ({navigation}: any) => {
  const [matchCount, setMatchCount] = useState(0);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [FoundItems, setFoundItems] = useState<LostItem[]>([]);
  const [results, setResults] = useState<{ [key: string]: MatchingResult }>({});

  useEffect(() => {
    const handleGetMatchingItems = async () => {
      const matchingResults = await getMatchingFoundItems(lostItems);
      setResults(matchingResults);
    }

    handleGetMatchingItems();
  }, [lostItems]);

  useEffect(() => {
    matchResults = results;
    setMatchCount(0);
    let count = 0;
    for (const [key, value] of Object.entries(results)) {
      const { matchingItems, weakMatches } = value;
      if (matchingItems.length || weakMatches.length) {
        count += matchingItems.length + weakMatches.length;
        console.log(`Found matches in "${key}" item:`, value);
      } else {
        console.log(`No matches found for "${key}" item`);
      }
    }
    setMatchCount(prevCount => prevCount + count);
  }, [results]);

  useEffect(() => {
    console.log(`New match count:`, matchCount);
  }, [matchCount]);

  useEffect(() => {
    //get the user reference using firebase.auth()
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;

      //gets the paths to use w/ snapshot.foreach()
      const lostPath = 'LostItems/';
      const foundPath = 'FoundItems/';


      const lostItemsRef = ref(db, lostPath);
      const foundItemsRef = ref(db, foundPath);


      onValue(lostItemsRef, async (snapshot) => {
        const items = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          if (childData.author === uid) {
            const item = {
              author: childData.author,
              title: childData.itemName,
              description: childData.description,
              category: childData.category,
              location: childData.location,
              image: null,
              button: false,
              imageCategory: "UserLostPhotos",
            };
            // Use a switch statement to set the image based on the category of the lost item
            if (childData.image == 'N/A'){
              switch (childData.category) {
                case 'Apparel':
                  item.image = require('../assets/default-apparel.png');
                  break;
                case 'Electronics':
                  item.image = require('../assets/default-electronics.png');
                  break;
                case 'Traversals':
                  item.image = require('../assets/default-traversals.png');
                  break;
                case 'Bags':
                  item.image = require('../assets/default-bags.png');
                  break;
                case 'ID/Documents':
                  item.image = require('../assets/default-ID.png');
                  break;
                case 'Keys':
                  item.image = require('../assets/default-keys.png');
                  break;
                default:
                  Alert.alert(childData.category);
                  item.image = require('../assets/defaultProfile.png');
                  break;
              }
            } else {
              item.image = childData.image;
            }
            items.push(item);
          }
        });
        items.push({
          author: 'N/A',
          title: 'Create New Lost Item',
          description: 'Have a new item? Create here:',
          image: require('../assets/report-addition.png'),
          imageCategory: "UserLostPhotos",
          button: true,
        });
        setLostItems(items)
      });

      onValue(foundItemsRef, (snapshot) => {
        const items = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          if (childData.author === uid) {
            const item = {
              author: childData.author,
              title: childData.itemName,
              description: childData.description,
              location: childData.location,
              image: null,
              category: childData.category,
              button: false,
              imageCategory: "UserFoundPhotos",
            };
            // Use a switch statement to set the image based on the category of the lost item
            item.image = childData.image;
            items.push(item);
          }
        });
        items.push({
          author: 'N/A',
          title: 'Create New Found Item',
          description: 'Have a new item? Create here:',
          image: require('../assets/report-addition.png'),
          button: true,
          imageCategory: "UserFoundPhotos",
        });
        setFoundItems(items);
      });
    } else {
      console.log("User is not logged in");
    }
  }, []);

  const goToMatchResults = () => {
    // going to matches screen functionality
    navigation.navigate('Matches');
  }
  
  const goToOpenClaims = () => {
    //go to open claims screen
    navigation.navigate('Claims');
  }


  
  return (
    <View style={styles.wrapper}>
        <View style={styles.buttonContainer}>
            <View>
                <TouchableOpacity style={styles.button} onPress={goToOpenClaims} >
                    <Text style={styles.buttonText}>Chats</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={goToMatchResults}>
                    <Text style={styles.buttonText}>Matches</Text>
                    {matchCount > 0 && (
                      <View style = {styles.countCircle}>
                        <Text style = {styles.countCircleText}>{matchCount}</Text>
                      </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView style = {{paddingBottom: 50}}>
          <View>
            <Text style={styles.text}>Your Currently Lost Items:</Text>
            <FlatList
                horizontal ={true}
                data={lostItems.slice().reverse()}
                renderItem={({item}) =>
                  <Item title={item.title} description={item.description} image={item.image} button = {item.button} onPress={() => navigation.navigate('Lost Report')}
                    imageCategory={item.imageCategory} />}
                  snapToInterval = {(height * 0.3) + 10}
                  decelerationRate="fast"
            />
          </View>
          <View>
            <Text style={styles.text}>Your Currently Found Items:</Text>
            <FlatList
                horizontal ={true}
                data={FoundItems.slice().reverse()}
                renderItem={({item}) =>
                  <Item title={item.title} description={item.description} image={item.image} button = {item.button} onPress={() => navigation.navigate('Found Report')} 
                    imageCategory={item.imageCategory} />}
                    snapToInterval = {(height * 0.3) + 10}
                  decelerationRate="fast"
            />
          </View>
          <View style={{ height: 35, backgroundColor: '#EFF1F8' }} />
        </ScrollView>
        
    </View>

    
  );
}

{/* styles for this screen*/}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#EFF1F8',
    },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFF1F8',
    justifyContent: 'center',
    marginTop:  15,
    marginBottom: 10,
    paddingHorizontal: width * 0.015,
  },
  text: {
    color: '#000',
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#687089',
    padding: 5,
    width: width * 0.45,
    height: height * 0.04,
    marginHorizontal: width * 0.015,
    borderRadius: 8,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2, // make button round
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 2,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginTop: 5,
    marginLeft: 5,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 15,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
  itemImage: {
    minHeight: height * 0.3,
    maxHeight: height * 0.3,
    minWidth: height * 0.3,
    maxWidth: height * 0.3,
    justifyContent: 'space-between',
    flexDirection: 'column',
    resizeMode: 'contain',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  trashView: {
    width: 50,
    height: 50,
  },
  trashImg: {
    width: 50,
    height: 50,
  },
  editView: {
  },
  editImg: {
    width: 35,
    height: 35,
    marginTop: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContent: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#EFF1F8',
    borderRadius: 10,
  },
  modalWindow: {
    alignSelf: 'center',
    height: height,
    width: width,
    justifyContent: 'center',
    backgroundColor: 'rgba(	104, 112, 137, 0.5)',
  },
  deleteText: {
    color: '#000',
    alignSelf: 'center',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 15,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#687089',
    padding: 5,
    width: width * 0.38,
    height: height * 0.04,
    marginHorizontal: width * 0.015,
    borderRadius: 8,
  },
  countCircle: {
    backgroundColor: 'red',
    borderRadius: 50,
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countCircleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  headerButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});


export default Home;