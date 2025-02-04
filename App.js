import PhotoPreview from './PhotoPreview.js';
import ResultsScreen from './ResultsScreen.js';

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';

//import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
//import { StatusBar } from 'expo-status-bar';

export default function App() {

  const { isGranted, requestPermission } = useCameraPermission();
  const devices  = useCameraDevices()
  const [device, setDevice] = useState(null);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);


  //const device = useCameraDevice(facing === 'back' ? 'back' : 'front'); // finding the device being used.



  useEffect(() => {
    (async () => {
      if (!isGranted) {
        await requestPermission();
      }
    })();
  }, [isGranted]);


  useEffect(() => {
    if(devices.back && !device) {
      setDevice(devices.back);
    }
  }, [devices, device]);


  if (!isGranted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (!devices || !devices.back || !devices.front) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No camera device found</Text>
      </View>
    );
  }


  function toggleCameraFacing() {
    if (!devices?.back || !devices?.front) return;
    setDevice((current) => (current === devices.back ? devices.front : devices.back));
  }


  const captureImage = async () => { // used to pause excecution using the await command.

    if (cameraRef.current) {

      try {
        const photo = await cameraRef.current.takePhoto();
        setPhoto(photo);

      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };


  const recaptureImage = () => setPhoto(null);

  if(!device){
    return(
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera...</Text>
      </View>
    )
  }

  if(photo){
    return <PhotoPreview photo={photo} recaptureImage={recaptureImage}/>
  }

  return (

    <View style={styles.container}>

      <Camera style={styles.camera} ref={cameraRef} device={device} isActive={true} photo={true}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={captureImage}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>

      </Camera>
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
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    padding: 15,
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