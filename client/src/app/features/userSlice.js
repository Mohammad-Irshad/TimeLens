import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const signUpUser = createAsyncThunk(
  "user/signup",
  async (signUpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://timelens-server.vercel.app/userSignup`,
        signUpData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://timelens-server.vercel.app/userLogin`,
        loginData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

const storedUser = sessionStorage.getItem("userData");

export const userSlice = createSlice({
  name: "user",
  initialState: {
    logedInUser: storedUser ? JSON.parse(storedUser) : {},
    status: "idle",
    error: false,
  },
  reducers: {
    saveLoginUser: (state, action) => {
      const access_token = Cookies.get("access_token");
      state.logedInUser = action.payload;
      sessionStorage.setItem("userData", JSON.stringify(action.payload)); // Save to sessionStorage
      sessionStorage.setItem("access_token", access_token);
    },
    logoutUser: (state) => {
      state.logedInUser = {};
      sessionStorage.removeItem("userData"); // Clear sessionStorage on logout
      sessionStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        localStorage.setItem("accessToken", action.payload.accessToken);
        state.logedInUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(signUpUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = "error";
      });
  },
});

export const { saveLoginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
