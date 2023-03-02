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
    const onPress = () => setCount(prevCount => prevCount + 1);

    
  return (
    <View style={styles.wrapper}>
        <View style={styles.container}>
            <View style={styles.vertical}>
                <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>
                <Text>Names: </Text>
                <Text>Email: </Text>
            </View>
            <View style={styles.vertical}>
                <Text>3 </Text>
                <Text>Open Claims </Text>
                <TouchableOpacity style={styles.button} >
                    <Text>Open Claims</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.vertical}>
                <Text>{count} </Text>
                <Text>Resolved </Text>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text>Matches</Text>
                </TouchableOpacity>
            </View>

        </View>

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
        

        <Pressable style={styles.submitButton} onPress={() => navigation.navigate('User Settings')}>
                <Text style={{fontSize: 16, lineHeight: 21, letterSpacing: 0.25, fontWeight: 600,
                    color: 'white',}}>Settings</Text>
        </Pressable>
        
  
    </View>

    
  );
}

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
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
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
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#687089',
    marginTop: 20,
  },
});


export default Home;