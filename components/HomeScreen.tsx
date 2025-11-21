import React, { useState } from "react";
import { View } from "react-native";
import Header from "./Header";
import ListShips from "./ListShips";
import AddShip from "./AddShip"; 

const ShipsScreen = ({ onLogout }: any) => {
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  
  return (
    <View style={{ flex: 1 }}>
      <Header onLogout={onLogout} />
      
      {currentView === "list" ? (
        <ListShips onAdd={() => setCurrentView("add")} />
      ) : (
        <AddShip onBack={() => setCurrentView("list")} />
      )}
    </View>
  );
};

export default ShipsScreen;