import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import albumSlice from "../features/albumSlice";
import imageSlice from "../features/imageSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    album: albumSlice,
    image: imageSlice,
  },
});

export default store;
