import { configureStore } from '@reduxjs/toolkit'
import ReduxFunctions from './ReduxFunction'

export const store = configureStore({
    reducer: ReduxFunctions
})