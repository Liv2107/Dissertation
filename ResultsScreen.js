import PhotoPreview from './PhotoPreview.js';

import React from 'react';
import { Text, TouchableOpacity, SafeAreaView, Image, View, StyleSheet } from 'react-native';

const ResultsScreen = ({photo}) => {

    // photos - the chosen final photo.
    if(photo){
        savePhoto(photo);
    }

    // the return is after the matched shades are found.
    return (
        <SafeAreaView>

        </SafeAreaView>
    );
}
function savePhoto(photo){
    // the photo now needs to be sent to the linked database - ImageCaptureHub.
}
function confirmPhoto(){

    // Then the photo should be passed through our backend development with python.
    // once an output is recieved the search function is called and the output is passed.
    search(outputMatches);

}
function search(outputMatches){

    outputMatches.array.forEach(shade => {
        // display all of the output shades, URL and names.
        // User should be able to filter through brand names and click a url to be directed to purchasing the product.
    });
}
const styles = StyleSheet.create({

});