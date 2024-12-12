import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { Button } from "react-native-paper";

const ProductsScreen = () => {
  const apiUrlSuppliers = "https://tracker-api-production-27cf.up.railway.app/api/suppliers";
  const apiUrlProducts = "https://tracker-api-production-27cf.up.railway.app/api/products";

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [inputDate, setInputData] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrlSuppliers, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchData();
  }, []);

  const toggleInputDataState = (index, show) => {
    setSelectedProduct(index);
    setShow(!show);
  };

  const handleDeliveryDateChange = (text) => {
    setDeliveryDate(text);
  };

  const handleProductPress = async (supplierSiretNumber) => {
    try {
      const response = await axios.get(
        `${apiUrlProducts}/${supplierSiretNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSendDate = async (numSiret, deliveryDate) => {
    try {
      const apiUrl = `https://tracker-api-production-27cf.up.railway.app/api/update/product?siretNumber=${numSiret}&delivery_date=${deliveryDate}`;
      const response = await axios.put(apiUrl);
      if (response.status === 200) {
        setMessageSuccess("Delivery date updated successfully!");
      } else {
        console.error("Error updating delivery date:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating delivery date:", error);
    }
  };

  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>Suppliers</Text>
      {suppliers.map((supplier, index) => (
        <View key={index} style={styles.supplierContainer}>
          <Text style={styles.siretNumber}>Siret number: {supplier.siret_number}</Text>
          <Text style={styles.supplierInfo}>Name: {supplier.name}</Text>
          <Text style={styles.supplierInfo}>Address: {supplier.address}</Text>
          <Text style={styles.supplierInfo}>Email: {supplier.email}</Text>
          <TouchableOpacity
            style={styles.productButton}
            onPress={() => handleProductPress(supplier.siret_number)}
          >
            <Text style={styles.productButtonText}>View Products</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.productsContainer}>
        <Text style={styles.title}>Products</Text>
        {products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <Text style={styles.productInfo}>Siret number: {product.numSiret}</Text>
            <Text style={styles.productInfo}>Weight: {product.weight}</Text>
            <Text style={styles.productInfo}>Delivery Note: {product.deliveryNote}</Text>
            <Button
              mode="contained"
              style={styles.productButton}
              onPress={() => toggleInputDataState(index, show)}
            >
              Details
            </Button>
            {selectedProduct == index && show && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delivery Date</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleDeliveryDateChange}
                  value={deliveryDate}
                  placeholder="Enter delivery date yyyy-mm-dd"
                  placeholderTextColor="#999"
                />
                {deliveryDate !== "" && (
                  <Button
                    mode="contained"
                    style={styles.sendButton}
                    onPress={() => handleSendDate(product.numSiret, deliveryDate)}
                  >
                    Send
                  </Button>
                )}
                <Text style={styles.successMessage}>{messageSuccess}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  supplierContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  siretNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  supplierInfo: {
    fontSize: 16,
    marginBottom: 3,
    color: "#555",
  },
  productButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  productButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  productsContainer: {
    marginTop: 20,
  },
  productContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  productInfo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    marginTop: 10,
  },
  successMessage: {
    color: "#28a745",
    marginTop: 10,
    fontSize: 16,
  },
});

export default ProductsScreen;
