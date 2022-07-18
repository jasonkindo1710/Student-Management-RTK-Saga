import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { debug } from "console";
import { User } from "models/user";

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthState {
    isLoggedIn: boolean;
    logging?: boolean;
    currentUser?: User;
}
const initialState: AuthState = {
    isLoggedIn: false,
    logging: false,
    currentUser: undefined,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<LoginPayload>){
            state.logging = true;
        },
        loginSuccess(state, action: PayloadAction<User>){
            debugger    
            state.isLoggedIn = true;
            state.logging = false;
            state.currentUser = action.payload;
        },
        loginFailed(state, action: PayloadAction<string>){
            state.logging = false;
        },
        logout(state){
            state.isLoggedIn = false;
            state.currentUser = undefined;
        }
    }
})

//actions
export const authActions = authSlice.actions

//selectors
export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn;
export const selectIsLogging = (state: any) => state.auth.logging;


//reducer
const authReducer = authSlice.reducer;
export default authReducer;
