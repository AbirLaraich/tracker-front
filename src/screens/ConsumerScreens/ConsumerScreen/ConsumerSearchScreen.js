import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import ModalScreen from '../modal/ModalScreen';

const ConsumerSearchScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanData, setScanData] = useState();
  const [status, setStatus] = useState(false);
  const [product, setProduct] = useState();
  const [blockchainData, setBlockchainData] = useState();

  let apiUrl = "https://tracker-api-production-27cf.up.railway.app/api/product/qrcode"

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permissions to app.</Text>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanData(data);
    axios.post(apiUrl, data, 
      {
        headers: {
          'Content-Type': 'text/plain'
        }
      }
    )
    .then((response) => {
      if (response.status === 200) {
        setProduct(prevProduct => ({
          ...prevProduct,
          ...response.data
        }));
        setStatus(true);
        axios.get(`http://192.168.1.227:3010/data/${response.data.numLot}`)
          .then(response => {
            setProduct(prevProduct => ({
              ...prevProduct,
              ...response.data
            }));
          }) 
      }
    })
    
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
      />
      {scanData && <Button title='Scan Again?' onPress={() => setScanData(undefined)} />}
      <StatusBar style="auto" />

      { status && <ModalScreen setStatus={ setStatus } product={product} /> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConsumerSearchScreen;
