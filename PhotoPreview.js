import { CameraCapturedPicture } from 'expo-camera';

import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

const PhotoPreview = ({ photo, recaptureImage }) => (
    
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image style={styles.previewContainer}
            source={{uri: 'data:image/jpg;base64,' + photo.base64}}
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={recaptureImage}>
                <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);