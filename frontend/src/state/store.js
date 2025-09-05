import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./slices/user/index.js";
import friendReducer from "./slices/friend/index.js";
import onlineUsersReducer from "./slices/onlineUsers/index.js";
import conversationReducer from "./slices/conversation/index.js";

export default configureStore({
  reducer: {
    user: userReducer,
    friend: friendReducer,
    onlineUsers: onlineUsersReducer,
    conversation: conversationReducer
  },
})