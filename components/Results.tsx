import React from 'react';
import { View, Text, FlatList, StyleSheet, Linking, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


interface Shade {
    brand: string;
    name: string;
    imgSrc: string;
    url: string;
    hex: string;
  }
  
  // Define the type for the props that will be passed to Results component
  interface ResultsProps {
    result: Shade[];  // result is an array of Shade objects
    recaptureImage: () => void;
  }
  
  const Results: React.FC<ResultsProps> = ({ result, recaptureImage }) => {


    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={(recaptureImage)}>
          <Icon name="home" size={25} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Top 20 Closest Shades</Text>
  
        <FlatList
          data={result}  // Result will be an array of Shade objects
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Display Color Square */}
              <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                <View style={[styles.colorBox, { backgroundColor: item.hex }]} />
              </TouchableOpacity>
  
              <View style={styles.textContainer}>
                {/* Brand and Name */}
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.name}>{item.name}</Text>
  
                </View>

            </View>
          )}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    marginBottom: 15,
    marginRight: 15,
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
    backgroundColor: 'darkgray',
  },
  title: {
    paddingTop: 25,
    paddingBottom: 5,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  colorBox: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 5,
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
    color: 'darkgray',
    marginBottom: 5,
  },
});

export default Results;