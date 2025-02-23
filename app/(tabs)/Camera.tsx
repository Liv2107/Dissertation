import PhotoPreview from '@/components/PhotoPreview';
import Results from './Results';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';


export default function Camera() {

    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [photo, setPhoto] = useState<any>(null);
    const cameraRef = useRef<CameraView | null>(null);
    const [result, setResult] = useState(null);

    const cropImage = async (uri: string) => {
      try {
        // Crop the image to a smaller size (e.g., 1024x1024 starting from the top-left corner)
        const result = await ImageManipulator.manipulateAsync(
          uri,
          [
            { crop: { originX: 0, originY: 0, width: 1024, height: 1024 } },  // Crop to a 1024x1024 square
          ],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }  // Keep it as JPEG without compression
        );
    
        console.log('Cropped image URI:', result.uri);
    
        // Return the URI of the cropped image
        return result.uri;
    
      } catch (error) {
        console.error('Error cropping image:', error);
        alert("Error");
        return null;
      }
    };

    const backend = async () => {

      console.log(photo.uri)
      console.log(photo.name)
      console.log(photo.width)
      console.log(photo.height)
    
      // Check if photo is valid
      if (!photo || !photo.uri) {
        console.error("Photo is undefined or null");
        alert("Photo is missing. Please check the photo variable.");
        return;
      }

      const croppedUri = await cropImage(photo.uri);
      if (!croppedUri) {
        console.log("no cropping");
        return; // Exit if there was an error with the image processing
      }
      
      const url = "http://192.168.1.100:5000/top_20";

      let photoFile;
      try {

        photoFile = await FileSystem.readAsStringAsync(croppedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (error) {
        console.error("Error converting photo to file:", error);
        alert("Error converting photo to file. Check if URI is correct.");
        return;
      } 
    
      // Create FormData to send as POST request
      const formData = new FormData();
      formData.append("photo",  `data:image/jpeg;base64,${photoFile}`); //Base64-encoded data within a FormData object
      
    
      // Send the POST request with FormData
      fetch(url, {
        method: 'POST',
        body: formData,  // Attach the FormData as the request body
      })
        .then(response => {
          console.log('Response status:', response.status);
          if (!response.ok) {
            console.error("Failed to send the image");
            alert("Failed to send the image");
            return;
          }
          return response.json();
        })
        .then(data => {
          console.log('Server response:', data); 
          setResult(data);
        })
        .catch((error) => {
          console.error('Error sending image:', error);
          alert('An error occurred. Please try again.');
        });
    };

    if (result) {
      // If there are results, render the Results component and pass props directly
      return <Results result={result} />;
    }

    if (!permission) {
      return <Text>Requesting camera permission...</Text>;
    }
  
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to access the camera</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      );
    }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const options = {quality: 1, base64: true};
        
        const photo = await cameraRef.current.takePictureAsync(options);
        setPhoto(photo);

      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const recaptureImage = () => setPhoto(null);

  if (photo) {
    return <PhotoPreview photo={photo} recaptureImage={recaptureImage} backend={backend}/>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={captureImage}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}> Flip </Text>
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
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});