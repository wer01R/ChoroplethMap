import { configureStore } from "@reduxjs/toolkit";
import colorsReducer from './notes'
import statReducer from './statistics'
import mapReducer from './setMap'

const store = configureStore({
  reducer: {
    notes: colorsReducer,
    stat: statReducer,
    setMap: mapReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;