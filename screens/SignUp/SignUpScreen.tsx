import React, { useEffect, useState } from 'react'
import { StyleSheet,ScrollView, Text, KeyboardAvoidingView, Platform, View, TextInput, ActivityIndicator, Pressable, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEmpty from 'react-native-vector-icons/AntDesign';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../store/auth';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';
import { IOS_ID, ANDROID_ID } from '@env';
import * as Google from "expo-auth-session/providers/google";
import { useIsFocused } from '@react-navigation/native';
interface IFormInput {
  email: string;
  password: string;
  name: string;
}

export default function SignUpScreen({navigation}: {navigation: any}) {
  const isFocused = useIsFocused();
  const {  user, error, loading, setLoading, setError,createUser,signUp,  } = useAuth()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);//state of showing password
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);//state of showing password

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '' 
    }
  });
  const email = watch("email");
  const password = watch("password");

  const [_, response, promptAsync] = Google.useAuthRequest({//google hook for google auth
      iosClientId: IOS_ID,
      androidClientId: ANDROID_ID,
  })
useEffect(()=>{
  if(!isFocused) return;
  if(response?.type === 'success') {
    const res = GoogleAuthProvider.credential(response.params.id_token)
    signInWithCredential(auth, res)//chain of functions to connect google modal, get token, then get data and logn user in firebase
  }
}, [response,isFocused])

useEffect(()=>{
  if(!isFocused) return;
  if(user) return;
  console.log('registration useEffect')
  onAuthStateChanged(auth,(userData)=>{//after user authenticated by google create user at the firebase
    try {
      if(!userData)  throw new Error('no user ')
      const data = {
      id:userData.uid,
      name: userData.displayName,
      email: userData.email,
      }
      createUser(data)
      } catch(error) {
          console.log(error, 'google auth error')
      }
    })
  },[isFocused])

  useEffect(()=> {
    if(!isFocused) return;
    if(user) navigation.navigate('Login')
    if(error) setLoading(false);
  },[user, error,isFocused])

  useEffect(()=>{
    if(!isFocused) return;
    setError('')
  },[email,password,isFocused])
  
  const Registation: SubmitHandler<IFormInput> = async (data) => {
    signUp(data.email, data.password, data.name)
  }
  const googleAuth = async () => await promptAsync()
  const appleAuth = async () => {await promptAsync()}

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}
    >
      <ScrollView>
        <View style={styles.content}>

          <Text style={styles.label}>ITag</Text>
          <Text style={styles.description}>Create new account</Text>
          <View style={styles.box}>
            <Controller
                control={control}
                rules={{
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name should be at least 3 characters long',
                  }
                }}
                
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                  
                    placeholder="Name"
                    style={styles.emailInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    textContentType='oneTimeCode'
                  />
                )}
                name="name"
              />
              {errors.name && <Text  style={styles.error}>{errors.name.message}</Text>}
          </View>
          <View style={styles.box}>
            <Controller
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email"
                    style={styles.emailInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    textContentType='oneTimeCode'
                    autoComplete="email"
                  />
                )}
                name="email"
              />
              {errors.email && <Text  style={styles.error}>{errors.email.message}</Text>}
              {error && !errors.email && <Text  style={styles.error}>{error}</Text>}

          </View>
          <View style={styles.box}>
            <Controller
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password should be at least 6 characters long'
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
                    message: 'Week password'
                  }
                }}
                    render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.input}>
                    <Icon 
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      name={!isPasswordVisible ? 'eye-slash' : 'eye'} 
                      size={24} style={styles.icon} 
                      color="grey"
                    />
                    <TextInput
                      style={styles.textInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!isPasswordVisible}
                      placeholder='Password'
                      autoComplete="password"
                      autoCapitalize="none"
                    />
                  </View>
                )}
                name="password"
              />
              {!errors.password && <Text style={styles.info}>At least:  one uppercase letter, one number and one special character!</Text>}
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
          <View style={styles.box}>
              <Controller
                control={control}
                rules={{
                  required: 'Confirmation of password is required',
                  validate: value => value === password || 'The passwords do not match'
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.input}>
                  <Icon 
                    onPress={() => setIsPasswordVisible2(!isPasswordVisible2)}
                    name={!isPasswordVisible2 ? 'eye-slash' : 'eye'} 
                    size={24} style={styles.icon} 
                    color="grey"
                  />
                  <TextInput
                    style={styles.textInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!isPasswordVisible2}
                    placeholder='Confirm Password'
                  />
                </View>
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
            </View>
          {/* {!loading 
            ?<Button onPress={handleSubmit(Registation)} color='rgb(220 38 38)' title='SignUp'/>
            :<View style={styles.loader}><ActivityIndicator /></View>
          }
          {!loading 
            ?<TouchableOpacity style={styles.googleButton} onPress={googleAuth}>
              <Image style={styles.googleIcon} source={require('../../assets/images/googleIcon.png')} />
            </TouchableOpacity>
            :<View style={styles.googleLoader}><ActivityIndicator /></View>
          } */}
      <TouchableOpacity style={styles.login} onPress={handleSubmit(Registation)} >
      {!loading 
        ? <Text style={{color: 'white', fontSize: 24}}>Registration</Text>
        : <ActivityIndicator />
      }
    </TouchableOpacity>
       
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.googleButton} onPress={googleAuth}>
        {!loading 
          ?<Image style={styles.googleIcon} source={require('../../assets/images/googleIcon.png')} />
          :<ActivityIndicator style={{}}/>
        }
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.appleButton} onPress={appleAuth} >
        {!loading 
          ?<Image style={styles.appleIcon} resizeMode='contain' source={require('../../assets/images/apple.png')} />
          : <ActivityIndicator />
          }
      </TouchableOpacity>
    </View>
          <Pressable 
            style={{flexDirection: 'row', marginTop: 24, }}
            onPress={()=>navigation.navigate('Login')}
          >
            <IconEmpty
              name={'swapleft'} 
              size={28} 
              style={styles.icon2} 
            />
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  login: {
    width: '90%',
    justifyContent: 'center',
    alignItems:'center',
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
  appleIcon:{
    width: 28,
    height: 28,
  },
  googleIcon: {
    width: 40,
    height: 40,
  },
  appleButton:{
    justifyContent: 'center',
    alignItems:'center',
    width: 56,
    height: 56,
    marginTop: 20,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height:1 },
    shadowOpacity: 1,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  googleButton:{
    justifyContent: 'center',
    alignItems:'center',
    padding: 8,
    width: 56,
    height: 56,
    marginTop: 20,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height:1 },
    shadowOpacity: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  content:{
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  icon2: {
    fontWeight: '200',
  },
  loginText: {
    fontFamily:"Chalkduster",
    fontSize: 18,
  },
  loader: {
    alignItems: 'center',
    justifyContent:'center',  
    borderRadius: 100,
    height: 70,
    width: '90%',
    backgroundColor: 'rgb(220 38 38)'
  },
  googleLoader:{
    marginTop: 20,
    alignItems: 'center',
    justifyContent:'center',  
    borderRadius: 100,
    height: 70,
    width: '90%',
    backgroundColor: 'white'
  },
  info: {
    position: 'absolute',
    bottom: 0,
    fontSize: 10,
    paddingHorizontal: '5%',
    color: 'gray'
  },
  box: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    alignItems: 'center',
    paddingBottom: 24
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
  emailInput:{
    borderWidth: 1,
    borderRadius: 10,
    height: 70,
    width: '90%',
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 24,
  },
  input:{
    flexDirection:'row',
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
    fontFamily:"Chalkduster",
  },
  button: {
    alignItems: 'center',
    justifyContent:'center',

    borderRadius: 100,
    height: 70,
    width: '90%',
    backgroundColor: 'rgb(220 38 38)'
  },

  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  label: {
    fontSize: 40,
    fontFamily:"Chalkduster",
    marginBottom:10,
  },
  description: {
    fontSize: 24,
    textAlign:"center",
    fontFamily:"Chalkduster",
    marginBottom:40,
  },
  fontContainer: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily:"Chalkduster",
  },
})

