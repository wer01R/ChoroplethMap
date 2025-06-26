import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { statData } from "../types";

const initialState : statData & {selectYear: string, selectStat: string} = {
  selectYear: "",
  selectStat: "",
  years: [],
  data: null,
}

const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {
    setStat: (oldState, actions: PayloadAction<statData>) => {
      oldState.years = actions.payload.years;
      oldState.data = actions.payload.data;
    },
    setSelectYear: (oldState, action: PayloadAction<string>) => {
      oldState.selectYear = action.payload
    },
    setSelectStat: (oldState, action: PayloadAction<string>) => {
      oldState.selectStat = action.payload
    }
  }
})

export const {setStat, setSelectYear, setSelectStat} = statSlice.actions;
export default statSlice.reducer;