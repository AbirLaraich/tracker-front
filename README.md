# Suivi des Circuits Courts Alimentaires via la Blockchain

## Description

Ce projet vise à améliorer la traçabilité alimentaire et la transparence des circuits courts de proximité grâce à une application mobile intégrant la technologie blockchain. Les utilisateurs (producteurs, distributeurs, et consommateurs) peuvent enregistrer et consulter les données alimentaires, certifier les produits locaux, et garantir l'origine et le cheminement des produits.

## Fonctionnalités

* **Inscription et connexion**
  * Gestion des comptes pour les producteurs et distributeurs
  * Authentification sécurisée

* **Gestion des lots et des produits**
  * Création et consultation des lots (producteurs)
  * Transformation des lots en produits (distributeurs)
  * Suivi détaillé des modifications

* **Traçabilité des commandes**
  * Suivi en temps réel de l'état des commandes
  * Vérification des circuits courts via la blockchain
  * Historique complet des transactions

* **Lecture de QR Code**
  * Interface de scan pour les consommateurs
  * Vérification instantanée de l'origine des produits

* **Certification via Blockchain**
  * Enregistrement immuable des données
  * Transparence totale de la chaîne d'approvisionnement

## Technologies utilisées

### Front-End
* React Native (interfaces mobiles multiplateformes iOS/Android)
* JavaScript (langage principal)

### Back-End
* Spring Boot (Framework Java pour API RESTful)
* PostgreSQL (Base de données relationnelle)

### Blockchain
* Ganache (Simulation blockchain Ethereum)
* Solidity (Développement smart contracts)
* Truffle Suite (Gestion/test smart contracts)
* MetaMask (Intégration portefeuilles Ethereum)

### Outils
* Postman (Tests d'API)

## Installation

### Prérequis

* Node.js et npm
* PostgreSQL
* Ganache
* MetaMask (extension navigateur)

### Étapes d'installation

1. **Front-End**
   ```bash
   # Cloner le dépôt
   git clone https://github.com/AbirLaraich/tracker-front.git
   
   # Installer les dépendances
   cd tracker-front
   npm install
   ```

2. **Back-End**
   ```bash
   # Cloner le dépôt
   git clone https://github.com/AbirLaraich/tracker-api.git
   ```

3. **Smart Contracts**
   * Compiler et déployer via Truffle
   * Configurer la connexion entre Ganache et MetaMask

4. **Lancement**
   ```bash
   npm start
   ```