import PhotoPreview from '@/components/PhotoPreview';
import Results from '@/components/Results';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';


export default function Camera() {

    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [photo, setPhoto] = useState<any>(null);
    const cameraRef = useRef<CameraView | null>(null);
    const [result, setResult] = useState(null);
    const router = useRouter();



    // Pre-processing image before sending to the back-end server.
    const cropImage = async (uri: string) => {
      try {
        const h = 600;
        const w = 600;

        const x = (photo.width / 2) - (w / 2);
        const y = (photo.height / 2) - (h / 2); // x and y points to crop the image in the center.

        // Crop the image 
        const result = await ImageManipulator.manipulateAsync(uri,
          [{ crop: { originX: x, originY: y, width: w, height: h } },],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }  // JPEG with 50% compression
        );
    
        console.log('Cropped image URI:', result.uri);
    
        // URI of the cropped image
        return result.uri;
    
      } catch (error) {
        console.error("Error cropping the image.");
        alert("Couldn't crop the image.");
        return;
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
        console.log("Error in cropping.");
        alert("Missing cropped image.")
        return;
      }
      

      const backend_url = "http://192.168.1.100:5000/top_20"; // local IP / API location.

      let photoFile;
      try {
        photoFile = await FileSystem.readAsStringAsync(croppedUri, {
          encoding: FileSystem.EncodingType.Base64,}); // Converting file into Base64, File object. (expo-file-system)

      } catch (error) {
        console.error("Error converting photo to file:", error);
        alert("Error converting photo to file. Check if URI is correct.");
        return;
      } 
    
      // Create FormData to send as POST request
      const formData = new FormData();
      formData.append("photo",  `data:image/jpeg;base64,${photoFile}`); //Base64-encoded data within a FormData object
      
    
      // Send the POST request with FormData
      fetch(backend_url, {
        method: 'POST',
        body: formData,  // Attach the FormData as the request body
      })
        .then(response => {
          console.log('Response status:', response.status); // check response code.
          if (!response.ok) {
            console.error("Failed to send the image");
            alert("Failed to send the image");
            return;
          }
          return response.json();
        })
        .then(data => {
          console.log('Server response:', data); 
          setResult(data); // Set the results.
        })
        .catch((error) => {
          console.error('Error sending image:', error);
          alert('An error occurred. Please try again.');
        });
    };

    if (result) {
      // If there are results, render the Results component and pass results from the back-end.
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

  const recaptureImage = () => {
    setPhoto(null);
    setResult(null);
  };

  if (photo) {
    return <PhotoPreview photo={photo} recaptureImage={recaptureImage} backend={backend}/>;
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={captureImage}>
            <Icon name="camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Icon name="refresh" size={24} color="white" />
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
    bottom: 150,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 10,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
  },
});