import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Feature/AuthSlice";
import taskReducer from "../Feature/taskSlice"; 

const store = configureStore({
    reducer: { 
        auth: authReducer,
        task: taskReducer 
    }
});

export default store;
