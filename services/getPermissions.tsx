import Permissions, {PERMISSIONS} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';

const getPermissions = async () => {
  if (Platform.OS === 'ios') {
    const permission = await Permissions.check(
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    );
    if (
      permission === Permissions.RESULTS.GRANTED ||
      permission === Permissions.RESULTS.LIMITED
    ) {
      return true;
    }

    const res = await Permissions.request(
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    );
    if (
      res === Permissions.RESULTS.GRANTED ||
      res === Permissions.RESULTS.LIMITED
    ) {
      return true;
    }

    if (res === Permissions.RESULTS.BLOCKED) {
      Alert.alert(
        'permission denied ',
        'Please allow access to the photo library from settings',
      );
      return false;
    }
  }
};

export default getPermissions;
