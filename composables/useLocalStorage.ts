import { Platform } from "react-native";

let AsyncStorage: any = null;

if (Platform.OS !== "web") {
  try {
    AsyncStorage = require("@react-native-async-storage/async-storage").default;
  } catch (e) {
    console.warn("AsyncStorage non disponible :", e);
  }
}

const useStorage = <T>(key: string) => {

  const setItem = async (value: T): Promise<void> => {
    const json = JSON.stringify(value);

    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, json);
      }
      return;
    }

    if (AsyncStorage) {
      await AsyncStorage.setItem(key, json);
    }
  };

  const getItem = async (): Promise<T | null> => {
    let raw: string | null = null;

    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        raw = localStorage.getItem(key);
      }
    } else {
      if (AsyncStorage) {
        raw = await AsyncStorage.getItem(key);
      }
    }

    return raw ? JSON.parse(raw) : null;
  };

  const removeItem = async (): Promise<void> => {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
      return;
    }

    if (AsyncStorage) {
      await AsyncStorage.removeItem(key);
    }
  };

  return { setItem, getItem, removeItem };
};

export default useStorage;
