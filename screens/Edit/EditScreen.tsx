import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useStore} from '../../store/store';
import LabelsList from './LabelsList';
// import Waiting from './Waiting';
import ActiveLabelsList from './ActiveLabelsList';
import Loading from './Loading';
import useUpload from '../../services/useUpload';
import ViewShot from 'react-native-view-shot';
import {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import getPermissions from '../../services/getPermissions';

export default function EditScreen({navigation}: {navigation: any}) {
  const {
    // waitLabels,
    photo,
    loading,
    activeLabels,
    download,
    setState,
    setActiveLabels,
    setPhoto,
    setLabels,
    saveImage,
    setLoading,
  } = useStore();
  const viewShotRef = useRef(null); //reference on image block for taking screenshot and save it with labels
  const uploadFile = useUpload(navigation);

  const handleDownload = async () => {
    const hasPermission = await getPermissions();
    if (!hasPermission) {
      return Alert.alert('Access denied', 'No access to photo gallery');
    }
    if (download) return Alert.alert('Photo already uploaded');

    console.log('started capture');
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 0.8,
      });
      console.log('Image captured:', uri);

      const fileName = `screenshot_${new Date().toISOString()}.png`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.moveFile(uri, destPath);
      await CameraRoll.save(destPath);

      Alert.alert('Success!', 'Image saved to gallery');
      setState('download', true);
    } catch (error) {
      Alert.alert('Error!', 'Error capturing and saving image:');
    }
  };

  const handleRetake = (type: string) => {
    //take a nev photo
    setActiveLabels([]);
    setPhoto(null);
    setLabels([]);
    type === 'home'
      ? navigation.navigate('Home')
      : navigation.navigate('Camera'); //check what button we clicked
  };
  const handleSave = async () => {
    //save photo on device
    const uri = await captureRef(viewShotRef, {
      //get uri of edited picture
      format: 'png',
      quality: 0.8,
    });
    saveImage(uri, navigation); //save image service
    setLoading(true);
    setActiveLabels([]);
    setLabels([]);
    setPhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* {waitLabels && <Waiting />} */}
      {loading && <Loading />}

      {
        // !waitLabels &&
        // !loading &&
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <View style={styles.section}>
            {/* section of capturing image */}
            <ViewShot
              ref={viewShotRef}
              style={styles.imageContainer}
              options={{format: 'jpg', quality: 0.9}}>
              <View style={styles.tagsContainer}>
                {/* Choocen labels displayed on photo, liek a list of items*/}
                <ActiveLabelsList
                  activeLabels={activeLabels}
                  setActiveLabels={setActiveLabels}
                />
              </View>
              {photo && (
                <Image style={styles.image} source={{uri: photo?.uri}} />
              )}
            </ViewShot>
            {/* Lables list */}
            <LabelsList />
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={uploadFile}>
              <Text style={styles.menuItem}>Upload photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => shareAsync(photo.uri)}>
              <Text style={styles.menuItem}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDownload}>
              <Text style={styles.menuItem}>Download photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.menuItem}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleRetake('camera')}>
              <Text style={styles.menuItem}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{padding: 8}}
              onPress={() => handleRetake('home')}>
              <Text style={[styles.menuItem, {color: 'red'}]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      }
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  menuItem: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Chalkduster',
  },
  buttons: {
    paddingTop: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 8,
    alignItems: 'center',
  },
  tagsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    zIndex: 100,
    left: 5,
    right: 5,
    top: 20,
  },
  tag: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    color: 'white',
    borderRadius: 4,
  },
  section: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    backgroundColor: '#595959',
  },
  search: {marginTop: 40},
  container: {flex: 1},
});
