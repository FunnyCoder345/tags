import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Dimensions,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import SearcInput from '../Components/SearcInput';
import {useAuth} from '../../store/auth';
import {useStore} from '../../store/store';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {useDebounce} from '../../services/useDobounse';
import useUpload from '../../services/useUpload';

export default function HomeScreen({navigation}: {navigation: any}) {
  const isFocused = useIsFocused(); //check if screen is active for use effects
  const [search, setSearch] = useState(''); //value from searching input
  const debouncedSearch = useDebounce(search); //create dobunce 1 second delay typing search
  const {user, isAuth, logout} = useAuth();

  const {
    images,
    activeTags,
    searchTags,
    getImages,
    setActiveImage,
    setActiveTags,
  } = useStore();
  const upload = useUpload(navigation);
  useEffect(() => {
    if (!isFocused) return;
    isAuth(navigation); //check if user loggined
  }, [isFocused, user]);

  useEffect(() => {
    //get images from server
    if (!isFocused) return;
    getImages(debouncedSearch, 15);
  }, [isFocused, user, debouncedSearch]);

  const setActiveTag = (item: string) => {
    //set filters by tags if we click on tag we must filter array by photos that can contain active labels
    activeTags.includes(item)
      ? setActiveTags(activeTags.filter((i: string) => i !== item))
      : setActiveTags([...activeTags, item]);
  };

  const searchFilter = () => {
    const tagImages = activeTags.length
      ? images.filter(
          (
            img: {tags: any[]}, //filter images by selected tags from tag bar
          ) => img.tags.some(tag => activeTags.includes(tag.toLowerCase())),
        )
      : images;
    return tagImages;
  };

  const openImage = (item: any) => {
    setActiveImage(item);
    navigation.navigate('Image');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearcInput
          style={styles.search}
          text={search}
          setText={setSearch}
          placeholder="Type tag name"
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => navigation.navigate('Camera')}>
            <Icon name="camera" size={30} color="#3d3d3d" />
            <Text style={styles.text}>Take a photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={upload}>
            <Text style={styles.text}>upload</Text>
            <Icon name="upload" size={30} color="#3d3d3d" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.tagBox}
        data={searchTags}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => setActiveTag(item)}
            style={activeTags.includes(item) ? styles.activeTag : styles.tag}
            key={item}>
            <Text
              style={{
                fontSize: 16,
                color: activeTags.includes(item) ? 'white' : '#3d3d3d',
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        horizontal={true}
      />
      <ScrollView style={{width: '100%'}}>
        {images.length === 0 ? (
          <View style={styles.noImages}>
            <Text>No images yet</Text>
          </View>
        ) : (
          <View style={styles.imageBox}>
            {searchFilter().map(
              (item: {url: React.Key | null | undefined}, index: number) => (
                <Pressable
                  onPress={() => openImage(item)}
                  key={item.url}
                  style={
                    index % 3 === 1 ? styles.imageMiddleItem : styles.imageItem
                  }>
                  <ImageBackground
                    source={{uri: item.url as string}}
                    style={styles.image}
                  />
                </Pressable>
              ),
            )}
          </View>
        )}
      </ScrollView>
      <Pressable onPress={() => logout(navigation)} style={styles.logout}>
        <Text style={{color: 'red'}}>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logout: {
    alignItems: 'center',
    paddingTop: 16,
  },
  header: {
    width: '100%',
    paddingHorizontal: '5%',
    borderBottomWidth: 0.5,
    borderColor: '#adadad',
  },
  noImages: {
    flex: 1,
    minHeight: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    marginTop: 2,
    marginHorizontal: 8,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  tagBox: {
    minHeight: 75,
    flexGrow: 0,
    paddingVertical: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  tag: {
    minWidth: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    alignSelf: 'flex-start',
  },
  activeTag: {
    minWidth: 60,
    backgroundColor: '#ff4294',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    alignSelf: 'flex-start',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageItem: {
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3 - 1,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  imageMiddleItem: {
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3 - 1,
    height: 150,
    marginBottom: 1,
    marginHorizontal: 1.5,
  },
  imageBox: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
  },
  button: {
    color: 'white',
  },
  search: {
    width: '100%',
    marginTop: 40,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
