// src/navigation/Routes.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeScreen from "../screens/HomeScreen";
import EditorScreen from "../screens/EditorScreen";


const Stack = createStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false, // Ocultar el encabezado por defecto
        gestureEnabled: true, // Habilitar gestos para navegar hacia atrás
        animationEnabled: true, // Habilitar animaciones de transición
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Editor" component={EditorScreen}/>
    </Stack.Navigator>
  );
};

export default Routes;