import React from "react";
import { View, Text } from "react-native";
import Header from "./Header";
import ListShips from "./ListShips";


const ShipsScreen = ({ onLogout }: any) => {
  return (
    <View style={{ flex: 1 }}>
      <Header onLogout={onLogout} />
      <ListShips />
    </View>
  );
};

export default ShipsScreen;
