import {
    StyleSheet, FlatList, Image, TouchableOpacity, View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';
import * as ScreenOrientation from 'expo-screen-orientation';
import lodash from 'lodash';
import { GifController } from '../../controllers/GifController';
import { getUpdatedGifsForLandscape } from '../../utils/orientation';

const GIF_SEARCH_LIMIT = 30;

export default function GifList(props) {
  const { searchString, forceUpdate } = props;
  const [gifs, setGifs] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);
  const [currentOrientation, setCurrentOrientation] = useState('portrait');

  useEffect(() => {
    let subscription;
    subscription = ScreenOrientation.addOrientationChangeListener((event) => {
        if (
            event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT
            || event.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        ) {
            setCurrentOrientation('landscape');
        } else {
            setCurrentOrientation('portrait');
        }
    });
    // Cleanup function to remove the listener attached above
    return () => {
        ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const getSearchedGifAndSetState = useCallback(lodash.debounce((stringToSearch, limit) => {
    GifController.getSearchedGif(stringToSearch, limit).then((data) => {
        setGifs(data);
    }).catch(() => {
        Toast.show('Please check your internet connection', {
            duration: Toast.durations.LONG,
          });
    });
  }, 100), []);

  const getGifsAndSetState = useCallback((limit) => {
    GifController.getTrendingGif(limit).then((data) => {
        setGifs(data);
    }).catch(() => {
        Toast.show('Please check your internet connection', {
            duration: Toast.durations.LONG,
          });
    });
  }, []);

  // Upon the first render, load the page with trending GIFs - 20 at a time
  useEffect(() => {
    getGifsAndSetState(GIF_SEARCH_LIMIT);
  }, [getGifsAndSetState]);

  const loadMoreGifs = useCallback(() => {
    if (searchString) {
        // If there is something in search box, show results related to that only
        getSearchedGifAndSetState(searchString, gifs?.length + GIF_SEARCH_LIMIT);
    } else {
        getGifsAndSetState(gifs?.length + GIF_SEARCH_LIMIT);
    }
  }, [gifs?.length, getGifsAndSetState, getSearchedGifAndSetState, searchString]);

  useEffect(() => {
    if (searchString) {
        getSearchedGifAndSetState(searchString, GIF_SEARCH_LIMIT);
    } else {
        getGifsAndSetState(GIF_SEARCH_LIMIT);
    }
  }, [getSearchedGifAndSetState, searchString, getGifsAndSetState]);

  useEffect(() => {
    if (forceUpdate) {
        if (searchString) {
            getSearchedGifAndSetState(searchString, GIF_SEARCH_LIMIT);
        } else {
            getGifsAndSetState(GIF_SEARCH_LIMIT);
        }
    }
  }, [forceUpdate, getSearchedGifAndSetState, searchString, getGifsAndSetState]);

  const renderSingleGifItem = useCallback((item, halfWidth = false) => {
    return (
        <TouchableOpacity
        onPress={() => {
            if (selectedGif === item.url) {
                setSelectedGif(null);
            } else {
                setSelectedGif(item.url);
            }
        }}
        style={styles.gifItem}
        >
            <Image
                source={{
                    uri: selectedGif === item.url ? item.url : item.staticImage.url,
                }}
                style={{
                    width: halfWidth ? '50%' : '100%',
                    aspectRatio: +item.staticImage.width / +item.staticImage.height,
                }}
            />
        </TouchableOpacity>
    );
  }, [selectedGif]);

  const renderGifItem = useCallback(({ item }) => {
    if (currentOrientation === 'portrait') {
        return renderSingleGifItem(item);
    }
    return (
        <View style={styles.landscapeGifContainer}>
            {renderSingleGifItem(item[0], true)}
            {item[1] ? renderSingleGifItem(item[1], true) : null}
        </View>
    );
    }, [renderSingleGifItem, currentOrientation]);

  return <FlatList
            data={currentOrientation === 'portrait' ? gifs : getUpdatedGifsForLandscape(gifs)}
            onEndReached={loadMoreGifs}
            renderItem={renderGifItem}
            // keyExtractor={(item) => item.url}
            initialNumToRender={5}
            // removeClippedSubviews
            // getItemLayout={(data, index) => (
            //     {length: 50, offset: 50 * index, index}
            //   )}
        />;
}

const styles = StyleSheet.create({
  gifItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  landscapeGifContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  }
});
