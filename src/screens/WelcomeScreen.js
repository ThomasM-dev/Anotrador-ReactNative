import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    
    const checkIfFirstTime = async () => {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
        if (hasSeenWelcome) {
          navigation.replace("Home"); 
        }
      } catch (error) {
        console.error("Error al verificar la pantalla de bienvenida:", error);
      }
    };

    checkIfFirstTime();
  }, []);

  
  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem("hasSeenWelcome", "true");
      navigation.replace("Home");
    } catch (error) {
      console.error("Error al guardar la preferencia de bienvenida:", error);
      Alert.alert("Error", "Hubo un problema al continuar.");
    }
  };

  
  const handleExit = () => {
    BackHandler.exitApp(); 
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Título */}
      <Text style={styles.title}>¡Bienvenido a tu Anotador!</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Organiza tus notas de forma sencilla y segura.
      </Text>

      {/* Descripción */}
      <Text style={styles.description}>
        Con esta aplicación podrás:
        {"\n"}- Crear y organizar tus anotaciones.
        {"\n"}- Personalizar el texto con negrita, colores y tamaños.
        {"\n"}- Enumerar tus notas para mejor organización.
        {"\n"}- Cerrar la aplicación con un solo clic.
      </Text>

      {/* Botón "Continuar" */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        accessibilityLabel="Continuar a la pantalla principal"
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      {/* Botón "Salir" */}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={handleExit}
        accessibilityLabel="Salir de la aplicación"
      >
        <Text style={styles.exitButtonText}>Salir</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#df0136",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "left",
    marginBottom: 30,
    lineHeight: 24, 
  },
  button: {
    backgroundColor: "#df0136",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  exitButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  exitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default WelcomeScreen;