import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ImageBackground, Dimensions, ScrollView, Alert} from 'react-native';
import Card from './utilities/homepageCard';
import { firebase } from './firebaseConfig';
import {get ,ref, onValue} from 'firebase/database';
import { getDownloadURL } from 'firebase/storage';

const db = firebase.database()


interface LostItem {
  title: string;
  description: string;
  image: any;
  button: boolean;
  imageCategory: string;
}

// getUserData() used to access the info of the user that just signed in.

const getUserData = (uid: string) => {
  const userRef = ref(db, `users/${uid}`);
  return get(userRef);
};
  
  const { width, height } = Dimensions.get('window');

  // For each card, we check if button == true (which means it is the create report button), if true, change render to handle button pressing.
  const Item = ({title, description, image, button, onPress, imageCategory}) => {

    const user = firebase.auth().currentUser;
    const uid = user?.uid;
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
      if (image) {
        const storageRef = firebase.storage().ref(`${imageCategory}/${uid}/${image}`);
        storageRef.getDownloadURL().then((url) => {
          setImageUrl(url);
        });
      }
    }, [image]);

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
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </ImageBackground>
        ) : (
          <ImageBackground source={image} style={styles.itemImage}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </ImageBackground>
        )}
      </View>
      )}
    </Card>
    );
  };

 const Home = ({navigation}) => {
    const [count, setCount] = useState(0);
    const onPress = () => setCount(prevCount => prevCount + 1);
    const [userData, setUserData] = useState<any>(null);
    const [lostItems, setLostItems] = useState<LostItem[]>([]);
    const [FoundItems, setFoundItems] = useState<LostItem[]>([]);

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


        onValue(lostItemsRef, (snapshot) => {
          const items = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const item = {
              title: childData.itemName,
              description: childData.description,
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
                case 'ID':
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
          });
          items.push({
            title: 'Create New Lost Item Report',
            description: 'Have a new item? Create here:',
            image: require('../assets/report-addition.png'),
            imageCategory: "UserLostPhotos",
            button: true,
          });
          setLostItems(items);
        });

        onValue(foundItemsRef, (snapshot) => {
          const items = [];
          snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            const item = {
              title: childData.itemName,
              description: childData.description,
              image: null,
              button: false,
              imageCategory: "UserFoundPhotos",
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
                case 'ID':
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
            } else { //This is where I will DECODE the base64 image in the database and use it for item.image
              item.image = childData.image;
            }
            items.push(item);
          });
          items.push({
            title: 'Create New Found Item Report',
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
      setCount(prevCount => prevCount + 1);
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
                    <Text style={styles.buttonText}>Open Claims</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.button} onPress={goToMatchResults}>
                    <Text style={styles.buttonText}>Matches</Text>
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
                  snapToInterval={height * 0.46}
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
                  snapToInterval={height * 0.46}
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
    fontSize: 25,
    color: "#fff",
    marginTop: 5,
    marginLeft: 15,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 15,
    color: "#fff",
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginBottom: 15,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  itemImage: {
    minHeight: height * 0.45,
    maxHeight: height * 0.45,
    minWidth: height * 0.45,
    maxWidth: height * 0.45,
    justifyContent: 'space-between',
    flexDirection: 'column',
    resizeMode: 'contain',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#ffffff',
  }
});


export default Home;