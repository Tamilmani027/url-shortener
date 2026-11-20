import axios from 'axios'
import { logout } from '../slices/authSlice'

// Requests that require a valid access token. A 401 from one of these means
// the token is missing/expired, so the local session should be cleared.
const PRIVATE_API_PATHS = ['/shorten', '/dashboard/stats', '/my-urls']

export const setupAuthInterceptor = (store) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error.config?.url || ''
      const isPrivateRequest = PRIVATE_API_PATHS.some((path) => url.startsWith(path))

      if (error.response?.status === 401 && isPrivateRequest) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        store.dispatch(logout())

        if (window.location.pathname !== '/login') {
          window.location.replace('/login')
        }
      }

      return Promise.reject(error)
    }
  )
}
