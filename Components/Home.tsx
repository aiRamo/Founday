import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Settings  from './Settings';

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

  const Item = ({title}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

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
                renderItem={({item}) => <Item title={item.title} />}
                keyExtractor={item => item.id}
            />
        </View>

        <View>
            <Text> Create new Found Item Report</Text>
            <FlatList
                horizontal ={true}
                data={DATA}
                renderItem={({item}) => <Item title={item.title} />}
                keyExtractor={item => item.id}
            />
        </View>
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
    fontSize: 32,
  },
});


export default Home;