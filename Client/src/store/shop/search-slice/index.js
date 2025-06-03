import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  pagination: {
    totalResults: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 12,
  },
};

export const getSearchResults = createAsyncThunk(
  "/order/getSearchResults",
  async ({ keyword, page = 1, limit = 12 }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASEURL_FOR_SERVER}/api/shop/search/${keyword}?page=${page}&limit=${limit}`
    );
    return response.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
        state.pagination = initialState.pagination;
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;