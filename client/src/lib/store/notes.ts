import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type notesPayload = {
  minNum: number
  maxNum: number
  colors: string[]
  measure: string
}

const colorsSlice = createSlice({
  name: 'colors',
  initialState: {
    minNum: 0,
    maxNum: 0,
    colors: ["#0FC2C0", "#0CABA8", "#008F8C", "#015958", "#023535"],
    measure: ''
  },
  reducers: {
    setNum: (oldState, action: PayloadAction<notesPayload>) => {
      oldState.maxNum = action.payload.maxNum;
      oldState.colors = action.payload.colors;
      oldState.minNum = action.payload.minNum;
      oldState.measure = action.payload.measure;
    }
  }
})

export default colorsSlice.reducer;
export const {setNum} = colorsSlice.actions;