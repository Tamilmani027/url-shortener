import express from 'express'
import { verifyAccessToken } from '../middleware/url.middleware.js'
import { getDashboardStats, getMyUrls } from '../controllers/stats.controllers.js'

const route = express.Router()

// Every route in this router is private: a valid JWT access token is required.
route.use(verifyAccessToken)

route.get('/dashboard/stats', getDashboardStats)
route.get('/my-urls', getMyUrls)

export default route
