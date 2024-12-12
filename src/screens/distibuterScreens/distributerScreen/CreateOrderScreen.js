import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const CreateOrderScreen = () => {
  const [orderDto, setOrderDto] = useState({
    supplier: {},
    owner: {},
    product: {},
    quantity: 0,
    status: "PENDING",
  });
  const navigation = useNavigation();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();

  const apiUrlSuppliers = "https://tracker-api-production-27cf.up.railway.app/api/suppliers";
  const apiUrlOrder = "https://tracker-api-production-27cf.up.railway.app/api/order";
  const apiUrlProducts = "https://tracker-api-production-27cf.up.railway.app/api/products";

  let connectedUser = "";

  useEffect(() => {
    fetchConnectedUser().then(
      ()=> fetchSuppliers().then((data) => handleSupplierChange(data[0].email, data))
    );
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(apiUrlSuppliers);
      if (response.ok) {
        const supplierData = await response.json();
        setSuppliers(supplierData);

        if (supplierData.length > 0) {
          setSelectedSupplier(supplierData[0]);
          handleInputChange("supplier", { email: supplierData[0].email });
        }
        return supplierData;
      } else {
        console.error("Erreur lors de la récupération des fournisseurs");
        return [];
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  const fetchConnectedUser = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      connectedUser = JSON.parse(connectedUserString);
      orderDto.owner = connectedUser.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur connecté:",
        error
      );
    }
  };

  const handleInputChange = (field, value) => {
    setOrderDto({
      ...orderDto,
      [field]: value,
    });
  };

  const handleSupplierChange = async(value, listSuppliers) => {
    let selectedSupplier = suppliers.find(
      (supplier) => supplier.email === value
    );
    if (!selectedSupplier) {
      selectedSupplier = listSuppliers[0];
    }
    setSelectedSupplier(selectedSupplier);
    orderDto.supplier = selectedSupplier;
    handleInputChange("supplier", { email: value });
    const productsList = await initProducts(selectedSupplier.siret_number);
    setProducts(productsList)
    handleProductChange(productsList[0].numSiret, productsList)
  };

  const initProducts = async (supplierSiretNumber) => {
    try {
      const response = await axios.get(
        `${apiUrlProducts}/${supplierSiretNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.length > 0) {
        setProducts(response.data);
        return response.data;
      } else {
        setProducts([]);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      console.error("Error", "Erreur lors de la récupération des produits");
    }
  };

  const handleProductChange = (value, listProducts) => {
    let selectedProduct = listProducts.find(
      (product) => product.numSiret == value
    );
    if (!selectedProduct) {
      selectedProduct = listProducts[0];
    }
    setSelectedProduct(selectedProduct);
    orderDto.product = selectedProduct;
    handleInputChange("product", selectedProduct);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(apiUrlOrder, orderDto, {
        headers: {
          "Content-Type": "application/json",
        },
      });

        setOrderDto({
          supplier: { email: response.data.supplier },
          owner: { email: response.data.owner },
          product: { numSiret: response.data.product.numSiret },
          quantity: response.data.quantity,
          status: response.data.status,
        });
        fetchSuppliers();
        navigation.navigate('My Orders', { screen: 'OrdersScreen' });
      } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Supplier:</Text>
        <Picker
          style={styles.input}
          selectedValue={selectedSupplier ? selectedSupplier.email : null}
          onValueChange={(value) => handleSupplierChange(value, suppliers)}
        >
          {suppliers.map((supplier) => (
            <Picker.Item
              key={supplier.email}
              label={supplier.name}
              value={supplier.email}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Product:</Text>
        <Picker
          style={styles.input}
          selectedValue={selectedProduct ? selectedProduct.numSiret : null}
          onValueChange={(value) => handleProductChange(value, products)}
        >
          {products.map((product) => (
            <Picker.Item
              key={product.numSiret}
              label={product.numSiret}
              value={product.numSiret}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Email du distributeur:</Text>
        <TextInput
          placeholder="owner"
          style={styles.input}
          value={orderDto.owner.email}
          onChangeText={(text) => handleInputChange("owner", { email: text })}
          editable={orderDto.owner.email ? false : true}
        />

        <Text style={styles.label}>Quantité:</Text>
        <TextInput
          placeholder="Quantité"
          style={styles.input}
          keyboardType="numeric"
          value={orderDto.quantity.toString()}
          onChangeText={(text) =>
            handleInputChange("quantity", parseInt(text) || 0)
          }
        />

         <Button title="Créer la commande" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  formContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default CreateOrderScreen;
