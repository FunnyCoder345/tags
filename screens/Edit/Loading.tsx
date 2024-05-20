import React from 'react';
import {Image, View, StyleSheet, Text} from 'react-native';

export default function Loading() {
  return (
    <View style={styles.section}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={require('../../assets/images/time.png')}
      />
      <Text>Loading ...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  section: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 275,
    height: 220,
  },
});
