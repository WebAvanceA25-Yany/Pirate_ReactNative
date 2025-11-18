import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import useFetch from "../composables/useFetch";

const ListShips = () => {
  const { GET } = useFetch();
  const [ships, setShips] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadShips = async () => {
    try {
      setError(null);

      const res = await GET<any[]>("/ships");

      if (res) {
        setShips(res);
      } else {
        setShips([]);
      }
    } catch (e: any) {
      setError("Impossible de charger les bateaux.");
      console.log("Erreur ships :", e);
    }
  };

  useEffect(() => {
    loadShips();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Bateaux</Text>

      {ships.length === 0 ? (
        <Text style={styles.empty}>Aucun bateau pour le moment.</Text>
      ) : (
        ships.map((ship, i) => (
          <View key={i} style={styles.shipCard}>
            <Text style={styles.shipName}>{ship.name}</Text>
            <Text style={styles.shipInfo}> goldCargo :{ship.goldCargo}</Text>
            <Text style={styles.shipInfo}> captain : {ship.captain}</Text>
            <Text style={styles.shipInfo}> status :{ship.status}</Text>
            <Text style={styles.shipInfo}> crewSize : {ship.crewSize}</Text>
            <Text style={styles.shipInfo}> createdBy : {ship.createdBy}</Text>
            <Text style={styles.shipInfo}> createdAt : {ship.createdAt}</Text>
            <Text style={styles.shipInfo}> updatedAt : {ship.updatedAt}</Text>            
          </View>
        ))
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  shipCard: {
    backgroundColor: "#f3f3f3",
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
  },
  shipName: {
    fontSize: 18,
    fontWeight: "600",
  },
  shipInfo: {
    fontSize: 14,
    color: "#555",
  },
  empty: {
    fontSize: 16,
    color: "#777",
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});

export default ListShips;
