import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeScreen = () => {
  const navigation = useNavigation();

  const onDistancePressed = () => {
    navigation.navigate("DistanceCalculatorScreen");
  };

  const onLoginPressed = () => {
    navigation.navigate("SignIn");
  };

  const onConsumerPressed = () => {
    navigation.navigate("ConsumerSearchScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={onLoginPressed}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.consumerButton]}
        onPress={onConsumerPressed}>
        <Text style={styles.buttonText}>Consumer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.distanceButton]}
        onPress={onDistancePressed}>
        <Text style={styles.buttonText}>Distance</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  button: {
    width: 300,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#007bff", 
  },
  consumerButton: {
    backgroundColor: "#28a745",
  },
  distanceButton: {
    backgroundColor: "#dc3545",
  }
});

export default HomeScreen;
