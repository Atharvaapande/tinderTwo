import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import AppLayout from "./screens/AppLayout";
import { NavigationContainer } from "@react-navigation/native";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
import { Provider } from "react-redux";
import { LogBox } from "react-native";
import { StrictMode } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  LogBox.ignoreAllLogs(true);
  return (
    <StrictMode>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <AppLayout />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </ClerkProvider>
    </StrictMode>
  );
}
