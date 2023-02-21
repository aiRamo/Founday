import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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

  const Stack = createNativeStackNavigator();

 const Home = ({navigation}) => {
    const [count, setCount] = useState(0);
    const onPress = () => setCount(prevCount => prevCount + 1);
    const goSettings = () => < Settings navigation={undefined} />

  return (
    <View style={styles.wrapper}>
        <View style={styles.container}>
            <View style={styles.vertical}>
                <TouchableOpacity style={styles.button} onPress={goSettings}>
                    <Text>Settings</Text>
                </TouchableOpacity>
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
            <Text> Create new Lost Item Report</Text>
            <FlatList
                horizontal ={true}
                data={DATA}
                renderItem={({item}) => <Item title={item.title} description={item.description}/>}
                keyExtractor={item => item.id}
            />
        </View>

        <View>
            <Text> Create new Found Item Report</Text>
            <FlatList
                horizontal ={true}
                data={DATA}
                renderItem={({item}) => <Item title={item.title} description={item.description} />}
                keyExtractor={item => item.id}
            />
        </View>
        <Button onPress={() => navigation.navigate('User Settings')} title="Settings" color="#841584" />
        <Button
          title="Create Lost item Report"
          onPress={() =>
            navigation.navigate('Lost Report')
          }
        />
        <Button
          title="Create Found item Report"
          onPress={() =>
            navigation.navigate('Found Report')
          }
          color="#841584"
        />
    

    </View>

    
  );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
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
});


export default Home;