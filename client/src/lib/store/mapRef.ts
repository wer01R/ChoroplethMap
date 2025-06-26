import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Map } from "mapbox-gl";

const mapSlice = createSlice({
  name: 'map',
  initialState: null as Map | null,
  reducers: {
    setMap(oldState, action: PayloadAction<Map>) {
      return action.payload;
    }
  }
})

export default mapSlice.reducer;
export const { setMap: setMap } = mapSlice.actions;

