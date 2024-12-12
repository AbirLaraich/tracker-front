import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      const connectedUser = JSON.parse(connectedUserString);

      const distributerEmail = connectedUser.data.email;
      const response = await axios.get(
        `https://tracker-api-production-27cf.up.railway.app/api/notification/distributer/${distributerEmail}`
      );

      const sortedNotifications = response.data.sort((a, b) => {
        const dateA = new Date(a.CreateDate);
        const dateB = new Date(b.CreateDate);
        return dateB - dateA;
      });

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des notifications :",
        error
      );
    }
  };

  const handleOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `https://tracker-api-production-27cf.up.railway.app/api/order/procedssed/${orderId}`
      );
      setSelectedOrderDetails(response.data);
      console.log("Détails de la commande :", response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch order details.");
      console.error("Failed to fetch order details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <ScrollView style={styles.scrollView}>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.notification}>
            <TouchableOpacity
              onPress={() => handleOrderDetails(notification.order)}
            >
              <Text
                style={[
                  styles.notificationText,
                  !notification.isRead ? { fontWeight: "bold" } : null,
                ]}
              >
                {notification.supplier.name} a envoyé une nouvelle commande
              </Text>
              {selectedOrderDetails &&
                selectedOrderDetails.id === notification.order && (
                  <View>
                    <Text style={styles.orderDetailText}>
                      Producteur: {selectedOrderDetails.owner.name}
                    </Text>
                    <Text style={styles.orderDetailText}>
                      Nom du lot: {selectedOrderDetails.lots[0].name}
                    </Text>
                  </View>
                )}
            </TouchableOpacity>
            <Text style={styles.dateText}>
              {new Date(notification.CreateDate).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  notification: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
});

export default NotificationsScreen;
