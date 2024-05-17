import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './screens/Login/LoginScreen';
// import SignUpScreen from './SignUp/SignUpScreen';
import HomeScreen from './screens/Home/HomeScreen';
import CameraScreen from './screens/Camera/Camera';
import EditScreen from './screens/Edit/EditScreen';
// import Image from './Image/Image';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
        {/* <Stack.Screen name="Image" component={Image} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
