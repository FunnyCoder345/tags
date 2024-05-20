import React from 'react';
import {Image, Text, StyleSheet, View} from 'react-native';

export default function Waiting() {
  return (
    <View style={styles.section}>
      <Image
        style={styles.robot}
        source={require('../../assets/images/robot.png')}
      />
      <Text>Wait!</Text>
      <Text>I will look what you have</Text>
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
  robot: {
    width: 160,
    height: 200,
    marginBottom: 40,
    marginLeft: 30,
  },
});
