import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import useFetch from "../composables/useFetch";
import { styles } from "../css/AddShip";

interface AddShipProps {
    onBack: () => void;
}

const AddShip = ({ onBack }: AddShipProps) => {
    const { POST } = useFetch();

    const [name, setName] = useState("");
    const [goldCargo, setgoldCargo] = useState("");
    const [captain, setcaptain] = useState("");
    const [status, setstatus] = useState("");
    const [crewSize, setcrewSize] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError("");
        const crew = parseInt(crewSize, 10);
        if (isNaN(crew) || crew < 1 || crew > 500) {
            setError("La taille de l'équipage doit être comprise entre 1 et 500.");
            return;
        }

        const gold = parseInt(goldCargo, 10);
        if (isNaN(gold) || gold < 1 || gold > 1000000) {
            setError("Le nombre de gold doit être compris entre 1 et 1 000 000.");
            return;
        }

        const validStatus = ["docked", "sailing"];
        if (!validStatus.includes(status.toLowerCase())) {
            setError("Le status doit être 'docked' ou 'sailing'.");
            return;
        }

        setLoading(true);
        try {
            await POST("/ships", {
                name,
                goldCargo,
                captain,
                status,
                crewSize
            });

            Alert.alert("Succès", "Navire ajouté !");
            onBack();
        } catch (e: any) {
            console.error(e);
            setError("Impossible d'ajouter le navire. Vous n'avez pas la permission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajouter un Navire</Text>

            <Text style={styles.label}>Nom du navire</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Nombre de gold</Text>
            <TextInput
                style={styles.input}
                value={goldCargo}
                onChangeText={setgoldCargo}
                placeholder="1 - 1 000 000"
            />

            <Text style={styles.label}>Le status du bateau</Text>
            <TextInput
                style={styles.input}
                value={status}
                onChangeText={setstatus}
                placeholder="sailing or docked "

            />

            <Text style={styles.label}>Le capitaine</Text>
            <TextInput
                style={styles.input}
                value={captain}
                onChangeText={setcaptain}
            />

            <Text style={styles.label}>Équipage initial</Text>
            <TextInput
                style={styles.input}
                value={crewSize}
                onChangeText={setcrewSize}
                keyboardType="numeric"
                placeholder="1 - 500"
            />

            <View style={styles.buttonContainer}>
                <Button title={loading ? "Envoi..." : "Créer"} onPress={handleSubmit} disabled={loading} />
                <View style={{ height: 10 }} />
                <Button title="Annuler" color="red" onPress={onBack} />
                {error && <Text style={styles.label}>{error}</Text>}
            </View>
        </View>
    );
};

export default AddShip;