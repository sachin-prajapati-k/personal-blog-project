import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../store/authSlice";
export const store = configureStore({
  reducer: authReducers,
});
