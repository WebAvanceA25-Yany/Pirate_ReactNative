import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity, Modal } from "react-native";
import useFetch from "../composables/useFetch";
import { styles } from "../css/TransfereGold";

interface TransferGoldProps {
  onBack: () => void;
}

const TransferGold = ({ onBack }: TransferGoldProps) => {
  const { GET, POST } = useFetch();
  
  const [ships, setShips] = useState<any[]>([]);
  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  
  const [modalType, setModalType] = useState<"from" | "to" | null>(null);

  useEffect(() => {
    const load = async () => {
        const res = await GET<any[]>("/ships");
        setShips(res || []);
    };
    load();
  }, []);

  const handleTransfer = async () => {
    const valeur = parseInt(amount);
    if (fromId === toId) {
        Alert.alert("Erreur", "Choisissez deux navires différents.");
        return;
    }

    try {
        await POST("/ships/transfer", {
            fromShipId: fromId,
            toShipId: toId,
            amount: valeur
        });
        onBack();
    } catch (e: any) {
        console.log(e);
    }
  };

  // Fonction pour obtenir le nom du navire par son ID
  // Structure par IA
  const getShipName = (id: string | null) => {
      const ship = ships.find(ship => ship.id === id);
      return ship ? `${ship.name} (${ship.goldCargo} Or)` : "Choisir un navire...";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfert d'Or</Text>

      {/* SÉLECTION DEPART */}
      <Text style={styles.label}>De (Émetteur) :</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setModalType("from")}>
          <Text>{getShipName(fromId)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Vers (Receveur) :</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setModalType("to")}>
          <Text>{getShipName(toId)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Montant :</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric" 
        value={amount} 
        onChangeText={setAmount} 
        placeholder="Quantité d'or"
      />

      <Button title="Transférer" onPress={handleTransfer} color="orange" />
      <View style={{marginTop: 10}}>
        <Button title="Annuler" onPress={onBack} color="grey" />
      </View>

      <Modal visible={modalType !== null} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>Sélectionner</Text>
                <ScrollView>
                    {ships.map(ship => (
                        <TouchableOpacity 
                            key={ship.id} 
                            style={styles.item}
                            onPress={() => {
                                if (modalType === "from") setFromId(ship.id);
                                else setToId(ship.id);
                                setModalType(null);
                            }}
                        >
                            <Text>{ship.name} ({ship.goldCargo} Or)</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Button title="Fermer" onPress={() => setModalType(null)} />
            </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransferGold;