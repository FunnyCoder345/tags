import React, {useState} from 'react';
import {Text, TextInput, StyleSheet, View, Pressable} from 'react-native';
import {useStore} from '../../store/store';

interface IProps {
  activeLabels: string[];
  setActiveLabels: (data: string[]) => void;
}

export default function ActiveLabelsList({
  activeLabels,
  setActiveLabels,
}: IProps) {
  const [editItemId, setEditItemId] = useState<number | null>(null); //this is mark label how editable
  const [text, setText] = useState('');
  const {setState} = useStore();
  const handleEdit = () => {
    const res = activeLabels.map((item, index) =>
      index === editItemId ? text : item,
    ); //set new text after editing
    setActiveLabels(res);
    setState('download', false);
    setState('save', false);
  };
  return (
    <View style={styles.labels}>
      {activeLabels.map((item, index) => (
        <Pressable
          key={item}
          style={styles.label}
          onPress={() => {
            setActiveLabels(activeLabels.filter(i => i !== item));
          }}
          onLongPress={() => {
            setText(item);
            setEditItemId(index);
          }}>
          <View style={styles.text}>
            {editItemId === index ? (
              <TextInput
                style={{color: 'black', fontSize: 16}}
                onChangeText={text => setText(text)}
                onBlur={() => {
                  setEditItemId(null);
                  handleEdit();
                }}
                value={text}
                autoFocus
              />
            ) : (
              <Text style={{color: 'black', fontSize: 16}}>{item}</Text>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 6,
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginBottom: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  text: {
    backgroundColor: 'white',
    fontWeight: '900',
    borderRadius: 18,
    padding: 8,
    paddingHorizontal: 16,
  },
});
