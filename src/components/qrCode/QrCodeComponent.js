import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeComponent = ({ qrCodeData }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <QRCode
        value={qrCodeData}
        size={200} // Taille du QR code
        color="black" // Couleur des modules du QR code
        backgroundColor="white" // Couleur de fond du QR code
      />
    </View>
  );
};

export default QRCodeComponent;
