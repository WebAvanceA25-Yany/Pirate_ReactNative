import React from "react";
import { View, Text } from "react-native";
import Header from "../components/Header";

const ShipsScreen = ({ onLogout }: any) => {
  return (
    <View style={{ flex: 1 }}>
      <Header onLogout={onLogout} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Liste des ships (à venir)</Text>
      </View>
    </View>
  );
};

export default ShipsScreen;
