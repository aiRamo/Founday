import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image, TextInput, ScrollView} from 'react-native';
import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { firebase } from './firebaseConfig';
import SelectDropdown from 'react-native-select-dropdown';
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";

const { width, height } = Dimensions.get('window');
const categories = ["Apparel","Electronics","ID/Documents","Traversals","Keys","Purse/Bags"];

const LostUploadScreen = ({navigation}) => {
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [category, setCategory] = useState(null);
    const [image, setImage] = useState(null);

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(undefined);
    const [time, setTime] = useState(null);
    
    const [timeVisible, setTimeVisible] = useState(false);
    const [dateLabel, setDateLabel] = useState('Choose a date:');
    const [timeLabel, setTimeLabel] = useState('Choose a time:');

    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect: [4,3],
            quality: 0.3,
        });

        if (!result.cancelled) {
          const resizedImage = await ImageManipulator.manipulateAsync(result.uri, [{ resize: { width: 500 } }], {
            compress: 0.3,
            format: ImageManipulator.SaveFormat.JPEG,
          });

          const source = { uri: resizedImage.uri };
          console.log(source);
          setImage(source);
        }
        
    };

    //TODO: when user hits button, upload attributes + filename of image to LostItems/<LostItemUniqueKey>
    // The atributes to import are author(uid), category, date, description, image(filename or N/A if no image), itemName(title)

    const uploadItem = async () => {
      
      if (!(title && description && category && date && time)) {
        alert('please fill out all information (image optional).');
        return;
      }

      
      // For processing correct Date format..

      const selectedMonth = new Date(date).getMonth();
      const currentMonth = new Date().getMonth();

      const selectedDay = new Date(date).getDate();
      const currentDay = new Date().getDate();

      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();

      const {hours, minutes} = time;

      // Check to see if date is not after current date. If it is, notify with an alert and return.
      if (selectedMonth > currentMonth ||
        selectedMonth === currentMonth && selectedDay > currentDay ||
        selectedMonth === currentMonth && selectedDay === currentDay && hours > currentHour ||
        selectedMonth === currentMonth && selectedDay === currentDay && hours === currentHour && minutes > currentMinute) {
          
        alert('Selected date and time cannot be after the current date and time');
        return;
      }


      if (image) {
        setUploading(true);
        const response = await fetch(image?.uri);
        const blob = await response.blob();
        const filename = image?.uri.substring(image.uri.lastIndexOf('/')+1);

        const user = firebase.auth().currentUser;
        const uid = user?.uid;

        var ref = firebase.storage().ref().child('UserLostPhotos/' + uid + '/' + filename).put(blob);

        try {
            await ref;
            alert(
              'Photo Uploaded!'
            );
        } catch (e) {
          console.log(e);
        }

        setUploading(false);
      }

      if (image == null){
        console.log('image: N/A');
      }


      try {
        const user = firebase.auth().currentUser;
        const uid = user?.uid;
        const db = firebase.database();

        // Subdirectory for lostitems
        const lostItemsPath = 'LostItems/';

        const lostItemsRef = db.ref(lostItemsPath);

        await Promise.all([
            lostItemsRef.push().set({
                itemName: title,
                category: category,
                description: description,
                date: date,
                author: uid,
                image: image ? image?.uri.substring(image.uri.lastIndexOf('/')+1) : 'N/A'
            })
            
        ])
        .catch(error => {
            // handle the error
            console.error(error);
        });
        
      } catch (error) {
        alert(error)
        return;
      }


      console.log(title, description, category, image, date, time);
      setImage(null);

      navigation.navigate('Home');
    };

    const onDismissSingle = React.useCallback(() => {
      setOpen(false);
    }, [setOpen]);
  
    const onConfirmSingle = React.useCallback(
      (params) => {
        setOpen(false);
        setDate(params.date);
        setDateLabel(params.date.toLocaleDateString());
        console.log(params.date);
      },
      [setOpen, setDate]
    );

    const onTimeDismiss = React.useCallback(() => {
      setTimeVisible(false)
    }, [setTimeVisible]);
  
    const onTimeConfirm = React.useCallback(
      ({ hours, minutes }) => {
        setTime({hours, minutes})
        let timeHalf = '';

        if (hours < 12) {
          timeHalf = 'AM';
        } else {
          timeHalf = 'PM';
        }

        hours = hours % 12
        if (hours === 0){
          hours = 12;
        }

        setTimeVisible(false);
        setTimeLabel(`${hours}:${minutes} ${timeHalf}`);
        
      },
      [setTimeVisible]
      
    );
    

    return (
      <ScrollView style={styles.sv} bounces = {false}>
        <SafeAreaView style={styles.container}>

            <Text style={{marginTop: 15, marginLeft: 5,}}>Title:</Text>
            <View style={styles.textAreaContainer}>
              
              <TextInput
                style={styles.titleTextInput}
                placeholder="Item title here:"
                placeholderTextColor="grey"
                returnKeyType="done"
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            <Text style={{marginTop: 5, marginLeft: 5,}}>Description:</Text>
            <View style={styles.textAreaContainer} >
              
              <TextInput
                style={styles.textArea}
                placeholder="Type description here:"
                placeholderTextColor="grey"
                numberOfLines={5}
                multiline={true}
                blurOnSubmit={true}
                returnKeyType="done"
                onChangeText={(text) => setDescription(text)}
              />
            </View>

            <Text style={{marginTop: 5, marginLeft: 5,}}>Category:</Text>
            <SelectDropdown
                data={categories}
                onSelect={(selectedItem) => {
                  setCategory(selectedItem)
                }}
                defaultButtonText = 'Select:'
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item
                }}
                buttonStyle = {styles.categoryButton}
                buttonTextStyle = {styles.categoryText}
                dropdownStyle = {styles.catDropDown}
            />
            <Text style={{marginTop: 5, marginLeft: 5,}}>Item Image:</Text>
            <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
                {image && <Image source={{uri: image.uri}} style = {styles.previewImage}/> 
                || <Image source={require('../assets/imagePicker.png')} style = {styles.previewImage}/>}
            </TouchableOpacity>
            
            <Text style={{marginTop: 5, marginLeft: 5,}}>Date Lost:</Text>
            <View style = {styles.dateHandler}>
              <TouchableOpacity style = {styles.dateButton} onPress={() => setOpen(true)} >
                  <Text style={styles.buttonText}>
                      {dateLabel}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.dateButton} onPress={ () => setTimeVisible(true)} >
                  <Text style={styles.buttonText}>
                      {timeLabel}
                  </Text>
              </TouchableOpacity>
              <DatePickerModal
                mode="single"
                visible={open}
                onDismiss={onDismissSingle}
                onConfirm={onConfirmSingle}
                saveLabel="Save"
                label="Select Date"
                animationType="slide"
                locale='en'
              />
              <TimePickerModal
                visible={timeVisible}
                onDismiss={onTimeDismiss}
                onConfirm={onTimeConfirm}
                hours={12}
                minutes={14}
              />
            </View>

            <View style={{height: 1, width: width, backgroundColor: 'gray', marginVertical: 40}}/>

            <View>
                <TouchableOpacity style={styles.uploadButton} onPress={uploadItem}>
                    <Text style={styles.buttonText}>
                        Upload Item
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
      </ScrollView>
    )
}

