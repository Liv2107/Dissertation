import React from 'react';
import { View, Text, FlatList, StyleSheet, Linking, Image } from 'react-native';


interface Shade {
    brand: string;
    name: string;
    imgSrc: string;
    url: string;
  }
  
  // Define the type for the props that will be passed to Results component
  interface ResultsProps {
    result: Shade[];  // result is an array of Shade objects
  }
  
  const Results: React.FC<ResultsProps> = ({ result }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Top 20 Closest Shades</Text>
  
        <FlatList
          data={result}  // Result will be an array of Shade objects
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {/* Displaying Image */}
              <Image source={{ uri: item.imgSrc }} style={styles.image} />
  
              {/* Brand and Name */}
              <Text style={styles.text}>Brand: {item.brand}</Text>
              <Text style={styles.text}>Name: {item.name}</Text>
  
              {/* Linking URL */}
              <Text style={styles.url} onPress={() => Linking.openURL(item.url)}>
                URL: {item.url}
              </Text>
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
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    row: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    url: {
        color: 'blue',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default Results;