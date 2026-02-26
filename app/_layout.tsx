import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "@/src/navigation/AppNavigator";
import { AppContextProvider } from "@/src/context/AppContext";
import { theme } from "@/src/constants/theme";
import RootNavigator from "@/src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppContextProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </AppContextProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
