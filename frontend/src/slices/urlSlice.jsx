import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  urls: [],
  loading: false,
  error: null,
}

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setUrls: (state, action) => {
      state.urls = action.payload
    },
    addUrl: (state, action) => {
      state.urls.push(action.payload)
    },
    removeUrl: (state, action) => {
      state.urls = state.urls.filter(
        (url) => url.id !== action.payload && url._id !== action.payload
      )
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setUrls, addUrl, removeUrl, setLoading, setError, clearError } =
  urlSlice.actions

export default urlSlice.reducer
