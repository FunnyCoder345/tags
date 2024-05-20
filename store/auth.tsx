import { create } from 'zustand'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { auth, database } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc, DocumentData } from "firebase/firestore"; 

interface User {
    name: string | null,
    email: string | null,
    id: string,
}

interface AuthState {
  user: User | null | DocumentData;
  error: string;
  loading: boolean;
  setLoading:(value: boolean) => void;
  setUser: (user: User | null) => void;
  setError: (error: string) => void;
  signUp: (email: string, password: string, name:string) => void;
  signIn: (email: string, password: string ) => void;
  isAuth: (navigation:any) => void;
  createUser:({name, email, id}:User) => void;
  logout: (navigation: any) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
    user: null,
    error: '',
    loading: false,
    setLoading: (status) => set((state) => ({ ...state, loading:status })),
    setUser: (user) => set((state) => ({ ...state, user })),
    setError: (error) => set((state) => ({ ...state, error })),//set errors from server
    logout: async  () => {
        console.log('logout')
        await signOut(auth).then(async ()=>{
        await AsyncStorage.removeItem('authToken'); // Remove auth token from asyncStorage
        set((state) => ({ ...state, user: null }));
      }) //Feature for Signout from Firebase
    },

    signUp: async (email, password, name) => {
      console.log('registration')
      try {
        set((state) => ({ ...state, loading: true}))

        const response = await createUserWithEmailAndPassword(auth, email, password)//Firebase feature for creating users by email and password
        
        const newDocument = doc(database, 'users', response.user.uid)//creating new user in database
        await setDoc(newDocument, {name, email, id: response.user.uid});

        const createdUser  = (await getDoc(newDocument)).data();//get created user data
        if(!createdUser) throw Error('User wasnt created')
        console.log(createdUser, 'created user')

        const user = {
          name: createdUser.name,
          email: createdUser.email,
          id: createdUser.id,
        }
        const expiryTime = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;//Time when token will be expired, current date + 1 day
        const tokenData = JSON.stringify({ token: user.id, expiryTime });
        await AsyncStorage.setItem('authToken', tokenData);//Set uid as access token, tokel will expired in 24 hours

        set((state) => ({ ...state, user:user ,loading: false, error:'' }))

      } catch (error: unknown) {
        console.log(error, 'error');
        if (error instanceof Error) {
          (error.message === 'Firebase: Error (auth/email-already-in-use).')//Handle errors, Firebase have only one error message
          ? set((state) => ({ ...state, error: 'email already in use' }))//if email is exists
          : set((state) => ({ ...state, error: 'FireBase error, try later' }))//if other error
        } else {
          console.error('Unknown error:', error);
        }

      }
    },

    createUser: async (user) => {
      console.log('create user')
      set((state) => ({ ...state, loading: true }))
      const newDocument = doc(database, 'users', user.id)//creating new user in database
        await setDoc(newDocument, {name: user.name, email: user.email, id: user.id});

        const createdUser  = (await getDoc(newDocument)).data();//get created user data
        if(!createdUser) throw Error('User wasnt created')
        console.log(createdUser, 'created user')

        const newUser = {
          name: createdUser.name,
          email: createdUser.email,
          id: createdUser.id,
        }

      const expiryTime = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;//Time when token will be expired, current date + 1 day
      const tokenData = JSON.stringify({ token:newUser.id, expiryTime });
      await AsyncStorage.setItem('authToken', tokenData);//Set uid as access token, tokel will expired in 24 hours
      //create user in database
      
      set((state) => ({ ...state, user: newUser, error:'', loading: false }))
    },
    signIn: async ( email, password ) => {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password)//Login with firebase hook
        
        const expiryTime = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;//set data of creating token
        const tokenData = JSON.stringify({ token: response.user.uid, expiryTime });
        await AsyncStorage.setItem('authToken', tokenData);//set uid as access token, tokel will expired in 24 hours

        set((state) => ({ ...state, user: {name: response.user.displayName, email: response.user.email, id: response.user.uid } }))
      } catch (error:any) {
        (error.message === 'Firebase: Error (auth/invalid-credential).')
            ? set((state) => ({ ...state, error: 'Wrong data' }))//if wrond email or password
            : set((state) => ({ ...state, error: 'FireBase error, try later' }))
      }
    },
    isAuth: async (navigation: any)=>{//We check here if phone has a token from user and is token not expitred
      try {
          const tokenData = await AsyncStorage.getItem('authToken');
          
          //get token from storage
          if (tokenData !== null) {
            const { token, expiryTime } = JSON.parse(tokenData);
            if (new Date().getTime() > expiryTime) {//check if token expired
                console.log('Token expired');
                await AsyncStorage.removeItem('authToken');//delete token, navigate to login
                return navigation.navigate('Login');
            }

            const user = get().user //check if user exists in local store
            if(user) return;

            const userFromDb = (await getDoc(doc(database, "users", token))).data();
            set((state) => ({ ...state, user: userFromDb}))
            navigation.navigate('Home');
          }
          navigation.navigate('Login');
      } catch (error) {
          console.error('Failed to fetch the token.', error);
          navigation.navigate('Login');
      }
    },
}))