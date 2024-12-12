import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Button
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import RNPickerSelect from 'react-native-picker-select';


const CreateOrderScreen = () => {
  const [orderDto, setOrderDto] = useState({
    distributer: {},
    owner: {},
    lots: [],
    status: "PENDING",
  });
  const navigation = useNavigation();
  const [distributers, setDistributers] = useState([]);
  const [selectedDistributer, setSelectedDistributer] = useState();
  const [lots, setLots] = useState([]);
  const [selectedLots, setSelectedLots] = useState([]);

  const apiUrlDistributers = "https://tracker-api-production-27cf.up.railway.app/api/distributers";
  const apiUrlOrder = "https://tracker-api-production-27cf.up.railway.app/api/order";
  const apiUrlLots = "https://tracker-api-production-27cf.up.railway.app/api/lot/no_Order";

  let connectedUser = "";

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await fetchConnectedUser().then(() =>
          fetchDistributers().then((data) =>
            handleDistributerChange(data[0].email, data).then(() => initLots())
          )
        );
      };

      fetchData();
    }, [])
  );
  useEffect(() => {
    fetchConnectedUser().then(() =>
      fetchDistributers().then((data) =>
        handleDistributerChange(data[0].email, data).then(() => initLots())
      )
    );
  }, []);

  const fetchDistributers = async () => {
    try {
      const response = await axios.get(apiUrlDistributers);
      if (response.status === 200) {
        const distributerData = await response.data;
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

  const initLots = async () => {
    try {
      const response = await axios.get(
        `${apiUrlLots}/${connectedUser.data.siret_number}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.length > 0) {
        setLots(response.data);
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
    let selectedLots = lots.filter(lot => values.includes(lot.name));
    orderDto.lots = selectedLots;
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(apiUrlOrder, orderDto, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setOrderDto({
        distributer: { email: response.data.distributer },
        owner: { email: response.data.owner },
        lots: response.data.lots,
        status: response.data.status,
      });
      fetchDistributers();
      navigation.navigate("ProducerRoot", { screen: "Show Orders" });
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  return (
    <ScrollView style={styles.root}>
      <View style={styles.formContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>Distributer:</Text>
          <RNPickerSelect
            style={styles.input}
            value={selectedDistributer ? selectedDistributer.email : null}
            onValueChange={(value) => handleDistributerChange(value)}
            items={distributers.map((distributer) => ({
              label: distributer.name,
              value: distributer.email,
            }))}
          />
        </View>

        <Text style={styles.label}>Lots:</Text>
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

        <Text style={styles.label}>Owner:</Text>
        <TextInput
          placeholder="owner"
          style={styles.input}
          value={orderDto.owner.email}
          onChangeText={(text) => handleInputChange("owner", { email: text })}
          editable={orderDto.owner.email ? false : true}
        />

        <Button title="Create order" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  container: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10, // Pour espacement entre le label et le select
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: "#333333"
  }
});
export default CreateOrderScreen;