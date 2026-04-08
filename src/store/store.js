import { configureStore } from "@reduxjs/toolkit";
import { authReducers } from "../store/store";
const store = configureStore({
  reducers: { authReducers },
});

export default store;
