import React from 'react'
import { Image, SafeAreaView, StyleSheet, Text } from 'react-native'

export default function Loading() {
  return (
    <SafeAreaView style={styles.section}>
        <Image resizeMode='cover' style={styles.image} source={require('../../assets/images/time.png')} />
        <Text>Loading ...</Text>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    section: {
      flex: 1,
      width: '100%',
      alignItems:'center',
      justifyContent: 'center',
    },
    image:{
      width: 275,
      height: 220,
      marginBottom: 40,
    },
  })
