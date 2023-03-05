import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';


const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

 const MatchingResults = ({navigation}) => {

  return (

    <View style={styles.container}>
    
          <ScrollView style={{marginTop: 1, marginLeft: 5, }}>

            {/* card 1*/}
            <View style={styles.container}>
              <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>
              
              {/* more icon*/}
              <AntDesign 
                  name="ellipsis1" 
                  size={25} 
                  onPress={() => {}
                  } style={{marginTop: 10, marginLeft: 250, alignItems: 'flex-end'}} />

              <View style={styles.innerContainer}>

                {/* implemented with Text and Button as children */}
              
              </View>
              

            </View>

            {/* card 2*/}
            <View style={styles.container}>
              <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>
              
              {/* more icon*/}
              <AntDesign 
                  name="ellipsis1" 
                  size={25} 
                  onPress={() => {}
                  } style={{marginTop: 10, marginLeft: 20, alignItems: 'flex-end'}} />

                      <View style={styles.container2}>
                        <Card>
                          <Text style={styles.paragraph}>
                            React Native Card View for Android and IOS using
                            "react-native-paper"
                          </Text>
                        </Card>
                      </View>
                    

            </View>

            {/* card 3*/}
            <View style={styles.container}>
              <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>
              
              {/* more icon*/}
              <AntDesign 
                  name="ellipsis1" 
                  size={25} 
                  onPress={() => {}
                  } style={{marginTop: 10, marginLeft: 5, alignItems: 'flex-end'}} />

              <Card>
                  <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
                  <Card.Content>
                    <Text >Card title</Text>
                    <Text >Card content</Text>
                  </Card.Content>
                  <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                  <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                  </Card.Actions>
                </Card>
            </View>

          </ScrollView>

      </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 5,
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
    margin: 6,
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
});


export default MatchingResults;