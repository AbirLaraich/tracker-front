import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens/signInScreen/SignInScreen";
import SignUpScreen from "../screens/signUpScreen/SignUpScreen";
import CreateProductScreen from "../screens/producerScreens/productsScreen/CreateProductScreen";
import ShowProductScreen from "../screens/producerScreens/productsScreen/ShowProductScreen";
import ConsumerSearchScreen from "../screens/ConsumerScreens/ConsumerScreen/ConsumerSearchScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProducerScreen from "../screens/producerScreens/productsScreen/ProducerScreen";
import DistributerScreen from "../screens/distibuterScreens/distributerScreen/DistributerScreen";
import OrdersScreen from "../screens/distibuterScreens/distributerScreen/OrdersScreen";
import ShowOrderScreen from "../screens/producerScreens/productsScreen/ShowOrderScreen";
import Distance from "../screens/distances/Distance";
import CreateLotScreen from "../screens/producerScreens/productsScreen/CreateLotScreen";
import ShowLotScreen from "../screens/producerScreens/productsScreen/ShowLotScreen";
import createOrderProducer from "../screens/producerScreens/productsScreen/CreateOrderScreen";
import CreateOrderScreen from "../screens/producerScreens/productsScreen/CreateOrderScreen";

const Stack = createStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="producer" component={ProducerScreen} />
        <Stack.Screen name="distributer" component={DistributerScreen} />
        <Stack.Screen name="createProduct" component={CreateProductScreen} />
        <Stack.Screen name="createLot" component={CreateLotScreen} />
        <Stack.Screen name="ShowLotScreen" component={ShowLotScreen} />
        <Stack.Screen name="showProductScreen" component={ShowProductScreen} />
        <Stack.Screen name="DistanceCalculatorScreen" component={Distance} />
        <Stack.Screen name="ConsumerSearchScreen" component={ConsumerSearchScreen} />
        <Stack.Screen name="distributerOrders" component={OrdersScreen} />
        <Stack.Screen name="createOrderProducer" component={CreateOrderScreen} />
        <Stack.Screen name="ShowOrderScreen" component={ShowOrderScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
