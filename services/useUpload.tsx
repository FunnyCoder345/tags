import {analyzeImageWithOpenAI} from './getLabels';
import {Alert} from 'react-native';
import {useStore} from '../store/store';
import {launchImageLibrary} from 'react-native-image-picker';

export default function useUpload(navigation: any) {
  const {setPhoto, setLabels, setWaitLabels} = useStore();
  return async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
      Alert.alert('Error', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (!asset) return Alert.alert('No photo', 'Please, select a photo');

      setPhoto(asset);
      setWaitLabels(true);
      navigation.navigate('Edit');

      if (asset.uri && result.assets[0].base64) {
        await analyzeImageWithOpenAI(result.assets[0].base64);
      } else {
        setLabels([]);
        Alert.alert('Error', 'Selected photo has no valid URI');
      }
    }
  };
}
