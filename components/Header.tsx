import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import useFetch from "../composables/useFetch";
import useLocalStorage from "../composables/useLocalStorage";
import { styles } from "../css/headercss";

interface HeaderProps {
  onLogout?: () => void;
}
const Header = ({ onLogout } : HeaderProps) => {
  const { GET, POST } = useFetch();
  const { removeItem: removeToken } = useLocalStorage<string>("token");

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadUser = async () => {
    try {

      const res = await GET<any>("/auth/me");
      setUser(res.user);

    } catch (e) {
      console.log("Erreur chargement user :", e);
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
    <View style={styles.Viewheader}
    >
      <Text style={{ fontWeight: "bold" }}>
        {user ? `Connecté en tant que : ${user.username}` : "Chargement..."}
        {user.isAdmin && (
            <Text style={styles.adminText}>  ADMIN </Text>
        )}
      </Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Header;
