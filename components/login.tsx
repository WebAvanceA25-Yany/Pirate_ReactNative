import React, { useState } from "react";
import { Alert, Button, TextInput, View, Text } from "react-native";
import useFetch from "../composables/useFetch";
import useLocalStorage from "../composables/useLocalStorage";

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { POST } = useFetch();
  const { setItem: setToken } = useLocalStorage<string>("token");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await POST<{ username: string; password: string }, any>(
        "/auth/login",
        { username, password }
      );
        console.log("Réponse de connexion :", res);
      const token = res?.token || null;

      if (!token) {
        setError("Identifiants invalides.");
        return;
      }

      setToken(token);
      Alert.alert("Succès", "Connexion réussie !");
      
      onLoginSuccess?.();
    } catch (e: any) {
      setError(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nom d’utilisateur</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Mot de passe</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}

      <Button
        title={loading ? "Connexion..." : "Se connecter"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

export default LoginScreen;
