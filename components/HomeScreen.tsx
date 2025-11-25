import React, { useState } from "react";
import { View } from "react-native";
import Header from "./Header";
import ListShips from "./ListShips";
import AddShip from "./AddShip"; 
import TransferGold from "./TransferGold"; 

const ShipsScreen = ({ onLogout }: any) => {
  const [currentView, setCurrentView] = useState<"list" | "add" | "transfer">("list");
  
  return (
    <View style={{ flex: 1 }}>
      <Header onLogout={onLogout} />
      
      {currentView === "list" ? (
        <ListShips 
            onAdd={() => setCurrentView("add")} 
            onTransfer={() => setCurrentView("transfer")} 
        />
      ) : currentView === "add" ? (
        <AddShip onBack={() => setCurrentView("list")} />
      ) : (
        <TransferGold onBack={() => setCurrentView("list")} />
      )}
    </View>
  );
};

export default ShipsScreen;