import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { matchResults } from './Home'; // This is the Object Array that will be used to render/connect the matching item cards.


/* const LeftContent = props => <Avatar.Icon {...props} icon="folder" /> */
{/* right and left elements to pass to the cards*/}
const LeftContent = props => <Image source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} style={styles.img}/>
const RightContent = props => <AntDesign name="ellipsis1" size={25} onPress={() => {}} style={{marginTop: 4, marginRight: 5, alignItems: 'flex-end'}} />



const MatchingResults = ({navigation}: any) => {

  useEffect(() => {
    console.log(matchResults);
  }, [matchResults]);

  return (

    <View style={styles.container}>
    
          <ScrollView style={{marginTop: 1, marginLeft: 5, }}>

            {/* card 1*/}
            <Card style={styles.card}>
                  <Card.Title title="Finder name" subtitle="time" left={LeftContent} right={RightContent}/>
                  <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                  <Card.Content>
                    <Text style={{fontWeight: 'bold'}}>Apple watch</Text>
                    <Text >an apple watch, 3 series in 2016</Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button>Matching Locations</Button>
                    <Button>More</Button>
                  </Card.Actions>
              </Card>

            {/* card 2*/}
            <Card style={styles.card}>
                  <Card.Title title="Jane Doe" subtitle="12 Hours ago" left={LeftContent} right={RightContent}/>
                  <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                  <Card.Content>
                    <Text style={{fontWeight: 'bold'}}>Apple watch</Text>
                    <Text >an apple watch, 3 series in 2016</Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button>Matching Locations</Button>
                    <Button>More</Button>
                  </Card.Actions>
              </Card>
           

            {/* card 3*/}
            <View>
              <Card style={styles.card}>
                  <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
                  <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                  <Card.Content>
                    <Text >Item name</Text>
                    <Text >item description</Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button>Matching Locations</Button>
                    <Button>More</Button>
                  </Card.Actions>
              </Card>
            </View>

            {/* card 4*/}
            <Card style={styles.card}>
                  <Card.Title title="Finder name" subtitle="time" left={LeftContent} right={RightContent}/>
                  <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                  <Card.Content>
                    <Text style={{fontWeight: 'bold'}}>Backpack</Text>
                    <Text >a nike backpack, looking new with books inside</Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button>Matching Locations</Button>
                    <Button>More</Button>
                  </Card.Actions>
              </Card>

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
  card: {
    marginTop: 15,
  },
});


export default MatchingResults;