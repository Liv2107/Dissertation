import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react'
import { Text, TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

const PhotoPreview = ({
    photo,
    recaptureImage,
    backend
}: {
    photo: CameraCapturedPicture;
    recaptureImage: () => void;
    backend: () => void;
}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewConatiner}
                source={{uri: 'data:image/jpg;base64,' + photo.base64}}
            />
        </View>


        <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.button} onPress={backend}>
                <Text style={styles.buttonText}>Find results</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={recaptureImage}>
                <Fontisto name='trash' size={30} color='black' />
            </TouchableOpacity>

        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        height: '65%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: "center",
    },
    previewConatiner: {
        width: '95%',
        height: '95%',
        borderRadius: 15
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        width: '45%',
        alignSelf: 'center',
    },
    button: {
        height: 50,
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default PhotoPreview;