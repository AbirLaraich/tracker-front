import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";

const ShowProductScreen = () => {
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   fetchProductData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchProductData();
      };

      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const fetchProductData = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem('connectedUser');
      const connectedUser = JSON.parse(connectedUserString);
      const response = await fetch(`https://tracker-api-production-27cf.up.railway.app/api/products/${connectedUser.data.siret_number}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des produits :",
        error
      );
    }
  };
  
  return (
    <ScrollView style={styles.root}>
      {products.map((product) => (
        <View key={product.id} style={styles.productContainer}>
          <Text style={styles.productInfo}>
            Siret number: {product.numSiret}
          </Text>
          <Text style={styles.productInfo}>weight: {product.weight}</Text>
          <Text style={styles.productInfo}>
            delivery Note: {product.deliveryNote}
          </Text>
          <View style={styles.divider} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  productContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  productInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ShowProductScreen;
