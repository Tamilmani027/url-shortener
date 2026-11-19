import { createSlice } from '@reduxjs/toolkit'

const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

let parsedUser = null
try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null
} catch {
  parsedUser = null
}

const initialState = {
  user: parsedUser,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions

export default authSlice.reducer
