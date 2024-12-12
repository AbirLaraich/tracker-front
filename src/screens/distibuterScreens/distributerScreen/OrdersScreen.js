import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrdersScreen = ({ navigation }) => {
  const apiUrlOrders = "https://tracker-api-production-27cf.up.railway.app/api/orders";
  const [orders, setOrders] = useState([]);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [refreshScreen, setRefreshScreen] = useState(false); // Added refreshScreen state
  let connectedUser = "";

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchConnectedUser();
        await fetchOrders();
      };

      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshScreen])
  );

  const fetchConnectedUser = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      connectedUser = JSON.parse(connectedUserString);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur connecté:",
        error
      );
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${apiUrlOrders}/${connectedUser.data.siret_number}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const apiUrlCancelOrder = `https://tracker-api-production-27cf.up.railway.app/api/order/${orderId}/cancel`;

      // Set the current cancelling order ID
      setCancellingOrderId(orderId);

      // Display the cancellation confirmation
      setIsCancelling(true);
    } catch (error) {
      console.error(`Error cancelling order with id ${orderId}:`, error);
      Alert.alert("Error", `Failed to cancel order with id ${orderId}`);
    }
  };

  const confirmCancelOrder = async () => {
    try {
      const apiUrlCancelOrder = `https://tracker-api-production-27cf.up.railway.app/api/order/${cancellingOrderId}/cancel`;

      const response = await axios.put(apiUrlCancelOrder, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(
        `Order with id ${cancellingOrderId} cancelled successfully:`,
        response.data
      );

      await fetchConnectedUser();
      await fetchOrders();
      setIsCancelling(false);
      setCancellingOrderId(null);

      // Toggle refreshScreen to trigger a re-render
      setRefreshScreen((prevValue) => !prevValue);
    } catch (error) {
      console.error(
        `Error cancelling order with id ${cancellingOrderId}:`,
        error
      );
      Alert.alert(
        "Error",
        `Failed to cancel order with id ${cancellingOrderId}`
      );
    }
  };
  return (
    <ScrollView style={styles.container}>
      {orders.map((order, index) => (
        <View key={index} style={styles.orderContainer}>
          <Text>Supplier: {order.supplier.name}</Text>
          <Text>Owner: {order.owner.name}</Text>
          <Text>Product: {order.product.numSiret}</Text>
          <Text>Quantity: {order.quantity}</Text>
          <Text>Status: {order.status}</Text>

          {order.status !== "CANCELED" ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(order.id)}
            >
              <Text style={styles.cancelButtonText}>Cancellation of Order</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.alreadyCancelledText}>
              Order is already canceled
            </Text>
          )}

          {isCancelling && cancellingOrderId === order.id && (
            <View>
              <Text style={styles.confirmationText}>
                Are you sure you want to cancel this order?
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmCancelOrder}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelConfirmButton}
                onPress={() => setIsCancelling(false)}
              >
                <Text style={styles.cancelConfirmButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  orderContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 4,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmationText: {
    marginTop: 8,
    marginBottom: 8,
    color: "#e74c3c",
  },
  confirmButton: {
    padding: 8,
    backgroundColor: "#27ae60",
    borderRadius: 4,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelConfirmButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 4,
    alignItems: "center",
  },
  cancelConfirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  alreadyCancelledText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default OrdersScreen;