export default LostUploadScreen;

const styles = StyleSheet.create({
    sv: {
      backgroundColor: '#EFF1F8',
    },
    container: {
        alignItems: 'flex-start',
        backgroundColor: '#EFF1F8',
        justifyContent: 'flex-start',
    },
    selectButton: {
        borderRadius: 15,
        width: 150,
        height: 150,
        backgroundColor: '#687089',
        alignItems:'center',
        justifyContent:'center',
        marginVertical: 10,
        marginLeft: 15,
    },
    uploadButton: {
        borderRadius: 8,
        width: 150,
        height: 50,
        backgroundColor: '#687089',
        alignItems:'center',
        justifyContent:'center',
        marginLeft: width * .5 - 75,
        marginVertical: 10,
    },
    buttonText: {
        color:'white',
        fontSize: 18,
        fontWeight:'bold',
    },
    previewImage: {
      width: 150,
      height: 150,
      borderRadius: 8,
    },
    categoryButton: {
      backgroundColor: '#687089',
      borderRadius: 8,
      width: 150,
      height: 50,
      marginVertical: 10,
      marginHorizontal: 15,
    },
    categoryText: {
      color: '#ffffff',
      fontWeight: '700',
    },
    catDropDown: {
    },
    textAreaContainer: {
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      marginVertical: 10,
      marginHorizontal: 15,
    },
    textArea: {
      height: height * 0.1,
      width: width * 0.8,
      justifyContent: "flex-start"
    },
    titleTextInput: {
      width: width * 0.8,
      justifyContent: "flex-start"
    },
    dateHandler: {
      justifyContent: 'space-between',
      alignContent: 'center',
      flexDirection: 'row',
      alignSelf: 'center',
    },
    dateButton: {
      borderRadius: 3,
        width: 150,
        height: 50,
        backgroundColor: '#687089',
        alignItems:'center',
        justifyContent:'center',
        marginVertical: 10,
        marginHorizontal: 5,
    }
})