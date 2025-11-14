import React, { useState } from "react";
import LoginScreen from "./components/login";
import ShipsScreen from "./components/ships";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <ShipsScreen />
  ) : (
    <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />
  );
}
