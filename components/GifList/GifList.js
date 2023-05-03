import {
    StyleSheet, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';
import lodash from 'lodash';
import { GifController } from '../../controllers/GifController';

const GIF_SEARCH_LIMIT = 30;

export default function GifList(props) {
  const { searchString, forceUpdate } = props;
  const [gifs, setGifs] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);

  const getSearchedGifAndSetState = useCallback(lodash.debounce((stringToSearch, limit) => {
    GifController.getSearchedGif(stringToSearch, limit).then((data) => {
        console.log('received data from searched string', stringToSearch)
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

  const renderGifItem = useCallback(({ item }) => (
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
                width: '100%',
                aspectRatio: +item.staticImage.width / +item.staticImage.height,
            }}
        />
    </TouchableOpacity>
  ), [selectedGif]);

  return <FlatList
            data={gifs}
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
});
