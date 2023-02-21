import * as React from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView, Pressable} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import Home from './Home';
import UploadImage from './utilities/UploadImage';



 const FoundReport = ({navigation}) => {
  const [itemDescription, onChangeDescText] = React.useState('description');
  const [itemCategory, onChangeCatText] = React.useState('electronics');
  const [itemLocation, onChangeLocText] = React.useState('i.e. ERB');
    const [selectedDate, setSelectedDate] = React.useState('');
    const onPressLearnMore = () => {
        //go back to home after submitting created report
        navigation.navigate('Home');
      };
  return (
    <View>
        <Text style={{textAlign: 'center', fontWeight: 'bold',
            marginTop: 5, }}>Create Found Item Report</Text>

<ScrollView style={styles.scrollView}>
            <View>
                <Text style={{marginTop: 5, marginLeft: 5,}}>Item Description</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeDescText}
                    value={itemDescription}
                />
            </View>

            {/* probably need a drop down for all the categories we allow*/}
            <View>
                <Text style={{marginTop: 5, marginLeft: 5,}}>Category</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeCatText}
                    value={itemCategory}
                />
            </View>
                    
            <View>
                <Text style={{marginTop: 5, marginLeft: 5,}}>Location</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeLocText}
                    value={itemLocation}
                />
            </View>
            <View>
                <Text style={{marginTop: 5, marginLeft: 5,}}>Picture</Text>
                <UploadImage/>

            </View>
            <View>
                <Text style={{marginTop: 5, marginLeft: 5,}}>Date</Text>
                <DatePicker
                    onSelectedChange={date => setSelectedDate(date)}
                />
            </View>
            {/* button to save the input information to db*/}

            <Pressable style={styles.button} onPress={onPressLearnMore}>
                <Text style={{fontSize: 16, lineHeight: 21, letterSpacing: 0.25,
                    color: 'white',}}>Create Found Item</Text>
            </Pressable>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  scrollView: {
    marginHorizontal: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginBottom: 40,
  },
});


export default FoundReport;