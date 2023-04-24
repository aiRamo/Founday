import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image, TextInput, ScrollView, Modal, ImageBackground, Platform} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { firebase } from './firebaseConfig';
import SelectDropdown from 'react-native-select-dropdown';
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";

const { width, height } = Dimensions.get('window');
const categories = ["Apparel","Electronics","ID/Documents","Traversals","Keys","Purse/Bags"];

const FoundUploadScreen = ({navigation}) => {
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

    const [location, setLocation] = useState('Location:');
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [uploading, setUploading] = useState(false);

    const [confirmVisible, setConfirmVisible] = useState(false);

    useEffect(() => {
      let mapWidth;
      let mapHeight;
      if (width > height) { // web mode
        mapWidth = width
        mapHeight = width / 1.19
      } else { //mobile mode
        mapWidth = width * 2
        mapHeight = (width / 1.19) * 2
      }
      if (selectedLocation) {
        setLocation(`${(selectedLocation.x / mapWidth).toFixed(7)}, ${(selectedLocation.y / mapHeight).toFixed(7)}`);
      }
    }, [selectedLocation]);

    const handleConfirmLocation = useCallback(() => {
      if (selectedLocation) {
        setLocation(`${selectedLocation.x}, ${selectedLocation.y}`);
      }
      setConfirmVisible(false);
    }, [selectedLocation]);

    const LocationPickerModal = ({ visible, onCancel }) => {
      const [pinCoordinates, setPinCoordinates] = useState({});
    
      const storeLocation = (event) => {
        if (Platform.OS === 'web'){
          const { left, top } = event.currentTarget.getBoundingClientRect();
          let locationX = event.clientX - left;
          let locationY = event.clientY - top;

          setPinCoordinates({ x: locationX, y: locationY });
          
        } else {
          let locationX = event.nativeEvent.locationX;
          let locationY = event.nativeEvent.locationY;
          console.log(`hersde Pin dropped at (${locationX}, ${locationY})`);
          setPinCoordinates({ x: locationX, y: locationY });
        }
      };
    
      const mapWindowStyle = width > height ? styles.mapWindowWeb : styles.mapWindowMobile;
      const mapSliderStyle = width > height ? styles.mapSliderWeb : styles.mapSliderMobile;
      const isWeb = (width > height);
      const pinYCoord = width > height ? 40 : 40;
    
      return (
        <Modal visible={visible} animationType="fade" transparent={true}>
          <ScrollView style = {mapSliderStyle} horizontal = {!isWeb} bounces = {false}>
            <View style={styles.modalWindow}>
              <TouchableOpacity onPress={storeLocation} style={mapWindowStyle} activeOpacity={1}>
                <ImageBackground style={styles.campusMap} source={require('../assets/UTA-MAP.png')}>
                  {pinCoordinates.x && (
                    <Image style={[styles.pinImage, { left: pinCoordinates.x - 20, top: pinCoordinates.y - pinYCoord}]} source={require('../assets/pin.png')} />
                  )}
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style = {styles.confirmButtonWindow}>
            <TouchableOpacity style={styles.confirmButton} onPress={() => {onCancel(pinCoordinates);}}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    };

    /* pickImage() uses ImagePicker and ImageManipulator libraries to pick an image from the user's device, resize it, and set it as the state of image.
    If the user cancels the image picker, nothing happens.
    */
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

    /* uploadItem() checks if all required fields are filled, checks if the selected date and time are not after the current date and time, uploads the image to Firebase 
    storage if an image is selected, and then creates a new entry in the Firebase database under FoundItems/ with the information provided. */
    const uploadItem = async () => {
      
      if (!(title && description && category && date && time && image)) {
        alert('please fill out all information.');
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

        var ref = firebase.storage().ref().child('UserFoundPhotos/' + uid + '/' + filename).put(blob);

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

        // Subdirectory for founditems
        const foundItemsPath = 'FoundItems/';

        const foundItemsRef = db.ref(foundItemsPath);

        await Promise.all([
            foundItemsRef.push().set({
                itemName: title,
                category: category,
                description: description,
                date: dateLabel,
                location: location,
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

    // onDismissSingle() is called when the user dismisses the date picker. It sets the open state to false.
    const onDismissSingle = React.useCallback(() => {
      setOpen(false);
    }, [setOpen]);
  
    /* onConfirmSingle() is called when the user confirms a selected date. It sets the open state to false, sets the selected date as the state of date, 
    and sets the dateLabel state to a formatted string of the selected date.*/
    const onConfirmSingle = React.useCallback(
      (params) => {
        setOpen(false);
        setDate(params.date);
        setDateLabel(params.date.toLocaleDateString());
        console.log(params.date);
      },
      [setOpen, setDate]
    );

    // onTimeDismiss() is called when the user dismisses the time picker. It sets the timeVisible state to false.

    const onTimeDismiss = React.useCallback(() => {
      setTimeVisible(false)
    }, [setTimeVisible]);

    /* onTimeConfirm() is called when the user confirms a selected time. It sets the hours and minutes state to the selected values, 
    converts the selected time to a formatted string with AM/PM designation, sets the timeVisible state to false, and sets the timeLabel state to the formatted string. */
  
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
            
            <Text style={{marginTop: 5, marginLeft: 5,}}>Date Found:</Text>
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
                locale="en"
              />
              <TimePickerModal
                visible={timeVisible}
                onDismiss={onTimeDismiss}
                onConfirm={onTimeConfirm}
                hours={12}
                minutes={14}
              />
            </View>

            <Text style={{marginTop: 5, marginLeft: 5,}}>Location:</Text>
            <TouchableOpacity style = {styles.locationButton} onPress={ () => setConfirmVisible(true)}>
              <Text style={styles.buttonText}>
                {location}
              </Text>
            </TouchableOpacity>

            <LocationPickerModal
                visible={confirmVisible}
                onCancel={(location) => { setSelectedLocation(location); handleConfirmLocation(); setConfirmVisible(false);}}
            />

            <View style={{height: 1, width: width, backgroundColor: 'gray', marginVertical: height * 0.04}}/>

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

export default FoundUploadScreen;

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
      borderRadius: 2,
      backgroundColor: '#ffffff',
      padding: 5,
      marginVertical: 10,
      marginHorizontal: 15,
    },
    textArea: {
      height: height * 0.08,
      width: width * 0.8,
      justifyContent: "flex-start"
    },
    titleTextInput: {
      width: width * 0.8,
      justifyContent: "flex-start"
    },
    dateHandler: {
      justifyContent: 'space-between',
      alignContent: 'flex-start',
      flexDirection: 'row',
    },
    dateButton: {
      borderRadius: 8,
        width: 150,
        height: 50,
        backgroundColor: '#687089',
        alignItems:'center',
        justifyContent:'center',
        marginLeft: 15,
        marginVertical: 10,
    },
    locationButton: {
      borderRadius: 8,
      width: 150,
      height: 50,
      backgroundColor: '#687089',
      alignItems:'center',
      justifyContent:'center',
      marginVertical: 10,
      marginHorizontal: 15,
    },
    mapWindowMobile: {
      width: width * 2,
      height: (width / 1.19) * 2, //1.19 is image height compared to width.
      alignSelf: 'center',
    },
    mapWindowWeb: {
      width: width, //1.19 is image height compared to width.
      height: (width / 1.19), 
      alignSelf: 'center',
    },
    campusMap: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      backgroundColor: '#000',
    },
    modalWindow: {
      alignSelf: 'center',
      alignContent: 'center',
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      backgroundColor: 'rgba(	0, 0, 0, 0.8)',
    },
    confirmButton: {
      borderRadius: 3,
      width: 150,
      height: 50,
      backgroundColor: '#687089',
      alignItems:'center',
      justifyContent:'center',
      alignSelf: 'center',
      marginVertical: 20,
      marginHorizontal: 5,
    },
    pinImage: {
      position: 'absolute',
      width: 40,
      height: 40,
    },
    mapSliderMobile: {
      width: '100%',
    },
    mapSliderWeb: {
      height: '100%',
      width: '100%',
      marginTop: 25,
    },
    confirmButtonWindow: {
      backgroundColor: 'rgba(	0, 0, 0, 0.8)'
    }
})