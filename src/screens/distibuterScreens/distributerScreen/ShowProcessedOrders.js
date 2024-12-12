import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect } from "@react-navigation/native";

const ShowProcessedOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      const connectedUser = JSON.parse(connectedUserString);
      const response = await axios.get(
        `https://tracker-api-production-27cf.up.railway.app/api/processedOrder/${connectedUser.data.siret_number}`
      );
      const data = await response.data;
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const finalizeOrder = async (order) => {
    try {
      const distance = await axios.post("https://tracker-api-production-27cf.up.railway.app/api/distance", {
        distributer: order.distributer.adresse,
        supplier:  order.owner.adresse
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    console.log("<<<<<<<<<<<<<<>>>>>>>>>> ", distance.data);
      const lots = order.lots.map((lot) => {
        return {
          lot: {
            id: lot.numLot.toString(),
            numero_lot: lot.numLot.toString(),
            nom_du_produit: lot.numLot.toString(),
            poids: " ",
            date_de_cloture: " ",
          },
          articles: lot.products.map((product) => {
            return {
              id: product.numProduct.toString(),
              numero_article: product.numProduct.toString(),
              nom_du_produit: product.numProduct.toString(),
              poids: product.weight,
              date_creation: "2023-11-14T23:00:00.000Z",
            };
          }),
        };
      })

      const infosArrivage = {
        id: order.id.toString(),
        numero_de_arrivage: order.id.toString(),
        commentaire: order.status,
        date_livraison: " ",
        date_de_cloture: " ",
        fournisseur: {
          id: order.owner.name,
          adresse: order.owner.adresse,
        },
        producteur: null,
        code_magasin: order.distributer.siret_number.toString(),
        distance: Math.floor(distance.data),
        lots: lots,
      };

      const blockchainResponse = await sendArrivageToBlockchain(JSON.stringify(infosArrivage));
      await axios.post('http://192.168.1.227:3010/write-file', {
        data: {
          ...infosArrivage,
          hash: blockchainResponse.data.TransactionDetails.TransactionHash,
          hashedData: blockchainResponse.data.TransactionDetails.Data
        },
        filename: 'data.json',
      });
      const apiInBlockchain = `https://tracker-api-production-27cf.up.railway.app/api/order/${order.id}/blockchain`;

      await axios.put(apiInBlockchain, null, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      fetchData();
    } catch (error) {
      console.error("Error finalizing order:", error);
    }
  };

  const sendArrivageToBlockchain = async (infosArrivage) => {
    try {
      const response = await axios.post(
        "http://192.168.1.227:3010/ancrage-arrivage",
        infosArrivage,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response;
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des données à la blockchain:",
        error.message
      );
      throw error;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderText}>Order ID: {item.id}</Text>
            <Text style={styles.orderText}>Status: {item.status}</Text>
            <Text style={styles.orderText}>
              Distributer name: {item.distributer.name}
            </Text>
            <Text style={styles.orderText}>
              Number of lots: {item.lots.length}
            </Text>
            <Text style={styles.sectionTitle}>Lot details:</Text>
            {item.lots.map((lot) => (
              <View key={lot.numLot} style={styles.lotItem}>
                <Text style={styles.lotText}>Lot number: {lot.numLot}</Text>
                <Text style={styles.lotText}>Lot name: {lot.name}</Text>
                <Text style={styles.lotText}>
                  Creation date: {lot.creation_date.split("T")[0]}
                </Text>
                <Text style={styles.sectionTitle}>Products:</Text>
                {lot.products.map((product) => (
                  <View key={product.numProduct} style={styles.productItem}>
                    <Text style={styles.productText}>
                      Product number: {product.numProduct}
                    </Text>
                    <Text style={styles.productText}>
                      Weight: {product.weight}
                    </Text>
                    <View style={styles.qrCodeContainer}>
                      <QRCode value={product.qrCode} size={80} />
                    </View>
                  </View>
                ))}
              </View>
            ))}
            {!item.inBlockchain && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Finalize Order"
                  onPress={() => finalizeOrder(item)}
                />
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  orderItem: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
    marginBottom: 5,
  },
  lotItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  lotText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#555",
    marginBottom: 4,
  },
  productItem: {
    marginLeft: 20,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginBottom: 4,
  },
  qrCodeContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default ShowProcessedOrders;
