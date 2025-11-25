 
 import { StyleSheet } from 'react-native';
 export const styles = StyleSheet.create({
 container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { marginTop: 15, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 20, marginTop: 5 },
  selector: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 5, marginTop: 5, backgroundColor: '#f9f9f9' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '60%' },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' }
});