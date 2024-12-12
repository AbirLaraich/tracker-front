import 'event-target-polyfill'; 
import { StyleSheet, SafeAreaView } from "react-native";
import Navigation from './src/navigation';
import { registerRootComponent } from 'expo';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
        <Navigation></Navigation>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC'
  },
});

registerRootComponent(App);
