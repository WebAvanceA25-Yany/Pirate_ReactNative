import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native"; // J'ai ajouté TextInput
import useFetch from "../composables/useFetch";
import { styles } from "../css/listeShip";

interface ListShipsProps {
  onAdd: () => void;
  onTransfer: () => void;
}

const ListShips = ({ onAdd, onTransfer }: ListShipsProps) => {
  const { GET, DELETE, PATCH, POST } = useFetch();

  const [ships, setShips] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShip, setSelectedShip] = useState<any>(null);
  const [goldAmount, setGoldAmount] = useState("");
  const [crewAmount, setCrewAmount] = useState("");

  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [ports, setPorts] = useState<string[]>([]);

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

  
  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleLongPress = (ship: any) => {
    setSelectedShip(ship);
    setGoldAmount("");
    setModalVisible(true);
  };

  const handleOpenSendModal = async () => {
    if (selectedIds.length !== 1) {
      setError("Veuillez sélectionner un seul navire à envoyer.");
      return;
    }

    try {
      const userList = await GET<string[]>("/ships/send/userlist");
      setPorts(userList || []);
      setSendModalVisible(true);
    } catch (e) {
      console.log("Erreur chargement ports", e);
      setError("Impossible de charger la liste des ports.");
    }
  };

  const handleSendShip = async (recipient: string) => {
    const shipIdToSend = selectedIds[0];
    if (selectedIds.length !== 1) {
      return;
    }
    try {
      await POST(`/ships/send/${recipient}`, { id: shipIdToSend });

      setError(`Navire envoyé vers le port de ${recipient} !`);
      setSendModalVisible(false);
      setSelectedIds([]);
      loadShips();
    } catch (e) {
      console.log("Erreur envoi navire", e);
      setError(
        "Le navire n'a pas pu quitter le port (Vérifiez qu'il est bien 'docked')."
      );
    }
  };

  const handleUpdateGold = async () => {
    const amount = parseInt(goldAmount);

    try {
      await PATCH(`/ships/${selectedShip.id}/cargo/gold`, { amount: amount });
      loadShips();
      setSelectedShip(await GET(`/ships/${selectedShip.id}`));
    } catch (e) {
      console.log("Erreur update gold", e);
      alert("Erreur lors de la mise à jour de l'or (Fonds insuffisants ?)");
    }
  };

  const handleUpdateCrew = async () => {
    const amount = parseInt(crewAmount);

    try {
      await PATCH(`/ships/${selectedShip.id}/crew`, { amount: amount });
      loadShips();
      setSelectedShip(await GET(`/ships/${selectedShip.id}`));
    } catch (e) {
      console.log("Erreur update crew", e);
      alert("Impossible de modifier l'équipage (Min 1 et Max 500)");
    }
  };

  const handleDelete = async () => {
    try {
      for (const id of selectedIds) {
        await DELETE(`/ships/${id}`);
      }
      setSelectedIds([]);
      loadShips();
    } catch (e) {
      console.log("Erreur delete", e);
      setError("Impossible de supprimer certains navires.");
    }
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
          ships.map((ship, i) => {
            const isSelected = selectedIds.includes(ship.id);
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.row,
                  isSelected && {
                    backgroundColor: "#d3eafc",
                    borderColor: "#2196F3",
                  },
                ]}
                onPress={() => toggleSelection(ship.id)}
                onLongPress={() => handleLongPress(ship)}
              >
                <Text>{isSelected ? "x " : ""}</Text>
                <Text style={styles.cellName}>{ship.name}</Text>
                <Text style={styles.cell}>{ship.captain}</Text>
                <Text style={styles.cell}>{ship.goldCargo} Or</Text>
                <Text style={styles.cell}>{ship.crewSize} H.</Text>
                <Text style={styles.cell}>{ship.createdBy}</Text>
                <Text style={styles.cell}>{ship.status}</Text>
                <Text style={styles.cell}>{ship.createdAt}</Text>
                <Text style={styles.cell}>{ship.updatedAt}</Text>
                <Text style={styles.cell}>{ship.pillagedCount}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View style={{ padding: 10 }}>
        <Button 
            title="⇄ Transfert Or" 
            color="#FFD700" // Couleur Or
            onPress={onTransfer} 
        />
        <Button
          title={`Supprimer (${selectedIds.length})`}
          color="red"
          onPress={handleDelete}
        />
        <Button title="Ajouter ships" onPress={onAdd} />
        <Button
          title="Changer de port ⚓️"
          color="purple"
          onPress={handleOpenSendModal}
        />
      </View>

      {/* modale pour modifer crew et or   */}
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
                <Text
                  style={[
                    styles.infoText,
                    { fontSize: 18, marginVertical: 10 },
                  ]}
                >
                  Or actuel : {selectedShip.goldCargo}
                </Text>

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={goldAmount}
                  onChangeText={setGoldAmount}
                />

                <Text
                  style={[
                    styles.infoText,
                    { fontSize: 18, marginVertical: 10 },
                  ]}
                >
                  crew actuel : {selectedShip.crewSize}
                </Text>

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={crewAmount}
                  onChangeText={setCrewAmount}
                />

                <View style={styles.modalButtons}>
                  <Button title="Valider OR" onPress={handleUpdateGold} />
                  <View style={{ height: 10, margin: 10 }} />
                  <Button title="Valider CREW" onPress={handleUpdateCrew} />
                  <View style={{ height: 10, margin: 10 }} />
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

      {/* MODAL CHANGER DE PORT */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sendModalVisible}
        onRequestClose={() => setSendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir une destination</Text>
            <Text style={{ marginBottom: 15, textAlign: "center" }}>
              Vers quel port souhaitez-vous envoyer le navire ?
            </Text>

            <ScrollView style={{ maxHeight: 200, width: "100%" }}>
              {ports.length === 0 ? (
                <Text style={{ textAlign: "center", fontStyle: "italic" }}>
                  Aucun autre port disponible.
                </Text>
              ) : (
                ports.map((portName, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.portItem}
                    onPress={() => handleSendShip(portName)}
                  >
                    <Text style={styles.portText}> Port de {portName}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <View style={{ marginTop: 20, width: "100%" }}>
              <Button
                title="Annuler"
                color="grey"
                onPress={() => setSendModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListShips;
