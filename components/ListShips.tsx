import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Button, ScrollView } from "react-native";
import useFetch from "../composables/useFetch";
import { styles } from "../css/listeShip";

interface ListShipsProps {
  onAdd: () => void;
}

const ListShips = ({ onAdd }: ListShipsProps) => {
  const { GET } = useFetch();
  const [ships, setShips] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShip, setSelectedShip] = useState<any>(null);

  const loadShips = async () => {
    try {
      setError(null);
      const res = await GET<any[]>("/ships");
      setShips(res || []);
    } catch (e: any) {
      setError("Impossible de charger les bateaux.");
      console.log("Erreur ships :", e);
    }
  };

  useEffect(() => {
    loadShips();
  }, []);

  const handleLongPress = (ship: any) => {
    setSelectedShip(ship);
    setModalVisible(true);
  };

  if (error) {
    return <Text> {error} </Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Bateaux</Text>
      <ScrollView>
        {ships.length === 0 ? (
          <Text style={styles.empty}>Aucun bateau pour le moment.</Text>
        ) : (
          ships.map((ship, i) => (
            <TouchableOpacity
              key={i}
              style={styles.row}
              onLongPress={() => handleLongPress(ship)}
            >
              <Text style={styles.cellName}>{ship.name}</Text>
              <Text style={styles.cell}>{ship.captain}</Text>
              <Text style={styles.cell}>{ship.goldCargo} Or</Text>
              <Text style={styles.cell}>{ship.crewSize} Or</Text>
              <Text style={styles.cell}>{ship.status}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View>
        <Button title="Ajouter ships" onPress={onAdd} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedShip && (
              <>
                <Text style={styles.modalTitle}>{selectedShip.name}</Text>
                <Text style={styles.infoText}>Capitaine : {selectedShip.captain}</Text>
                <Text style={styles.infoText}>Équipage : {selectedShip.crewSize}</Text>
                <Text style={styles.infoText}>Trésor : {selectedShip.goldCargo}</Text>
                <Text style={styles.infoText}>Statut : {selectedShip.status}</Text>
                <Text style={styles.infoText}>Créé par : {selectedShip.createdBy}</Text>
                <Text style={styles.infoText}>Créé le : {selectedShip.createdAt}</Text>
                <Text style={styles.infoText}>Modifier le : {selectedShip.updatedAt}</Text>

                <View style={styles.modalButtons}>
                  <View style={{ width: 10 }} />
                  <Button
                    title="Fermer"
                    color="grey"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListShips;