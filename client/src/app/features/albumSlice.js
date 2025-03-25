import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAlbum = createAsyncThunk(
  "album/createAlbum",
  async (albumData, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.post(
        `https://timelens-server.vercel.app/albums`,
        albumData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllTheAlbums = createAsyncThunk(
  "album/getAllTheAlbums",
  async (ownerId, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `https://timelens-server.vercel.app/getAlbums/${ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const updateAAlbum = createAsyncThunk(
  "album/updateAAlbum",
  async ({ id, updatedData }, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.put(
        `https://timelens-server.vercel.app/albums/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteAAlbum = createAsyncThunk(
  "album/deleteAAlbum",
  async (id, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.delete(
        `https://timelens-server.vercel.app/albums/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllTheSharedAlbums = createAsyncThunk(
  "album/getAllTheSharedAlbums",
  async (emailID, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `https://timelens-server.vercel.app/albums/${emailID}/share`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Shared album fetch error:", error);
      return rejectWithValue(
        error.response?.data || "Shared album fetch failed"
      );
    }
  }
);

export const albumSlice = createSlice({
  name: "album",
  initialState: {
    allAlbums: [],
    albumsSharedwithMe: null,
    status: "idle",
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.status = "success";
        state.allAlbums.unshift(action.payload.album);
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(getAllTheAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTheAlbums.fulfilled, (state, action) => {
        state.status = "success";
        state.allAlbums = action.payload.albums;
      })
      .addCase(getAllTheAlbums.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(updateAAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAAlbum.fulfilled, (state, action) => {
        state.status = "success";
        let albumIndex = state.allAlbums.findIndex(
          (alb) => alb._id === action.payload.updatedAlbum._id
        );
        if (albumIndex !== -1) {
          state.allAlbums[albumIndex] = action.payload.updatedAlbum;
        }
      })
      .addCase(updateAAlbum.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(deleteAAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAAlbum.fulfilled, (state, action) => {
        state.status = "success";
        state.allAlbums = state.allAlbums.filter(
          (alb) => alb._id != action.payload.deletedAlbum._id
        );
      })
      .addCase(deleteAAlbum.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(getAllTheSharedAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTheSharedAlbums.fulfilled, (state, action) => {
        state.status = "success";
        state.albumsSharedwithMe = action.payload.sharedAlbums;
      })
      .addCase(getAllTheSharedAlbums.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      });
  },
});

export default albumSlice.reducer;
