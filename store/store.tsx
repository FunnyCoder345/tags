import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {create} from 'zustand';
import {database, storage} from '../firebase';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import {useAuth} from './auth';
import {Alert} from 'react-native';

interface Image {
  id: string;
  url: string;
  tags: string[];
  userId: string;
}
interface IStore {
  photo: any;
  activeImage: Image | null;
  labels: string[];
  activeLabels: string[];
  searchTags: string[];
  activeTags: string[];
  images: Image[];
  download: boolean;
  save: boolean;
  waitLabels: boolean;
  loading: boolean;
  status: string;
  setState: (type: string, data: string | number | boolean) => void;
  setStatus: (status: string) => void;
  setPhoto: (data: any) => void;
  setActiveImage: (data: Image | null) => void;
  saveImage: (uri: string, navigation: any) => void;
  setLabels: (data: string[]) => void;
  setActiveTags: (data: string[]) => void;
  setActiveLabels: (data: string[]) => void;
  setWaitLabels: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getImages: (searching: string, items?: number) => void;
  deleteImage: (id: string) => void;
}
export const useStore = create<IStore>(set => ({
  photo: null,
  labels: [],
  activeLabels: [],
  activeTags: [],
  searchTags: [],
  images: [],
  activeImage: null,
  waitLabels: false,
  loading: false,
  status: '',
  download: false,
  save: false,
  setState: (type, data) => set(state => ({...state, [type]: data})),
  setStatus: status => set(state => ({...state, status})),
  setPhoto: photo => set(state => ({...state, photo})),
  setActiveImage: activeImage => set(state => ({...state, activeImage})),
  setWaitLabels: waitLabels => set(state => ({...state, waitLabels})),
  setLoading: loading => set(state => ({...state, loading})),
  setLabels: labels => set(state => ({...state, labels})),
  setActiveTags: activeTags => set(state => ({...state, activeTags})),
  setActiveLabels: activeLabels => set(state => ({...state, activeLabels})),
  saveImage: async (uri, navigation) => {
    const {user} = useAuth.getState(); //get user info
    const labels = useStore.getState().activeLabels; //get active labels

    const response = await fetch(uri); //get image
    const blob = await response.blob(); //create blob from image just for better transferring data

    const storageRef = ref(storage, 'ITag/' + new Date().getTime()); //create storage path
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed', //function that working while the image is loading
      snapshot =>
        console.log(
          'Progress:',
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          '%',
        ), //show percents of downloading image
      error => console.log(error, 'error downloading photo'),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          try {
            if (!user) return;
            console.log('image save start');
            addDoc(collection(database, 'images'), {
              //create record in database
              userId: user.id,
              url: downloadURL,
              tags: labels,
            });
            console.log('image saved');
            Alert.alert('Save Successful', `Photo saved to your Photo gallery`);
            set(state => ({...state, loading: false, save: true}));
            navigation.navigate('Home');
          } catch (error) {
            console.log(error, 'error uploading video');
          }
        });
      },
    );
  },
  deleteImage: async id => {
    try {
      const docRef = doc(database, 'images', id);
      await deleteDoc(docRef);
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  },
  getImages: async (searching, items = 15) => {
    const {user} = useAuth.getState(); ///get user data

    try {
      if (!user) return;
      console.log('get images start');
      //creating query request of images, limit of imageas also searching words for tags
      const q =
        searching.trim() !== ''
          ? query(
              collection(database, 'images'),
              where('userId', '==', user.id),
              where('tags', 'array-contains', searching.toLowerCase()),
              limit(5),
            )
          : query(
              collection(database, 'images'),
              where('userId', '==', user.id),
              limit(items),
            );
      const querySnapshot = await getDocs(q);
      const images: Image[] = [];

      querySnapshot.forEach(doc => {
        images.push({
          id: doc.id,
          url: doc.data().url,
          tags: doc.data().tags,
          userId: doc.data().userId,
        });
      });

      const tags = images.map(item => item.tags).flat();
      const searchTags: string[] = Array.from(new Set(tags));
      set(state => ({...state, images, searchTags}));
    } catch (error) {
      console.log(error);
    }
  },
}));
