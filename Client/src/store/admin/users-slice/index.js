import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchUsers",
  async ({ page = 1, limit = 10 }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASEURL_FOR_SERVER}/api/admin/users?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateUserRole = createAsyncThunk(
  "adminUsers/updateRole",
  async ({ userId, newRole }) => {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASEURL_FOR_SERVER}/api/admin/users/${userId}/role`,
      { role: newRole },
      { withCredentials: true }
    );
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map(user => 
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;