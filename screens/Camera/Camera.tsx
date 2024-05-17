import React, {useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';
import {
  Camera,
  useCameraPermission,
  useMicrophonePermission,
  useCameraDevice,
} from 'react-native-vision-camera';
const CameraScreen = () => {
  const {hasPermission, requestPermission} = useCameraPermission(); //Camera permission hook
  const {
    hasPermission: hasMicroPermission,
    requestPermission: requestMicroPermission,
  } = useMicrophonePermission(); //Microphone permission hook
  const device = useCameraDevice('back');
  useEffect(() => {
    if (!hasPermission) requestPermission(); //request camera permission
    if (!hasMicroPermission) requestMicroPermission(); //request microphone permission
  }, [hasPermission, hasMicroPermission]);

  if (!device) return Alert.alert('Error!', 'Camera not found!');

  return (
    <Camera style={styles.camera} device={device} isActive={true}></Camera>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
