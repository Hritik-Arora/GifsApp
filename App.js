import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import Homepage from './screens/Homepage';

export default function App() {
  return (
    <RootSiblingParent>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <Homepage />
      </SafeAreaView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
});
