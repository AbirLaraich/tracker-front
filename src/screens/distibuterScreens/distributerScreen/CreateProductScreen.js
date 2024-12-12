import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from 'react-native-picker-select';
import { TouchableOpacity } from "react-native-gesture-handler";

const CreateProductScreen = () => {
  const [numProduct, setNumProduct] = useState("");
  const [weight, setWeight] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const connectedUserString = await AsyncStorage.getItem("connectedUser");
        const connectedUser = JSON.parse(connectedUserString);
        const response = await axios.get(
          `https://tracker-api-production-27cf.up.railway.app/api/orders/distributer/${connectedUser.data.siret_number}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        Alert.alert("Error", "Failed to fetch orders. Please try again.");
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        if (!selectedOrder) {
          return;
        }
        const response = await axios.get(
          `https://tracker-api-production-27cf.up.railway.app/api/order/lot/${selectedOrder}`
        );
        setLots(response.data);
      } catch (error) {
        console.error("Error fetching lots:", error);
        Alert.alert("Error", "Failed to fetch lots. Please try again.");
      }
    };
    fetchLots();
  }, [selectedOrder]);

  const onCreatePressed = async () => {
    try {
      if (!selectedLot || !numProduct || !weight) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      const connectedUser = JSON.parse(connectedUserString);

      const requestData = {
        numProduct: numProduct,
        weight: weight,
        numLot: selectedLot,
        distributer: {
          email: connectedUser.data.email,
          password: connectedUser.data.password,
          adresse: connectedUser.data.adresse,
          name: connectedUser.data.name,
          numSiret: connectedUser.data.siret_number,
        },
      };

      const response = await axios.post(
        "https://tracker-api-production-27cf.up.railway.app/api/product",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", "Product created successfully!");
      navigation.navigate("DistributerRoot", { screen: "My Products" });
    } catch (error) {
      console.error("Error during API call:", error);
      Alert.alert("Error", "Failed to create product. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Product</Text>

      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: "Choose an order", value: null }}
        value={selectedOrder}
        onValueChange={(itemValue) => setSelectedOrder(itemValue)}
        items={orders.map((order) => ({
          label: `Order ID: ${order.id}`,
          value: order.id.toString(),
        }))}
      />

      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: "Choose a lot", value: null }}
        value={selectedLot}
        onValueChange={(itemValue) => setSelectedLot(itemValue)}
        items={lots.map((lot) => ({
          label: lot.name,
          value: lot.numLot,
        }))}
      />

      <TextInput
        placeholder="Product number"
        value={numProduct}
        onChangeText={setNumProduct}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={onCreatePressed}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#27ae60",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  inputAndroid: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
});

export default CreateProductScreen;
