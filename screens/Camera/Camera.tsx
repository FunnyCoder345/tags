import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const {width} = Dimensions.get('window');
import {
  Camera,
  useCameraPermission,
  useMicrophonePermission,
  useCameraDevice,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useStore} from '../../store/store';
import RNFS from 'react-native-fs';
import {analyzeImageWithOpenAI} from '../../services/getLabels';

const CameraScreen = ({navigation}: {navigation: any}) => {
  const isFocused = useIsFocused();

  const {setPhoto} = useStore();
  const [isFront, setIsFront] = useState(false);

  const device = useCameraDevice(isFront ? 'front' : 'back');
  const camera = useRef<Camera>(null);

  const {hasPermission, requestPermission} = useCameraPermission(); //Camera permission hook
  const {
    hasPermission: hasMicroPermission,
    requestPermission: requestMicroPermission,
  } = useMicrophonePermission(); //Microphone permission hook

  useEffect(() => {
    if (!hasPermission) requestPermission(); //request camera permission
    if (!hasMicroPermission) requestMicroPermission(); //request microphone permission
  }, [hasPermission, hasMicroPermission]);

  if (!device) {
    return (
      <View>
        <Text>No camera device!</Text>
      </View>
    );
  }

  const takePick = async () => {
    const photo = await camera.current?.takePhoto();
    if (!photo)
      return Alert.alert('Error', 'Something going wrong, retake photo');
    const res = await RNFS.readFile(photo.path, 'base64');
    setPhoto({...photo, uri: photo.path});
    navigation.navigate('Edit');
    await analyzeImageWithOpenAI(res);
  };

  return (
    <View style={{flex: 1}}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        photo={true}
      />
      <Icon
        onPress={() => navigation.navigate('Home')}
        style={styles.back}
        name="angle-left"
        size={24}
        color="white"
      />
      <Icon
        onPress={() => setIsFront(!isFront)}
        name="camera-rotate"
        size={24}
        color="white"
        style={styles.swipe}
      />
      <TouchableOpacity style={styles.button} onPress={takePick}>
        <View style={styles.buttonInner} />
      </TouchableOpacity>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    width: 80,
    height: 80,
    left: width / 2 - 40, // Center horizontally
    borderRadius: 60,
    backgroundColor: 'white',
  },
  swipe: {
    position: 'absolute',
    top: 70,
    right: 30,
  },
  back: {
    position: 'absolute',
    top: 70,
    left: 30,
  },
  buttonInner: {
    backgroundColor: 'white',
    borderColor: '#001ca6',
    width: 70,
    height: 70,
    borderRadius: 60,
    borderWidth: 2,
  },
});
