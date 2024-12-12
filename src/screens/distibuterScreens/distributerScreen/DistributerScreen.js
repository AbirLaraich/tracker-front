import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ShowProcessedOrders from "./ShowProcessedOrders";
import CreateProductScreen from "./CreateProductScreen";
import ShowProductScreen from "./ShowProductScreen";
import ProfileScreen from "./ProfileScreen";
import NotificationsScreen from "./NotificationsScreen";

const DistributerScreen = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();
  const Stack = createStackNavigator();

  const handleLogout = () => {
    navigation.navigate("SignIn");
  };

  function DistributerRoot() {
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            drawerLabel: "Notifications",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: "#fff",
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A",
            },
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="bell" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="My Orders"
          component={ShowProcessedOrders}
          options={{
            drawerLabel: "My Orders",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: "#fff",
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A",
            },
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="book" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Add Product"
          component={CreateProductScreen}
          options={{
            drawerLabel: "Add Product",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: "#fff",
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
          name="My Products"
          component={ShowProductScreen}
          options={{
            drawerLabel: "My Products",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: "#fff",
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
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerLabel: "Profile",
            drawerStyle: {
              backgroundColor: "#fff",
            },
            headerTitleStyle: {
              color: "#fff",
            },
            drawerActiveTintColor: "#2AAA8A",
            headerStyle: {
              backgroundColor: "#2AAA8A",
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
        <Drawer.Navigator>
          <Stack.Screen
            name="DistributerRoot"
            component={DistributerRoot}
            options={{ headerShown: false }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <FontAwesome
          name="sign-out"
          size={20}
          color="white"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3498db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 18,
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
    borderRadius: 40,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutIcon: {
    marginRight: 10,
    color: "#FFF",
  },
});

export default DistributerScreen;
