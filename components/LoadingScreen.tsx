import React, { useEffect, useRef } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Animated, Easing } from 'react-native';

const LoadingScreen = () => {

    const progress = useRef(new Animated.Value(0)).current;
    const bounceValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 100,
            duration: 4500, // 4.5 seconds
            useNativeDriver: false,
        }).start();

        const bounceUp = Animated.timing(bounceValue, {
            toValue: -15,
            duration: 300, 
            useNativeDriver: true,
        });

        const bounceDown = Animated.timing(bounceValue, {
            toValue: 0, 
            duration: 300, 
            easing: Easing.ease, 
            useNativeDriver: true,
        });

        Animated.loop(
            Animated.sequence([bounceUp, bounceDown]) // Repeat bounceUp and bounceDown sequence
        ).start();
    }, []);

    const barWidth = progress.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });
 
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.barContainer}>
                <Animated.Image 
                    source={require('@/assets/images/white_beauty_blender.png')} 
                    style={[styles.image, { transform: [{ translateY: bounceValue }] }]} // Apply bouncing effect
                />
                <View style={styles.bar}>
                    <Animated.View style={[styles.progress, { width: barWidth }]} />
                </View>

                <Text style={styles.loadingText}>Finding results...</Text>

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
    barContainer: {
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        position: 'relative',
    },
    image: {
        top: -10,
        position: 'relative',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bar: {
        height: 20,
        width: '60%',
        overflow: 'hidden',
        borderRadius: 15,
        backgroundColor: 'lightgray',
    },
    progress: {
        width: '1%',
        height: 20,
        backgroundColor: 'white',
        borderRadius: 15, 
    },
    loadingText: {
        fontSize: 8,
        marginTop: 6,
        color: 'white',
        textAlign: 'center',
    },
});

export default LoadingScreen;