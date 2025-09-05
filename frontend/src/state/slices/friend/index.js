import { createSlice } from "@reduxjs/toolkit";

export const friendSlice= createSlice({
    name: "friend",
    initialState: null,
    reducers: {
        setFriend: (state, action)=>{
            state= action.payload;
            return state;
        }
    }
})

export const { setFriend }= friendSlice.actions;

export default friendSlice.reducer;