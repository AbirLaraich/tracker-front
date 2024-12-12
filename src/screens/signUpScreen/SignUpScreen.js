import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import CustomButton from "../../components/customButton/CustomButton";
import CustomInput from "../../components/customInput/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { Role } from "../../types/role";
import axios from "axios";

const SignUpScreen = () => {
  const [name, setname] = useState("");
  const [siertNumber, setSiertNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [adresse, setAdresse] = useState("");
  const navigation = useNavigation();
  const [role, setRole] = useState("0");
  const roles = [
    { key: 1, value: "Producer" },
    { key: 2, value: "Distributer" },
  ];

  const createUser = () => {
    let roleselected = null;
    if (role == 1) roleselected = new Role(roles[0].key, roles[0].value);
    else roleselected = new Role(roles[1].key, roles[1].value);
    let apiUrl = "";
    if (roleselected.id == 1) {
      apiUrl = "https://tracker-api-production-27cf.up.railway.app/api/supplier";
    } else {
      apiUrl = "https://tracker-api-production-27cf.up.railway.app/api/distributer";
    }
    axios.post(apiUrl, {
      name: name,
      siretNumber: siertNumber,
      email: email,
      role: roleselected,
      password: password,
      adresse: adresse,
    })
    .then((response) => {
      if (response.status === 201) {
        Alert.alert("Success", "Utilisateur créé avec succès");
        navigation.navigate("SignIn");
      } else {
        Alert.alert("Error", "Erreur lors de la création de l'utilisateur");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  const onTermsOfUsePressed = () => {
    console.warn("onTermsOfUsePressed");
  };

  const onPrivacyPressed = () => {
    console.warn("onPrivacyPressed");
  };

  const onSignInPress = () => {
    console.warn("onSignInPress");
    navigation.navigate("SignIn");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
        <CustomInput placeholder="Name" value={name} setValue={setname} />

        <CustomInput
          placeholder="Siret Number"
          value={siertNumber}
          setValue={setSiertNumber}
        />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />

        <SelectList
          boxStyles={{ width: 300, height: 50 }}
          dropdownStyles={{ height: 90 }}
          setSelected={setRole}
          data={roles}
          placeholder="Please select your role"
        />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
        />

        <CustomInput
          placeholder="Repeat Password"
          value={passwordRepeat}
          setValue={setPasswordRepeat}
          secureTextEntry={true}
        />

        <CustomInput
          placeholder="Complete address"
          value={adresse}
          setValue={setAdresse}
          secureTextEntry={false}
        />

        <CustomButton text="Register" onPress={createUser} />

        <Text style={styles.text}>
          By registering, you confirm that you accept our{" "}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text>
        <CustomButton
          text="Have an account? SignIn"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FDB075",
  },
});

export default SignUpScreen;
