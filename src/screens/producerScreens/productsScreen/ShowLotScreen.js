import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import axios from "axios";


const ShowLotScreen = () => {
  const [lot, setLot] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchLotData();
      };

      fetchData();
    }, [])
  );

  const fetchLotData = useCallback(async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      const connectedUser = JSON.parse(connectedUserString);
      const response = await axios.get(
        `https://tracker-api-production-27cf.up.railway.app/api/lot/${connectedUser.data.siret_number}`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      if (response.status !== 200) {
        throw new Error('Failed to fetch data');
      }
      setLot(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données des produits :",
        error
      );
    }
  }, []);
  

  return (
    <ScrollView style={styles.container}>
      {lot.length === 0 ? (
        <Text style={styles.noLotsText}>No lots available</Text>
      ) : (
        lot.map((lotItem) => (
          <View key={lotItem.numLot} style={styles.lotContainer}>
            <Text style={styles.lotInfo}>Lot number: {lotItem.numLot}</Text>
            <Text style={styles.lotInfo}>Name: {lotItem.name}</Text>
            {lotItem.creation_date && (
              <Text style={styles.lotInfo}>
                Creation date: {lotItem.creation_date.substring(0, 10)}
              </Text>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {lotItem.distributer ? ( 
                <>
                  <FontAwesome name="check-circle" size={24} color="green" />
                  <Text>In Order</Text>
                </>
              ) : (
                <>
                  <FontAwesome name="exclamation-circle" size={24} color="orange" />
                  <Text>Waiting for order</Text>
                </>
              )}
            </View>
            <View style={styles.divider} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  noLotsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#333333',
  },
  lotContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  lotInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 10,
  },
});

export default ShowLotScreen;
