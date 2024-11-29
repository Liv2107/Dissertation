import PhotoPreview from './PhotoPreview.js';

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');

  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  // Testing comment for version control.

  useEffect(() => {
    if(permission == null){
      requestPermission();
    }
  }, [permission]);

  if(!permission){
    return <View />;
  }
  if(permission && !permission.granted){

    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission"/>
      </View>
    );
  }

  function toggleCameraFacing(){
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  const captureImage = async () => {

    if(cameraRef.current){

      const options = {quality: 1, base64: true, exif: true};
      const currentPhoto = await cameraRef.current.takePictureAsync(options);

      setPhoto(currentPhoto); // new photo has been set.
    }
  };
  const recaptureImage = () => setPhoto(null);

  if(photo){
    return <PhotoPreview photo={photo} recaptureImage={recaptureImage} photoDataAllocation={photoDataAllocation}/>
  }

  function photoDataAllocation(){
    // assigning the photo to the database and produce results screen.

    if(photo != null){

      //database

      //ResultsScreen(); - show results (products).
    }
  }

  return (

    <View style={styles.container}>

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={captureImage}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    height: 75,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});