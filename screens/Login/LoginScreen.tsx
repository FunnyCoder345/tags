import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {useAuth} from '../../store/auth';
import IconEmpty from 'react-native-vector-icons/AntDesign';

import {useIsFocused} from '@react-navigation/native';

interface IFormInput {
  email: string;
  password: string;
}
export default function LoginScreen({navigation}: {navigation: any}) {
  const isFocused = useIsFocused();

  const {error, user, loading, setError, signIn, setLoading} = useAuth(); //auth store
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); //state of showing password

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    //default values of form inputs
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const email = watch('email');
  const password = watch('password');

  useEffect(() => {
    //change state of button and navigate next screen if success
    if (!isFocused) return;
    if (error) setLoading(false);
    if (user) navigation.navigate('Home');
  }, [error, user]);

  useEffect(() => {
    if (!isFocused) return;
    setError('');
  }, [email, password]);

  const login: SubmitHandler<IFormInput> = data =>
    signIn(data.email, data.password);

  const appleAuth = async () => {};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}>
      <Text style={styles.label}>Hello</Text>
      <Text style={styles.description}>Welcome to the ITag world!</Text>
      <View style={styles.box}>
        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              placeholder="Email"
              style={styles.emailInput}
              onBlur={onBlur}
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              textContentType="oneTimeCode"
              autoComplete="email"
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
        {error && !errors.email && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.box}>
        <Controller
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password should be at least 6 characters long',
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
              message: 'Week password',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.input}>
              <Icon
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                name={!isPasswordVisible ? 'eye-slash' : 'eye'}
                size={24}
                style={styles.icon}
                color="grey"
              />
              <TextInput
                style={styles.textInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!isPasswordVisible}
                placeholder="Password"
                autoComplete="password"
                autoCapitalize="none"
              />
            </View>
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.login} onPress={handleSubmit(login)}>
        {!loading ? (
          <Text style={{color: 'white', fontSize: 24}}>Log in</Text>
        ) : (
          <ActivityIndicator />
        )}
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.googleButton}
          // onPress={googleAuth}
        >
          {!loading ? (
            <Image
              style={styles.googleIcon}
              source={require('../../assets/images/googleIcon.png')}
            />
          ) : (
            <ActivityIndicator style={{}} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.appleButton} onPress={appleAuth}>
          {!loading ? (
            <Image
              style={styles.appleIcon}
              resizeMode="contain"
              source={require('../../assets/images/apple.png')}
            />
          ) : (
            <ActivityIndicator />
          )}
        </TouchableOpacity>
      </View>

      <Pressable
        style={{flexDirection: 'row', marginTop: 24}}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.loginText}>Sing Up</Text>
        <IconEmpty name="swapright" size={28} style={styles.icon2} />
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  login: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 56,
    borderRadius: 10,
    marginTop: 36,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '90%',
  },
  appleIcon: {
    width: 28,
    height: 28,
  },
  googleIcon: {
    width: 40,
    height: 40,
  },
  appleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    marginTop: 20,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  googleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: 56,
    height: 56,
    marginTop: 20,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  icon2: {
    fontWeight: '200',
  },
  loginText: {
    fontFamily: 'Chalkduster',
    fontSize: 18,
  },

  googleLoader: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 70,
    width: '90%',
    backgroundColor: 'white',
  },
  box: {
    width: '100%',
    position: 'relative',
    marginBottom: 16,
    alignItems: 'center',
    paddingBottom: 24,
  },
  error: {
    position: 'absolute',
    bottom: 0,
    color: 'red',
  },
  icon: {
    marginRight: 10,
    color: 'rgb(161 161 170)',
  },
  textInput: {
    width: '100%',
    height: '100%',
    fontSize: 24,
  },
  emailInput: {
    borderWidth: 1,
    borderRadius: 10,
    height: 70,
    width: '90%',
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 24,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 70,
    width: '90%',
    paddingLeft: 12,
    paddingRight: 40,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Chalkduster',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 100,
    height: 70,
    width: '90%',
    backgroundColor: 'rgb(220 38 38)',
  },

  container: {
    paddingHorizontal: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 40,
    fontFamily: 'Chalkduster',
    marginBottom: 20,
  },
  description: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Chalkduster',
    marginBottom: 40,
  },
  fontContainer: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Chalkduster',
  },
});
