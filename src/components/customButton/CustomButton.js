import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

const CustomButton = ({ onPress, text, type= 'PRIMARY', bgColor, fgColor }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? { backgroundColor: bgColor } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 25,
  },
  container_PRIMARY: {
    backgroundColor: "#3B71F3",
  },
  ontainer_TERTIARY: {
    backgroundColor: "#3B71F3",
  },
  text_PRIMARY: {
    fontWeight: "bold",
    color: "white",
  },
  text_TERTIARY: {
    color: 'gray'
  }
});

export default CustomButton;
