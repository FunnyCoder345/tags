import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
interface Props {
    text: string;
    setText:(text:string) => void;
    placeholder?: string;
    isPassword?:boolean;
}
export default function Input({text, setText, placeholder,isPassword}:Props) {
  return (
    <TextInput 
        placeholder={placeholder || ''}
        style={[styles.input]} 
        value={text} 
        onChangeText={setText}
        secureTextEntry={isPassword}
    />
  )
}
const styles = StyleSheet.create({
    input:{
      borderWidth: 1,
      borderRadius: 100,
      height: 70,
      width: '90%',
      paddingLeft: 40,
      paddingRight: 40,
      fontSize: 24,
      fontFamily:"Chalkduster",
      marginBottom:40,
    },
  })