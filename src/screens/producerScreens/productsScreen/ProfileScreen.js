import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [connectedUser, setConnectedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [siretNumber, setSiretNumber] = useState('');

  useEffect(() => {
    const fetchConnectedUser = async () => {
      try {
        // Récupérer les informations de l'utilisateur connecté depuis AsyncStorage
        const connectedUserString = await AsyncStorage.getItem('connectedUser');
        const user = JSON.parse(connectedUserString).data;
        setConnectedUser(user);
        setName(user.name);
        setEmail(user.email);
        setAdresse(user.adresse);
        setSiretNumber(user.siret_number);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur connecté :', error);
      }
    };

    fetchConnectedUser();
  }, []);

  const handleSubmit = async () => {
    try {
      // Enregistrer les modifications dans AsyncStorage
      const updatedUser = { ...connectedUser, name, email, adresse, siret_number: siretNumber };
      await AsyncStorage.setItem('connectedUser', JSON.stringify({ data: updatedUser }));
      Alert.alert('Succès', 'Les modifications ont été enregistrées avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des modifications :', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'enregistrement des modifications.');
    }
  };

  return (
    <View style={styles.container}>
      {connectedUser ? (
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <FontAwesome name="user" size={24} color="#2AAA8A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputGroup}>
            <FontAwesome name="envelope" size={24} color="#2AAA8A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputGroup}>
            <FontAwesome name="address-card" size={24} color="#2AAA8A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              value={adresse}
              onChangeText={setAdresse}
            />
          </View>
          <View style={styles.inputGroup}>
            <FontAwesome name="credit-card" size={24} color="#2AAA8A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Numéro Siret"
              value={siretNumber.toString()}
              onChangeText={setSiretNumber}
            />
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
            <Text style={styles.updateButtonText}>
              UPDATE
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Chargement des informations de l'utilisateur...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    padding: 30
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2AAA8A',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: "#088F8F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    width: "60%",
    marginLeft: "20%",
    borderRadius: 40
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  }
});

export default ProfileScreen;
