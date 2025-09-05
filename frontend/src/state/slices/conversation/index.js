import { createSlice } from "@reduxjs/toolkit";

export const conversationSlice= createSlice({
    name: "conversation",
    initialState: null,
    reducers: {
        setConversation: (state, action)=>{
            // console.log(action.payload);
            state= action.payload;
            return state;
        }
    }
})

export const { setConversation }= conversationSlice.actions;

export default conversationSlice.reducer;