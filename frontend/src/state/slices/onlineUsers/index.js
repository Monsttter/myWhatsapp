import { createSlice } from "@reduxjs/toolkit";

export const onlineUsersSlice= createSlice({
    name: "onlineUsers",
    initialState: [],
    reducers: {
        setOnlineUsers: (state, action)=>{
            // console.log(action.payload);
            state= action.payload;
            return state;
        },
        setOnlineUser: (state, action)=>{
            // console.log(action.payload);
            state= [...state, action.payload];
            return state;
        },
        setOfflineUser: (state, action)=>{
            return state.filter(user => user !== action.payload);;
        }
    }
})

export const { setOnlineUsers, setOnlineUser, setOfflineUser }= onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;