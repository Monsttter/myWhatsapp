import { createSlice } from "@reduxjs/toolkit";

export const userSlice= createSlice({
    name: "user",
    initialState: null,
    reducers: {
        setUser: (state, action)=>{
            // console.log(action.payload);
            state= action.payload;
            return state;
            // console.log(state);
        }
    }
});

export const { setUser }= userSlice.actions;

export default userSlice.reducer;
