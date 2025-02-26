import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const fadeAnim = new Animated.Value(0);

  
  useEffect(() => {
    loadNotes();
    fadeIn();
  }, []);

  
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600, 
      useNativeDriver: true,
    }).start();
  };

  
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Error cargando notas:", error);
      Alert.alert("Error", "Hubo un problema al cargar tus notas.");
    }
  };

  
  const handleDeleteNote = async (id) => {
    try {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } catch (error) {
      console.error("Error eliminando nota:", error);
      Alert.alert("Error", "Hubo un problema al eliminar la nota.");
    }
  };

  
  const deleteNote = (id) => {
    Alert.alert(
      "Eliminar Nota",
      "¿Estás seguro de que quieres eliminar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => handleDeleteNote(id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Título */}
      <Text style={styles.title}>📒 Tus Anotaciones</Text>

      {/* Mensaje cuando no hay notas */}
      {notes.length === 0 ? (
        <Text style={styles.noNotes}>No hay anotaciones aún.</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <View style={styles.noteActions}>
                {/* Botón de editar */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("Editor", { note: item })}
                  accessibilityLabel={`Editar nota: ${item.title}`}
                >
                  <Text style={styles.editButton}>✏️ Editar</Text>
                </TouchableOpacity>

                {/* Botón de eliminar */}
                <TouchableOpacity
                  onPress={() => deleteNote(item.id)}
                  accessibilityLabel={`Eliminar nota: ${item.title}`}
                >
                  <Text style={styles.deleteButton}>🗑️ Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Botón flotante para agregar una nueva nota */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Editor")}
        accessibilityLabel="Agregar nueva nota"
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#df0136",
    textAlign: "center",
    marginBottom: 20,
  },
  noNotes: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  noteItem: {
    backgroundColor: "#1e2a38",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  noteTitle: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    color: "#ff4444",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#df0136",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default HomeScreen;