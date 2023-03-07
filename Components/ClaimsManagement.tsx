import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

 const ClaimsManagement = ({navigation}) => {
  const goToPrivateMessage = () => {
    //go to chat
    navigation.navigate('Private Message');
  }

  return (
    <View >
         {/* Items you lost View*/}
        <Text style={{fontSize: 20, marginTop: 15, marginLeft: 8,}}>Items you lost</Text>
        <View style={{borderWidth: 0.5, borderColor: 'black', margin: 10}}/>
        <View style={styles.container}>
            <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>

            {/* inner texts view*/}
            <View style={styles.innerContainer}>
                <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold',}}>UserName replied to you</Text>
                <Text style={{fontSize: 12, color: 'gray', marginTop: 3,}}>Date here</Text>
                <Text style={{fontSize: 15, color: 'gray', marginTop: 8,}}>chats...</Text>
            </View>

            {/* pin icon*/}
            <AntDesign 
                name="pushpin" 
                size={25} 
                onPress={() => {goToPrivateMessage}
                } style={{marginTop: 10, alignItems: 'flex-end'}} />
        </View>
        {/* item you lost 2*/}
        <View style={styles.container}>
            <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>

            {/* inner texts view*/}
            <View style={styles.innerContainer}>
                <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold',}}>UserName replied to you</Text>
                <Text style={{fontSize: 12, color: 'gray', marginTop: 3,}}>Sunday at 11:50AM</Text>
                <Text style={{fontSize: 15, color: 'gray', marginTop: 8,}}>chats...</Text>
            </View>

            {/* pin icon*/}
            <AntDesign 
                name="pushpin" 
                size={25} 
                onPress={() => {goToPrivateMessage}
                } style={{marginTop: 10, alignItems: 'flex-end'}} />
        </View>

         {/* Items you Found View*/}
        <Text style={{fontSize: 20, marginTop: 150, marginLeft: 8, }}>Items you found</Text>
        {/* horizontal line*/}
        <View style={{borderWidth: 0.5, borderColor: 'black', margin: 10}}/>  

        <ScrollView style={styles.scrollView}>
            {/* each item found layout*/}
            <View style={styles.container}>
                <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>

                {/* inner texts view*/}
                <View style={styles.innerContainer}>
                    <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold',}}>Augusta Abbott replied to you</Text>
                    <Text style={{fontSize: 12, color: 'gray', marginTop: 3,}}>Date here</Text>
                    <Text style={{fontSize: 15, color: 'gray', marginTop: 8,}}>chats...</Text>
                </View>

                {/* pin icon*/}
                <AntDesign 
                    name="pushpin" 
                    size={25} 
                    onPress={() => {goToPrivateMessage}
                    } style={{marginTop: 10, alignItems: 'flex-end'}} />
            </View>

            {/* item found 2 layout*/}
            <View style={styles.container}>
                <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>

                {/* inner texts view*/}
                <View style={styles.innerContainer}>
                    <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold',}}>Oliver replied to you</Text>
                    <Text style={{fontSize: 12, color: 'gray', marginTop: 3,}}>Monday at 2:45PM</Text>
                    <Text style={{fontSize: 15, color: 'gray', marginTop: 8,}}>Regarding Found Item 1..</Text>
                </View>

                {/* pin icon*/}
                <AntDesign 
                    name="pushpin" 
                    size={25} 
                    onPress={() => {goToPrivateMessage}
                    } style={{marginTop: 10, alignItems: 'flex-end'}} />
            </View>

            {/* item found 3 layout*/}
            <View style={styles.container}>
                <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>

                {/* inner texts view*/}
                <View style={styles.innerContainer}>
                    <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold',}}>Oliver replied to you</Text>
                    <Text style={{fontSize: 12, color: 'gray', marginTop: 3,}}>Monday at 2:45PM</Text>
                    <Text style={{fontSize: 15, color: 'gray', marginTop: 8,}}>Regarding Found Item 2..</Text>
                </View>

                {/* pin icon*/}
                <AntDesign 
                    name="pushpin" 
                    size={25} 
                    onPress={() => {goToPrivateMessage}
                    } style={{marginTop: 10, alignItems: 'flex-end'}} />
            </View>

            {/* item found 2 layout*/}
            <View style={styles.container}>
                <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>

                {/* inner texts view*/}
                <View style={styles.innerContainer}>
                    <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold',}}>Oliver replied to you</Text>
                    <Text style={{fontSize: 12, color: 'gray', marginTop: 3,}}>Monday at 2:45PM</Text>
                    <Text style={{fontSize: 15, color: 'gray', marginTop: 8,}}>Regarding Found Item 3..</Text>
                </View>

                {/* pin icon*/}
                <AntDesign 
                    name="pushpin" 
                    size={25} 
                    onPress={() => {goToPrivateMessage}
                    } style={{marginTop: 10, alignItems: 'flex-end'}} />
            </View>
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
    flexGrow: 1,
  },
});


export default ClaimsManagement;