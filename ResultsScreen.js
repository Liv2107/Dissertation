import PhotoPreview from './PhotoPreview.js';

import React from 'react';
import { Text, TouchableOpacity, SafeAreaView, Image, View, StyleSheet } from 'react-native';

const ResultsScreen = ({photo}) => {

    // photos - the chosen final photo.
    if(photo){
        // call find hex from model.py
    }

    // the return is after the matched shades are found.
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.table}>
                <View style={styles.table_head}>
                    <View style={{width:'50%'}}>
                        <Text style={styles.table_captions}>Image</Text>
                    </View>
                    <View style={{width:'20%'}}>
                        <Text style={styles.table_captions}>Name</Text>
                    </View>
                    <View style={{width:'30%'}}>
                        <Text style={styles.table_captions}>Link</Text>
                    </View>
                </View>

            </View>

        </SafeAreaView>
    );
}
function savePhoto(photo){
    // the photo now needs to be sent to the linked database - ImageCaptureHub.
}


const styles = StyleSheet.create({
    container: {
        justifyContext: 'center',
        alignItems: 'center',
        flex: 1,
    },
    table: {
        margin: 15,
    },
    table_head: {
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        padding: 10,
    },
    table_captions: {
        color: 'black',
    }
});