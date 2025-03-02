import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditorScreen = ({ route, navigation }) => {
  const { note } = route.params || {};
  const [content, setContent] = useState(note?.content || "");
  const textInputRef = useRef(null);

  // Guardar la nota con manejo de errores mejorado
  const saveNote = async () => {
    if (!content.trim()) {
      navigation.goBack(); // Si está vacío, simplemente regresa
      return;
    }

    const newNote = {
      id: note?.id || Date.now().toString(),
      title: content.split("\n")[0].substring(0, 30) || "Nota sin título",
      content,
      updatedAt: Date.now(), // Añadir timestamp para ordenamiento futuro
    };

    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      const updatedNotes = note
        ? notes.map((n) => (n.id === note.id ? newNote : n))
        : [...notes, newNote];

      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar la nota:", error);
      // Podrías agregar un toast aquí si usas una librería de notificaciones
    }
  };

  // Aplicar formato con lógica mejorada
  const applyFormat = (symbol, type = "text") => {
    const selection = textInputRef.current?.selection || { start: 0, end: 0 };
    const { start, end } = selection;
    let newContent = content;

    if (type === "list") {
      // Identificar la línea actual
      const lines = content.split("\n");
      const lineIndex = content.substring(0, start).split("\n").length - 1;
      const currentLine = lines[lineIndex];

      // Alternar formato de lista
      if (currentLine.startsWith(symbol)) {
        lines[lineIndex] = currentLine.replace(new RegExp(`^${symbol}`), "");
      } else {
        lines[lineIndex] = `${symbol}${currentLine}`;
      }
      newContent = lines.join("\n");
    } else {
      const selectedText = content.slice(start, end);
      const isFormatted = selectedText.startsWith(symbol) && selectedText.endsWith(symbol);

      if (start === end) {
        // Si no hay selección, insertar el símbolo en la posición del cursor
        newContent = content.slice(0, start) + symbol + symbol + content.slice(end);
        textInputRef.current?.setNativeProps({ selection: { start: start + symbol.length, end: start + symbol.length } });
      } else if (isFormatted) {
        // Quitar formato si ya está aplicado
        newContent =
          content.slice(0, start) +
          selectedText.slice(symbol.length, -symbol.length) +
          content.slice(end);
      } else {
        // Aplicar formato al texto seleccionado
        newContent = content.slice(0, start) + symbol + selectedText + symbol + content.slice(end);
      }
    }

    setContent(newContent);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Barra de herramientas */}
        <View style={styles.toolbar}>
          <ToolbarButton onPress={() => applyFormat("**")} label="B" />
          <ToolbarButton onPress={() => applyFormat("_")} label="I" />
          <ToolbarButton onPress={() => applyFormat("# ")} label="H1" />
          <ToolbarButton onPress={() => applyFormat("## ")} label="H2" />
          <ToolbarButton onPress={() => applyFormat("- ", "list")} label="•" />
          <ToolbarButton onPress={() => applyFormat("1. ", "list")} label="1." />
          <TouchableOpacity onPress={saveNote} style={styles.saveButton}>
            <Text style={styles.toolbarText}>✓</Text>
          </TouchableOpacity>
        </View>

        {/* Área de edición */}
        <TextInput
          ref={textInputRef}
          style={styles.editor}
          multiline
          value={content}
          onChangeText={setContent}
          placeholder="Escribe aquí..."
          placeholderTextColor="#666"
          selectionColor="#fff"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Componente de botón para la barra de herramientas
const ToolbarButton = ({ onPress, label }) => (
  <TouchableOpacity onPress={onPress} style={styles.toolbarButton}>
    <Text style={styles.toolbarText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#000",
    gap: 15,
  },
  toolbarButton: {
    padding: 5,
  },
  toolbarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  editor: {
    flex: 1,
    padding: 20,
    color: "#fff",
    fontSize: 16,
    textAlignVertical: "top",
  },
  saveButton: {
    padding: 5,
    marginLeft: "auto", // Empuja el botón de guardar a la derecha
  },
});

export default EditorScreen;