import * as React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Pressable, Image} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import * as ImagePicker from 'expo-image-picker';
import UploadImage, {image} from './utilities/UploadImage';



 const LostReport = ({navigation}) => {
    const [itemDescription, onChangeDescText] = React.useState('description');
    const [itemCategory, onChangeCatText] = React.useState('category');
    const [itemLocation, onChangeLocText] = React.useState('i.e. NH');
    const [selectedDate, setSelectedDate] = React.useState('');
    const [image, setImage] = React.useState(null);

    const onPressLearnMore = () => {
        //go back to home after submitting created report
        navigation.navigate('Home');
      };

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect: [4,3],
            quality: 1,
        });

        const source = {uri: result.uri};
        console.log(source);
        setImage(source);
        
    };
  return (
    <View style = {styles.container}>
        <Text style={{textAlign: 'center', fontWeight: 'bold',
            marginTop: 5, }}>Create Lost Item Report</Text>

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
                <TouchableOpacity onPress={pickImage}>
                  <Image source={require('../assets/imagePicker.png')} style={styles.imagePicker}/>
                </TouchableOpacity>
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
                    color: 'white',}}>Create Lost Item</Text>
            </Pressable>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF1F8',

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
  imagePicker : {
    width: 150, 
    height: 150,
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 12,
  }
});


export default LostReport;