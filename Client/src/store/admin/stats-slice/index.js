import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdminStats = createAsyncThunk("adminStats/fetch", 
  async () => {
    const response = await axios.get("http://localhost:5000/api/admin/stats");
    return response.data; // Trả về dữ liệu để lưu vào Redux state
});


const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminStatsSlice.reducer;