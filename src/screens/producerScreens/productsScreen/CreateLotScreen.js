import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Web3 from "web3";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateLotScreen = () => {
  const [numLot, setNumLot] = useState();
  const [name, setName] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [creationSuccess, setCreationSuccess] = useState(false);

  const setParameters = () => {
    setNumLot("");
    setName("");
    setCreationDate("");
  };

  const apiUrl = "https://tracker-api-production-27cf.up.railway.app/api/lot";
  const navigation = useNavigation();

  const onCreatePressed = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      const connectedUser = JSON.parse(connectedUserString);

      if (!numLot || !name || !creationDate) {
        alert("Please fill in all fields");
        return;
      }
      const requestData = {
        numLot: numLot,
        name: name,
        supplier: {
          email: connectedUser.data.email,
          password: connectedUser.data.password,
          adresse: connectedUser.data.adresse,
        },
        creation_date: creationDate,
      };

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse de l'API:", response.data);
      setCreationSuccess(true);
      setParameters();
      navigation.navigate("ProducerRoot", { screen: "My Lots" });
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      console.error("Error", "Erreur lors de la connexion");
    }
  };

  const onShowLotPressed = () => {
    navigation.navigate("producer");
  };

  return (
    <View style={styles.root}>
      <>
        <TextInput
          placeholder="Lot number"
          value={numLot}
          onChangeText={(text) => setNumLot(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="YYYY-MM-DD"
          value={creationDate}
          onChangeText={(text) => setCreationDate(text)}
          style={styles.input}
        />
        <Button title="Create" onPress={onCreatePressed} />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: "80%",
  },
});

export default CreateLotScreen;
