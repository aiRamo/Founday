import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { AntDesign } from '@expo/vector-icons';
import Settings  from './Settings';
import LostReport from './LostReport';


// The inteface of the lost item i.e. data attributes
const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Lost Item 1',
      description: 'is simply dummy text of the \nprinting and typesetting industry.',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Lost Item 2',
      description: 'Lorem Ipsum is simply dummy text of \nthe printing and typesetting industry.',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Lost Item 3',
      description: 'Lorem Ipsum has been the industry\'s \nstandard dummy text ever since the 1500s',
    },
  ];

  const Item = ({title, description}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );


 const Home = ({navigation}) => {
    const [count, setCount] = useState(0);
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
        <View style={styles.container}>
          {/* user profile picture and names, email  view*/}
            <View style={styles.vertical}>
                <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>
                <Text>Names: </Text>
                <Text>Email: </Text>
            </View>
            {/* open claims button view*/}
            <View style={styles.vertical}>
                <Text style={{textAlign: 'center',}} >3 </Text>
                <Text style={{textAlign: 'center',}}>Open Claims </Text>
                <TouchableOpacity style={styles.button} onPress={goToOpenClaims}>
                    <Text>Open Claims</Text>
                </TouchableOpacity>
            </View>
            {/* matches button view*/}
            <View style={styles.vertical}>
                <Text style={{textAlign: 'center',}}>{count} </Text>
                <Text style={{textAlign: 'center',}}>Resolved </Text>
                <TouchableOpacity style={styles.button} onPress={goToMatchResults}>
                    <Text>Matches</Text>
                </TouchableOpacity>
            </View>

        </View>

        {/* creating and displaying Lost item report View*/}
        <View>
            <Text> Create new Lost Item Report 
              <AntDesign 
                name="pluscircle" 
                size={30} 
                color="blue" 
                style={{margin: 15, padding: 10,}}
                onPress={() =>
                  navigation.navigate('Lost Report')
                }/>
            </Text>
            <FlatList
                horizontal ={true}
                data={DATA}
                renderItem={({item}) => <Item title={item.title} description={item.description}/>}
                keyExtractor={item => item.id}
            />
        </View>

        {/* creating and displaying Found item report View*/}
        <View>
            <Text> Create new Found Item Report
              <AntDesign 
                name="pluscircle" 
                size={30} 
                color="blue" 
                onPress={() =>
                  navigation.navigate('Found Report')
                }/>
            </Text>
            <FlatList
                horizontal ={true}
                data={DATA}
                renderItem={({item}) => <Item title={item.title} description={item.description} />}
                keyExtractor={item => item.id}
            />
        </View>
    </View>

    
  );
}

{/* styles for this screen*/}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginTop: 35,
    },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:  5,
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
    marginRight: 10,
    borderRadius: 100,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2, // make button round
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 25,
  },
  description: {
    fontSize: 15,
  },
});


export default Home;