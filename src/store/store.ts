import { configureStore } from '@reduxjs/toolkit';
import adsReducer from "./slices/adsSlice"

export const store = configureStore({
  reducer: {
    ads: adsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
