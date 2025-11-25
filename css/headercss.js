import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 4,
  },
  userInfoContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  adminBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  Viewheader: {
    width: "100%",
    padding: 15,
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    },
  adminText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
});