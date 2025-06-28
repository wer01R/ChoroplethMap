import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeoJSONFeatureCollection } from "../types";

const setMapSlice = createSlice({
  name: 'setMap',
  initialState: {
    geoJson: undefined as GeoJSONFeatureCollection | undefined,
    mapFlyto: undefined as number[] | undefined,
  },
  reducers: {
    setMapGeoJson(oldState, action: PayloadAction<GeoJSONFeatureCollection>) {
      oldState.geoJson = action.payload;
    },
    setMapFlyto(oldState, action: PayloadAction<number[]>) {
      oldState.mapFlyto = action.payload
    },
  }
})

export default setMapSlice.reducer;
export const { setMapFlyto, setMapGeoJson } = setMapSlice.actions;

