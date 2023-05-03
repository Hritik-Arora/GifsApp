import {
    StyleSheet, View, TextInput,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';
import GifList from '../../components/GifList';

export default function Homepage() {
  const [giphyToSearch, setGiphyToSearch] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);

  // Show a toast to user when internet connectivity is not there
  useEffect(() => {
    let prevStateWasConnected = false;
    NetInfo.addEventListener(networkState => {
      if (!networkState.isConnected) {
        prevStateWasConnected = true;
        Toast.show('Please check your internet connection', {
            duration: Toast.durations.LONG,
          });
      } else if (prevStateWasConnected) {
        prevStateWasConnected = false;
        // Refresh the data now
        setForceUpdate(true);
        setTimeout(() => {
            // Reset this flag after approx 500ms - the time taken to refresh the data
            setForceUpdate(false);
        }, 500);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
        <TextInput
            style={styles.input}
            onChangeText={setGiphyToSearch}
            value={giphyToSearch}
            placeholder="Search Giphy Here"
        />
        <GifList searchString={giphyToSearch} forceUpdate={forceUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginBottom: 30,
  },
});
