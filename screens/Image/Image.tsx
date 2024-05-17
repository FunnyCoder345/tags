import React, {useState} from 'react';
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useStore} from '../../store/store';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Feather';
import * as FileSystem from 'expo-file-system';

export default function Image({navigation}: {navigation: any}) {
  const [like, setLike] = useState(false); //likes state
  const {activeImage, deleteImage, setActiveImage, setActiveTags} = useStore();
  if (!activeImage) return navigation.navigat('Home'); //check if we deleted image

  const savePhoto = async () => {
    //save photo at device
    if (!activeImage) return;
    const directory = FileSystem.cacheDirectory || 'images';
    const fileUri = directory + new Date();
    console.log('starting downloading');
    const downloadReusable = FileSystem.createDownloadResumable(
      activeImage.url,
      fileUri,
      {},
    );
    const res = await downloadReusable.downloadAsync();
    Alert.alert('Image saved');

    console.log('Download complete,', res?.uri);
  };
  const removePhoto = () => {
    // deleteImage(activeImage.id)
    // setActiveImage(null)
    // setActiveTags([])
    // navigation.navigate('Home')
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.header}>
        <Icon
          onPress={() => navigation.navigate('Home')}
          name="chevron-left"
          size={24}
          color="white"
          style={styles.backIcon}
        />
        <Text>photo</Text>
        <View style={{width: 16}}></View>
      </View>
      <View style={styles.imageContainer}>
        <ImageBackground
          resizeMode="contain"
          style={styles.image}
          source={{uri: activeImage?.url}}
        />
      </View>
      <View style={styles.buttons}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={() => setLike(!like)}>
            <Icon2
              name={like ? 'heart' : 'heart-o'}
              size={24}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={savePhoto}>
            <Icon3 name="download" size={24} style={styles.backIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => shareAsync(activeImage.url)}>
            <Icon3 name="share-2" size={24} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={removePhoto}>
          <Icon3 name="trash-2" size={24} style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.description}>
        <Text>Description: </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  description: {
    paddingHorizontal: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  backIcon: {
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
    borderBottomColor: '#bdbbbb',
    borderBottomWidth: 0.5,
  },
  imageContainer: {
    height: '70%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
