import React from 'react';
import { View, Text, FlatList, StyleSheet, Linking, Image, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import { CameraCapturedPicture } from 'expo-camera';
import { useFonts } from 'expo-font';


interface Shade {
    brand: string;
    name: string;
    imgSrc: string;
    url: string;
    hex: string;
    product: string;
    delta_e: Double;
  }
  
  // Define the type for the props that will be passed to Results component
  interface ResultsProps {
    photo: CameraCapturedPicture;
    result: Shade[];  // result is an array of Shade objects
    goHome: () => void;
  }
  
  const Results: React.FC<ResultsProps> = React.memo(({ photo, result, goHome }) => {

    //console.log("Results component rendered", result);

    const [fontsLoaded] = useFonts({
      'Tourney-VariableFont': require('@/assets/fonts/Tourney-VariableFont_wdth_wght.ttf'),
    });

    return (
      <View style={styles.container}>


          <Pressable style={styles.button} onPress={goHome}>
            <Icon style={styles.home} name="home" size={25} color="white" />
          </Pressable>



        <Text style={styles.title}>20 Closest Shades</Text>

        <View style={styles.box}>
            <Image
                style={styles.photoContainer}
                source={{uri: 'data:image/jpg;base64,' + photo.base64}}
            />
        </View>

  
        <FlatList
          data={result}  // Result will be an array of Shade objects
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Display Color Square */}
              <TouchableOpacity onPress={() => {
                const googleSearch = `https://www.google.com/search?q=${encodeURIComponent(item.brand + ' ' + item.product)}`;
                Linking.openURL(googleSearch)}}>
                <View style={[styles.colorBox, { backgroundColor: item.hex }]} />
              </TouchableOpacity>
  
              <View style={styles.textContainer}>
                {/* Brand and Name */}
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.delta}>Delta E: {item.delta_e.toFixed(2)}</Text>
  
              </View>

            </View>
          )}
        />
      </View>
    );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(69,69,69)',
  },
  button: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    marginBottom: 15,
    marginRight: 15,
    borderRadius: 25,
    padding: 12,
    zIndex: 1,
    backgroundColor: 'rgba(231, 115, 180, 0.8)', // #E773B4 in rgb to add transparency.
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  home: {
  },
  box: {
    borderRadius: 15,
    padding: 1,
    marginBottom: 15,
    width: '95%',
    height: '40%',
    backgroundColor: 'darkgray',
    justifyContent: 'center',
    alignItems: "center",
    alignSelf: 'center',
  },  
  photoContainer: {
    width: '95%',
    height: '95%',
    borderRadius: 15
  },
  title: {
    fontFamily: 'Tourney-VariableFont', 
    fontSize: 36, 
    color: 'white', 
    textAlign: 'center',
    paddingTop: 25,
    paddingBottom: 5,
    fontWeight: 900,
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'darkgray',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
  },
  colorBox: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5, 
  },
  textContainer: {
    flex: 1,
  },
  brand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  name: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  delta: {
    fontSize: 12,
    color: 'black',
    marginBottom: 5,
  }
});

export default Results;