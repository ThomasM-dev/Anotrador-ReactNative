import React, { useRef, useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const EditorScreen = ({ route, navigation }) => {
  const { note } = route.params || {}; // Recibir nota existente (si existe)
  const richTextRef = useRef(null);
  const [content, setContent] = useState(note?.content || "");

  // Guardar la nota
  const saveNote = async () => {
    try {
      const newNote = {
        id: note?.id || Date.now().toString(),
        title: content.substring(0, 20) || "Nueva nota",
        content,
      };

      const storedNotes = await AsyncStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];

      const updatedNotes = note
        ? notes.map((n) => (n.id === note.id ? newNote : n))
        : [...notes, newNote];

      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      navigation.goBack();
    } catch (error) {
      console.error("Error guardando nota:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Barra de herramientas */}
      <RichToolbar
        editor={richTextRef}
        actions={[
          "bold",
          "italic",
          "underline",
          "insertBulletsList",
          "insertOrderedList",
          "setFontSize",
          "setColor",
        ]}
        iconMap={{
          setFontSize: () => <Text style={styles.toolbarIcon}>T</Text>,
          setColor: () => <Text style={styles.toolbarIcon}>🎨</Text>,
        }}
        style={styles.toolbar}
      />

      {/* Área de edición */}
      <RichEditor
        ref={richTextRef}
        initialContentHTML={note?.content || ""}
        onChange={(text) => setContent(text)}
        placeholder="Escribe tu nota aquí..."
        style={styles.editor}
      />

      {/* Botón de guardar */}
      <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    backgroundColor: "#df0136",
    padding: 10,
    borderRadius: 5,
  },
  toolbarIcon: {
    color: "#fff",
    fontSize: 20,
  },
  editor: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#1e2a38",
    color: "#fff",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#df0136",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditorScreen;