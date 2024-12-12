import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import Logo from "../../../assets/img/logo.svg";
import CustomInput from "../../components/customInput/CustomInput";
import CustomButton from "../../components/customButton/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { Role } from "../../types/role";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Web3 from "web3";
import axios from "axios";

const alchemyUrl =
  "https://eth-mainnet.alchemyapi.io/v2/oVrdY4cuBE39fJoFLs1_t2Z3u4nlZpOk";
//const web3 = new Web3(alchemyUrl);

const SignInScreen = () => {
  const { height } = useWindowDimensions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("0");
  const [error, setError] = useState(null);
  const roles = [
    { key: 1, value: "Producer" },
    { key: 2, value: "Distributer" },
  ];

  const navigation = useNavigation();
  const onSignInPressed = () => {
    console.warn("Sign In");
  };

  const onForgotPasswordPressed = () => {
    console.warn("Forgot Password");
  };

  const signIn = async () => {
    const metaMaskConnexion = await connectToMetaMask();
    let roleselected = null;
    if (role == 1) roleselected = new Role(roles[0].key, roles[0].value);
    else roleselected = new Role(roles[1].key, roles[1].value);

    let apiUrl = "";
    if (roleselected.id == 1) {
      apiUrl = "https://tracker-api-production-27cf.up.railway.app/api/login/supplier";
    } else {
      apiUrl = "https://tracker-api-production-27cf.up.railway.app/api/login/distributer";
    }

    const requestData = {
      email,
      password,
    };
    axios
      .post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (data) => {
        if (data) {
          await AsyncStorage.setItem("connectedUser", JSON.stringify(data));
          if (roleselected.id === 1) navigation.navigate("producer");
          else navigation.navigate("distributer");
          Alert.alert("Success", "Connexion réussie");
        } else {
          Alert.alert("Error", "Erreur lors de la connexion");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Mail or password invalid", "Erreur lors de la connexion");
      });
  };

  const onSignUpPressed = () => {
    console.warn("Sign Up");
    navigation.navigate("SignUp");
  };

  const connectToMetaMask = async () => {
    const provideUrl = "http://127.0.0.1:7545";
    
    const web3 = new Web3(provideUrl);

    let provider = window.ethereum;
    console.warn(provider);
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          console.warn(accounts);
        })
        .catch((err) => {
          console.warn(err);
        });

      window.ethereum.on("accountsChanged", function (accounts) {
        console.warn(accounts);
      });
    }
  };

  

  return (
    <ScrollView>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
        <SelectList
          boxStyles={{ width: 330, height: 50 }}
          dropdownStyles={{ height: 90 }}
          setSelected={setRole}
          data={roles}
          placeholder="Please select your role"
        />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry={true}
        />

        <CustomButton text="Sign In" onPress={signIn} />
        {error && <Text style={styles.error}>{error}</Text>}

        <CustomButton
          text="Forgot password"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <CustomButton
          text="Sign In with Google"
          onPress={onSignInPressed}
          bgColor="#FAE9EA"
          fgColor="#DD4D44"
        />

        <CustomButton
          text="Don't have an account? SignUp"
          onPress={onSignUpPressed}
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
  logo: {
    width: "100%",
    maxWidth: 300,
    maxHeight: 200,
  },
  error: {
    color: "red",
    marginTop: 12,
    alignItems: "center",
  },
});

export default SignInScreen;
