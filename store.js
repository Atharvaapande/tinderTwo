import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuration for persisting the user slice
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["user"], // Only persist the 'user' slice
};

// Wrap the user slice reducer with the persist reducer
const persistedUserReducer = persistReducer(persistConfig, userSlice);

// Configure the store
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor to persist and rehydrate the store
export const persistor = persistStore(store);

export default store;
