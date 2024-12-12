import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Web3 from "web3";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateProductScreen = () => {
  const [numSiret, setNumSiret] = useState();
  const [weight, setWeight] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [creationSuccess, setCreationSuccess] = useState(false);

  const apiUrl = "https://tracker-api-production-27cf.up.railway.app/api/product";
  const navigation = useNavigation();

  const onCreatePressed = async () => {
    try {
      const connectedUserString = await AsyncStorage.getItem("connectedUser");
      const connectedUser = JSON.parse(connectedUserString);

      if (!numSiret || !weight || !deliveryNote) {
        alert("Please fill in all fields");
        return;
      }
      const requestData = {
        numSiret: numSiret,
        weight: weight,
        deliveryNote: deliveryNote,
        supplier: {
          email: connectedUser.data.email,
          password: connectedUser.data.password,
          adresse: connectedUser.data.adresse,
        },
        distributer: null,
      };

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse de l'API:", response.data);
      setCreationSuccess(true);
      navigation.navigate("ProducerRoot", { screen: "My Products" });
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      console.error("Error", "Erreur lors de la connexion");
    }
  };

  const onShowProductPressed = () => {
    navigation.navigate("producer");
  };

  const createTransaction = async (data) => {
    try {
      // Initialisez l'objet Web3 avec le fournisseur de MetaMask
      const web3 = new Web3("http://127.0.0.1:7545");
      const contractABI =
        require("./../../../../truffle/build/contracts/Transaction.json").abi;

      // Adresse du contrat intelligent
      const contractAddress = "0x6801f1e3a47763c741556DEEeC184cc6853e9956";

      // ABI du contrat (à remplacer par le chemin correct)
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      // Estimate gas
      const gas = await web3.eth.estimateGas({
        from: contractAddress,
        to: contractAddress,
        value: web3.utils.toWei("1", "wei"), // Adjust the value as needed
      });

      // Get current gas price
      const gasPrice = await web3.eth.getGasPrice();
      console.log("data", data);

      // Vérifiez si les propriétés nécessaires existent dans l'objet data
      if (data && data.numSiret && data.weight && data.deliveryNote) {
        // Créez votre objet de données (peut nécessiter un formatage spécifique selon le contrat)
        const transactionData = {
          numSiret: web3.utils.utf8ToHex(data.numSiret.toString()),
          weight: web3.utils.utf8ToHex(data.weight.toString()),
          deliveryNote: web3.utils.utf8ToHex(data.deliveryNote.toString()),
        };

        const contractMethod = contract.methods.myFonctionContrat(
          transactionData.numSiret,
          transactionData.weight,
          transactionData.deliveryNote
        );

        const encodedABI = contractMethod.encodeABI();

        let params = {
          from: contractAddress,
          to: contractAddress,
          gas: 3000000,
          gasPrice: gasPrice,
          value: web3.utils.toWei("1", "wei"),
          data: encodedABI,
        };
        const accounts = await web3.eth.sendTransaction(params);
        console.log("Transaction réussie:", accounts);
        getTransactionData(web3, accounts.transactionHash)
          .then((data) => displayTransactionData(data, web3))
          .catch((error) => console.error("Error:", error));
      } else {
        console.error(
          "Les propriétés nécessaires de l'objet data ne sont pas définies ou vides."
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la transaction :",
        error.message
      );
      throw error;
    }
  };

  const getTransactionData = async (web3, transactionHash) => {
    try {
      // Get transaction details
      const transaction = await web3.eth.getTransaction(transactionHash);

      // Check if the transaction exists
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Get contract ABI (replace with your contract's ABI)
      const contractABI =
        require("./../../../../truffle/build/contracts/Transaction.json").abi;

      // Create a contract instance
      const contract = new web3.eth.Contract(contractABI, transaction.to);

      // Decode input data (if it's a contract method call)
      const inputParameters = web3.eth.abi.decodeParameters(
        ["string", "string", "string"],
        transaction.input.slice(10)
      );

      // Get transaction receipt to access logs
      const transactionReceipt = await web3.eth.getTransactionReceipt(
        transactionHash
      );

      // Parse logs manually based on the assumed event structure
      const logs = transactionReceipt.logs.map((log) => {
        const event = contract._jsonInterface.find(
          (e) => e.type === "event" && e.signature === log.topics[0]
        );
        const decodedLog = web3.eth.abi.decodeLog(
          event.inputs,
          log.data,
          log.topics.slice(1)
        );
        return decodedLog;
      });

      return {
        inputData: {
          numSiret: inputParameters[0],
          weight: inputParameters[1],
          deliveryNote: inputParameters[2],
        },
        logs: logs,
      };
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  };

  const displayTransactionData = async (decodedData, web3) => {
    console.log("Transaction Data:");

    const numeroDeProduit = await web3.utils.hexToUtf8(
      decodedData.inputData.numSiret
    );
    const poids = await web3.utils.hexToUtf8(decodedData.inputData.weight);
    const bonLivraison = await web3.utils.hexToUtf8(
      decodedData.inputData.deliveryNote
    );

    console.log("Numéro De Produit:", numeroDeProduit);
    console.log("weight:", poids);
    console.log("Bon Livraison:", bonLivraison);
  };

  return (
    <View style={styles.root}>
      <>
        <TextInput
          placeholder="Product number"
          value={numSiret}
          onChangeText={(text) => setNumSiret(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Weight"
          value={weight}
          onChangeText={(text) => setWeight(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Delivery note"
          value={deliveryNote}
          onChangeText={(text) => setDeliveryNote(text)}
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

export default CreateProductScreen;
