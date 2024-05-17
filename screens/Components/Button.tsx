import React from 'react'
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
interface Props {
    color?: string;
    onPress: () => void;
    style?: any;
    textStyle?: any;
    title: string;
}

export default function Button({onPress, color, style, textStyle, title}:Props) {
  return (
    <TouchableOpacity style={[styles.button, style,{ backgroundColor: color }]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    buttonText: {
      fontSize: 24,
      fontFamily:"Chalkduster",
    },
    button: {
      alignItems: 'center',
      justifyContent:'center',  
      borderRadius: 100,
      padding: 20,
      width: '90%',
    },

  })