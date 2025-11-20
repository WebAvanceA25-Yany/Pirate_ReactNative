import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import useFetch from "../composables/useFetch";
import useLocalStorage from "../composables/useLocalStorage";

interface HeaderProps {
  onLogout?: () => void;
}
const Header = ({ onLogout } : HeaderProps) => {
  const { GET, POST } = useFetch();
  const { removeItem: removeToken } = useLocalStorage<string>("token");

  const [user, setUser] = useState<any>(null);

  const loadUser = async () => {
    try {
      const res = await GET<any>("/auth/me");
      setUser(res.user);
    } catch (e) {
      console.log("Erreur /me :", e);
    }
  };

  const handleLogout = async () => {
    try {
      await POST("/auth/logout", {}); 
    } catch {}
    
    await removeToken();
    onLogout?.();
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <View
      style={{
        width: "100%",
        padding: 15,
        backgroundColor: "#eee",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        {user ? `Connecté en tant que : ${user.username}` : "Chargement..."}
      </Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Header;
