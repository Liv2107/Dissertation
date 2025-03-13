import React from 'react';
import { Image,SafeAreaView, StyleSheet, View } from 'react-native';


const LogoScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Image 
                    source={require('@/assets/images/Blend.jpg')} 
                    style={styles.image}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 4,
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#E773B4',
    },
    image: {
        marginTop: '40%',
        width: 250,
        height: 250,
        alignSelf: 'center',
    },
});

export default LogoScreen;