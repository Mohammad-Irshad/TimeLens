import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const uploadAImage = createAsyncThunk(
  "image/uploadAImage",
  async (imageData, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      console.log("What I get at image slice:", imageData);

      const formData = new FormData();
      formData.append("image", imageData.image);
      formData.append("albumId", imageData.albumId);
      formData.append("ownerId", imageData.ownerId);
      formData.append("name", imageData.name);
      formData.append("tags", JSON.stringify(imageData.tags)); // Convert array to JSON
      formData.append("persons", JSON.stringify(imageData.persons)); // Convert array to JSON

      const response = await axios.post(
        `https://timelens-server.vercel.app/albums/${imageData.albumId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      return rejectWithValue(error.response?.data || "Image upload failed");
    }
  }
);

export const getAllTheImages = createAsyncThunk(
  "image/getAllTheImages",
  async (ownerId, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `https://timelens-server.vercel.app/images`,
        {
          headers: {
            logedinuserid: ownerId,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Image fetch error:", error);
      return rejectWithValue(error.response?.data || "Image fetch failed");
    }
  }
);

export const getAnAlbumImages = createAsyncThunk(
  "images/getAnAlbumImages",
  async (albumId, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.get(
        `https://timelens-server.vercel.app/images/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Selected album images are : ", response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateTheImage = createAsyncThunk(
  "image/updateTheImage",
  async ({ id, updatedData }, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.put(
        `https://timelens-server.vercel.app/images/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Image update error:", error);
      return rejectWithValue(error.response?.data || "Image update failed");
    }
  }
);

export const deleteTheImage = createAsyncThunk(
  "image/deleteTheImage",
  async (id, { rejectWithValue }) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await axios.delete(
        `https://timelens-server.vercel.app/images/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Deleted image : ", response.data);
      return response.data;
    } catch (error) {
      console.error("Image fetch error:", error);
      return rejectWithValue(error.response?.data || "Image fetch failed");
    }
  }
);

export const imageSlice = createSlice({
  name: "image",
  initialState: {
    allImages: [],
    anAlbumImages: [],
    status: "idle",
    error: false,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const indexOFImage = state.allImages.findIndex(
        (img) => img._id === action.payload.imageId
      );

      if (indexOFImage !== -1) {
        state.allImages[indexOFImage].isFavorite =
          !state.allImages[indexOFImage].isFavorite;
      }
    },
    updateComment: (state, action) => {
      console.log("Update comment called", action.payload);
      const indexOfImage = state.anAlbumImages.findIndex(
        (img) => img._id === action.payload.id
      );
      console.log("Before ", state.anAlbumImages);
      if (indexOfImage !== -1) {
        state.anAlbumImages[indexOfImage].comments =
          action.payload.updatedData.comments;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadAImage.fulfilled, (state, action) => {
        state.status = "success";
        state.allImages.unshift(action.payload);
      })
      .addCase(uploadAImage.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(getAllTheImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTheImages.fulfilled, (state, action) => {
        state.status = "success";
        state.allImages = action.payload.allImages;
      })
      .addCase(getAllTheImages.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(updateTheImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTheImage.fulfilled, (state, action) => {
        state.status = "success";
        const indexOfImage = state.allImages.findIndex(
          (img) => img._id === action.payload.updatedImage._id
        );

        if (indexOfImage !== -1) {
          state.allImages[indexOfImage] = action.payload.updatedImage;
        }
      })
      .addCase(updateTheImage.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(deleteTheImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTheImage.fulfilled, (state, action) => {
        state.status = "success";
        state.allImages = state.allImages.filter(
          (img) => img._id != action.payload.deletedImage._id
        );
      })
      .addCase(deleteTheImage.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      })
      .addCase(getAnAlbumImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAnAlbumImages.fulfilled, (state, action) => {
        state.status = "success";
        state.anAlbumImages = action.payload.albumImages;
        console.log("state.anAlbumImages after update : ", state.anAlbumImages);
      })
      .addCase(getAnAlbumImages.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.message;
      });
  },
});

export const { toggleFavorite, updateComment } = imageSlice.actions;

export default imageSlice.reducer;
