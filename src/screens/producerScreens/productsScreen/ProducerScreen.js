import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ShowProductScreen from "./ShowProductScreen";
import ShowOrderScreen from "./ShowOrderScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import CreateLotScreen from "./CreateLotScreen";
import ShowLotScreen from "./ShowLotScreen";
import CreateOrderScreen from "./CreateOrderScreen";
import ProfileScreen from "./ProfileScreen";

const ProducerScreen = () => {
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate("SignIn");
  };

  function ProducerRoot() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="My Lots"
          component={ShowLotScreen}
          options={{
            drawerLabel: "My Lots",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: '#fff',
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A",
            },
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="list" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Add Lot"
          component={CreateLotScreen}
          options={{
            drawerLabel: "Add Lot",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: '#fff',
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A",
            },
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="plus" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Create Order"
          component={CreateOrderScreen}
          options={{
            drawerLabel: "Create Order",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: '#fff',
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A",
            },
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="cart-plus" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Show Orders"
          component={ShowOrderScreen}
          options={{
            drawerLabel: "Show Orders",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: '#fff',
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A",
            },
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="shopping-cart" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerLabel: "Profile",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: '#fff',
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A"
            },
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="ProducerRoot"
            component={ProducerRoot}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <FontAwesome name="sign-out" size={20} color="white" style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    justifyContent: "center"
  },
  container: {
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#088F8F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    width: "50%",
    marginLeft: "25%",
    borderRadius: 40
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutIcon: {
    marginRight: 10,
    color: "#FFF"
  },
});

export default ProducerScreen;
