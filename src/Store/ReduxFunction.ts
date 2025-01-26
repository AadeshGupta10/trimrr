import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: {},
    isAuthenticated: false,
    loading: false
}

const ReduxFunctions = createSlice({
    name: "ReduxFunctions",
    initialState,
    reducers: {
        handleUserVerification: (state, action) => {
            const { user, isAuthenticated, isLoading } = action.payload;

            state.user = user;
            state.isAuthenticated = isAuthenticated;
            state.loading = isLoading;
        }
    }
})

export const { handleUserVerification } = ReduxFunctions.actions;

export default ReduxFunctions.reducer;