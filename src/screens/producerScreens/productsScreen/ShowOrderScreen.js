import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { useNavigation } from "@react-navigation/native";

const ShowOrderScreen = () => {
  const apiUrlNotification =
    "https://tracker-api-production-27cf.up.railway.app/api/notification";
  const apiUrlOrders =
    "https://tracker-api-production-27cf.up.railway.app/api/orders";
  const apiUrlOrder =
    "https://tracker-api-production-27cf.up.railway.app/api/order";

  const apiUrlDistributers =
    "https://tracker-api-production-27cf.up.railway.app/api/distributers";
  const apiUrlLots =
    "https://tracker-api-production-27cf.up.railway.app/api/lot/no_Order";
  const [orders, setOrders] = useState([]);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [refreshScreen, setRefreshScreen] = useState(false);
  const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  const [distributers, setDistributers] = useState([]);
  const [selectedDistributer, setSelectedDistributer] = useState();
  const [orderDto, setOrderDto] = useState({
    id: null,
    distributer: {},
    owner: {},
    lots: [],
    status: "PENDING",
  });
  const [lots, setLots] = useState([]);
  const [selectedLots, setSelectedLots] = useState([]);
  const navigation = useNavigation();

  const createNotification = async (distributer, supplier, order) => {
    try {
      const notification = {
        id: 1,
        distributer: distributer,
        supplier,
        order,
        isRead: false,
      };

      console.log(notification);

      const response = await axios.post(apiUrlNotification, notification, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Notification créée avec succès:", response.data);
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
    }
  };

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

  useEffect(() => {
    const fetchData = async () => {
      await fetchConnectedUser();
      await fetchOrders();
    };

    fetchData();
    setIsUpdateClicked(false);
    setRefreshScreen(false);
  }, [refreshScreen]);

  const fetchConnectedUser = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      connectedUser = JSON.parse(connectedUserString);
      handleInputChange("owner", connectedUser.data);
      return connectedUser;
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
      const sortedOrders = response.data.sort((a, b) => {
        const statusOrder = { PENDING: 1, PROCESSED: 2, CANCELED: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
    }
  };

  const handleInputChange = (field, value) => {
    setOrderDto({
      ...orderDto,
      [field]: value,
    });
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const apiUrlCancelOrder = `https://tracker-api-production-27cf.up.railway.app/api/order/${orderId}/cancel`;

      setCancellingOrderId(orderId);

      setIsCancelling(true);
    } catch (error) {
      console.error(`Error cancelling order with id ${orderId}:`, error);
      Alert.alert("Error", `Failed to cancel order with id ${orderId}`);
    }
  };

  const handleSendOrder = async (order) => {
    try {
      const apiUrlSendOrder = `https://tracker-api-production-27cf.up.railway.app/api/order/${order.id}/processed`;

      const response = await axios.put(apiUrlSendOrder, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(
        `Order with id ${order.id} sended successfully:`,
        response.data
      );

      await createNotification(order.distributer, order.owner, order.id);

      await fetchConnectedUser();
      await fetchOrders();

      setRefreshScreen((prevValue) => !prevValue);
    } catch (error) {
      console.error(`Error sending order with id ${sendingOrderId}:`, error);
      Alert.alert("Error", `Failed to send order with id ${sendingOrderId}`);
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

  const handleModifyOrder = async (orderId) => {
    try {
      const owner = await fetchConnectedUser();
      const order = orders.find((order) => order.id == orderId);
      await fetchDistributers().then(() => initLots(owner, order.lots));
      setIsUpdateClicked(orderId);
    } catch (error) {
      console.error("Erreur lors de la modification de la commande :", error);
      Alert.alert("Erreur", "Impossible de modifier la commande");
    }
  };

  const fetchDistributers = async () => {
    try {
      const response = await fetch(apiUrlDistributers);
      if (response.ok) {
        const distributerData = await response.json();
        setDistributers(distributerData);

        if (distributerData.length > 0) {
          setSelectedDistributer(distributerData[0]);
          handleInputChange("distributer", { email: distributerData[0].email });
        }
        return distributerData;
      } else {
        console.error("Erreur lors de la récupération des distributers");
        return [];
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  const handleDistributerChange = async (value, listDistributers) => {
    let selected = distributers.find(
      (distributer) => distributer.email === value
    );
    if (!selected) {
      selected = listDistributers[0];
    }
    setSelectedDistributer(selected);
    handleInputChange("distributer", { email: value });
  };

  const initLots = async (user, lotsAlreadySelected) => {
    try {
      const response = await axios.get(
        `${apiUrlLots}/${user.data.siret_number}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.length > 0) {
        setSelectedLots(lotsAlreadySelected);
        setLots(lotsAlreadySelected.concat(response.data));
        console.log("lotsssssssssss ", lotsAlreadySelected);
        return response.data;
      } else {
        setLots([]);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      console.error("Error", "Erreur lors de la récupération des produits");
    }
  };

  const handleLotChange = (values) => {
    if (!values) values = [];
    let selectedLots = lots.filter((lot) => values.includes(lot.name));
    orderDto.lots = selectedLots;
  };

  const handleSubmit = async (orderId) => {
    try {
      orderDto.id = orderId;
      const response = await axios.put(`${apiUrlOrder}/${orderId}`, orderDto, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setOrderDto({
        id: response.data.id,
        distributer: { email: response.data.distributer },
        owner: { email: response.data.owner },
        lots: response.data.lots,
        status: response.data.status,
      });
      console.log("orderdto : ", orderDto);
      setRefreshScreen(true);
      navigation.navigate("ProducerRoot", { screen: "Show Orders" });
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {orders.map((order, index) => (
        <View key={index} style={styles.orderContainer}>
          <View style={styles.orderHeader}>
            <Text style={styles.title}>Order Details</Text>
            {order.status === "PENDING" && (
              <>
                <TouchableOpacity
                  style={styles.modifyButton}
                  onPress={() => handleModifyOrder(order.id)}
                >
                  <Icon name="edit" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modifyButton}
                  onPress={() => handleSendOrder(order)}
                >
                  <Icon name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.subtitle}>
            Distributor: {order.distributer.name}
          </Text>
          <Text style={styles.subtitle}>Owner: {order.owner.name}</Text>
          <View style={styles.lotContainer}>
            <Text style={styles.subtitle}>Lots:</Text>
            <View style={styles.lotsWrapper}>
              {order.lots &&
                order.lots.map((lot, lotIndex) => (
                  <View key={lotIndex} style={styles.lotItem}>
                    <Text style={styles.lotText}>
                      - {lot.name ? lot.name : "No Name"}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          <Text style={styles.subtitle}>Status: {order.status}</Text>
          {order.status === "CANCELED" ? (
            <Text style={styles.alreadyCancelledText}>
              Order is already canceled
            </Text>
          ) : order.status === "PROCESSED" ? (
            <Text style={styles.alreadySendedText}>Order is already sent</Text>
          ) : (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelOrder(order.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {isCancelling && cancellingOrderId === order.id && (
            <View style={styles.confirmationContainer}>
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
          {isUpdateClicked === order.id && order.status === "PENDING" && (
            <View style={styles.modifyForm}>
              <Picker
                style={styles.input}
                selectedValue={
                  selectedDistributer ? selectedDistributer.email : null
                }
                onValueChange={(value) =>
                  handleDistributerChange(value, distributers)
                }
              >
                {distributers.map((distributer) => (
                  <Picker.Item
                    key={distributer.email}
                    label={distributer.name}
                    value={distributer.email}
                  />
                ))}
              </Picker>

              <MultipleSelectList
                data={lots.map((lot) => ({
                  key: lot.numLot,
                  value: lot.name,
                }))}
                setSelected={setSelectedLots}
                save="value"
                onSelect={handleLotChange(selectedLots)}
                label="Select Lots"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit(order.id)}
              >
                <Text style={styles.buttonText}>Valider la Modification</Text>
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  lotContainer: {
    marginTop: 8,
  },
  lotsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  lotItem: {
    width: "48%",
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#27ae60",
  },
  lotText: {
    marginLeft: 8,
  },
  cancelButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 4,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmationContainer: {
    marginTop: 16,
  },
  confirmationText: {
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
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  alreadySendedText: {
    color: "#3498db",
    fontWeight: "bold",
    fontSize: 16,
  },
  modifyButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modifyForm: {
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ShowOrderScreen;
