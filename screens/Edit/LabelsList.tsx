import React, {useState} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import {useStore} from '../../store/store';

export default function LabelsList() {
  const {labels, activeLabels, setActiveLabels, setLabels, setState} =
    useStore();
  const [editItemId, setEditItemId] = useState<number | null>(null); //mark label like edited
  const [text, setText] = useState('');

  const handleEdit = () => {
    //set edited text as label text
    const res = labels.map((item, index) =>
      index === editItemId ? text : item,
    );
    setLabels(res);
  };

  const select = (item: string) => {
    if (activeLabels.includes(item)) return;
    setActiveLabels([...activeLabels, item]);
    setState('download', false);
    setState('save', false);
  };

  return (
    <View style={styles.labels}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={item => item}
        data={[...labels, '+']}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.label}
              onPress={() => {
                if (index === labels.length)
                  return setLabels([...labels, 'new label']);
                select(item.toLowerCase());
              }}
              onLongPress={() => {
                if (index === labels.length) return;
                setText(item);
                setEditItemId(index);
              }}>
              {editItemId === index ? (
                <TextInput
                  autoCapitalize="none"
                  onChangeText={text => setText(text)}
                  onBlur={() => {
                    setEditItemId(null);
                    handleEdit();
                  }}
                  value={text}
                  autoFocus
                />
              ) : (
                <Text>{item}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    width: '100%',
    height: 50,
    padding: 6,
    backgroundColor: '#262626',
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 8,
    backgroundColor: '#ffff33',
    marginRight: 16,
  },
});
