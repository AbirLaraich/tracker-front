import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const ShowProductScreen = () => {
  const [products, setProducts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchProductData();
      };

      fetchData();
    }, [])
  );
  // const handleLotPress = () => {
  //   navigation.navigate("Add Product", { screen: "CreateProductScreen" });
  // };
  const fetchProductData = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      const connectedUser = JSON.parse(connectedUserString);
      const response = await axios.get(
        `https://tracker-api-production-27cf.up.railway.app/api/products/${connectedUser.data.siret_number}`
      );
      const data = await response.data;
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
        <View key={product.numProduct} style={styles.productContainer}>
          <Text style={styles.productInfo}>Lot number: {product.numLot}</Text>
          <Text style={styles.productInfo}>
            Product number: {product.numProduct}
          </Text>
          <Text style={styles.productInfo}>weight: {product.weight}</Text>
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
