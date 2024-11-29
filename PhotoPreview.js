import { Camera } from 'expo-camera';

import React from 'react';
import { Text, TouchableOpacity, SafeAreaView, Image, View, StyleSheet } from 'react-native';

const PhotoPreview = ({ photo, recaptureImage, search }) => {

    if (!photo || !photo.base64) {
        return <Text>Loading...</Text>; 
    }
    
    return (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image style={styles.previewContainer}
            source={{ uri: 'data:image/jpg;base64,' + photo.base64 }} // 'base64' - 6-bit grouped into 24-bit sequences.
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={recaptureImage}>
                <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.OKbuttonContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={search}>
                <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
    },
    box: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        width: 300,
        height: 300,
        borderRadius: 15,
    },
    buttonContainer: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    OKbuttonContainer: {
        marginTop: 10,
    },
});

export default PhotoPreview;