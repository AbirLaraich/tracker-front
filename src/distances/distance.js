import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const Distance = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(null);

  const calculateDistance = async () => {
    const geocodeAddress = async (address) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
        );

        if (response.data && response.data.length > 0) {
          return {
            lat: parseFloat(response.data[0].lat),
            lon: parseFloat(response.data[0].lon),
          };
        } else {
          throw new Error("Address not found");
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
        throw error;
      }
    };

    const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in kilometers
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    try {
      const originCoords = await geocodeAddress(origin);
      const destinationCoords = await geocodeAddress(destination);

      const distance = calculateHaversineDistance(
        originCoords.lat,
        originCoords.lon,
        destinationCoords.lat,
        destinationCoords.lon
      );
      setDistance(distance);
    } catch (error) {
      console.error("Error calculating distance:", error);
      setDistance(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Adresse de départ"
        value={origin}
        onChangeText={setOrigin}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse de destination"
        value={destination}
        onChangeText={setDestination}
      />
      <Button title="Calculer la distance" onPress={calculateDistance} />
      {distance !== null && (
        <Text style={styles.distance}>
          Distance entre les adresses : {distance.toFixed(2)} km
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  distance: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Distance;
