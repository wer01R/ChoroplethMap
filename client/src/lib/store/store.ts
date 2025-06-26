import { configureStore } from "@reduxjs/toolkit";
import colorsReducer from './notes'
import statReducer from './statistics'
import mapReducer from './mapRef'

const store = configureStore({
  reducer: {
    notes: colorsReducer,
    stat: statReducer,
    map: mapReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;