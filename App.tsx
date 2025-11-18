import React, { useState } from "react";
import LoginScreen from "./components/login";
import ShipsScreen from "./components/HomeScreen";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <ShipsScreen onLogout={() => setLoggedIn(false)} />
  ) : (
    <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />
  );
}

