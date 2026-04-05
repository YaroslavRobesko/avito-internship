import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Item, ItemsGetOut, Ad } from "../../types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import server from "../../api/server";


export interface AdsInfo {
  ads: Ad[];
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const initialState: AdsInfo = { ads: [], isLoading: false, isError: false, error: "" };
const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Item[]>) => {
      state.ads = action.payload.map((item, index) => {
        const ad: Ad = { id: index, ...item };
        return ad;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadData.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(loadData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loadData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload
          ? (action.payload as string)
          : action.error.message || "Произошла неизвестная ошибка";
      });
  },
});

export const loadData = createAsyncThunk<void, void, { rejectValue: string }>(
  "ads/load",
  async (_, thunkAPI) => {
    try {
      const limit: number = (await server.get<ItemsGetOut>("/items")).data
        .total;
      const items: Item[] = (
        await server.get<ItemsGetOut>(`/items?limit=${limit}`)
      ).data.items;

      thunkAPI.dispatch(setData(items));
      return;
    } catch {
      return thunkAPI.rejectWithValue("Ошибка загрузки объявлений");
    }
  },
);

export const { setData } = adsSlice.actions;
export default adsSlice.reducer;
