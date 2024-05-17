import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
    text: string;
    setText:(text:string) => void;
    color?: string;
    placeholder?: string;
    style?: any
}
export default function SearcInput({text, setText, color, placeholder, style }:Props) {
  return (
    <View style={[styles.container,style]}>
      <Icon name='search' size={24} color='rgb(161 161 170)' style={styles.icon} />
      <TextInput 
          autoCapitalize='none'
          placeholder={placeholder}
          style={[styles.input,  { backgroundColor:color }]} 
          value={text} 
          onChangeText={setText} 
        />
    </View>
  )
}
const styles = StyleSheet.create({
  icon:{
    marginHorizontal: 20,
  },
  container: {
    borderWidth: .5,
    borderColor: '#3d3d3d',
    flexDirection: 'row',
    alignItems:'center',
    width: '90%',
    borderRadius: 100,
  },
  input:{
    paddingVertical: 12,
    paddingRight: 40,
    fontSize: 16,
  },
})