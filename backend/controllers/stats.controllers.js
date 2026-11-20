import mongoose from 'mongoose'
import ShortUrl from '../models/shortUrl.model.js'

const pad = (value) => String(value).padStart(2, '0')

const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const dateLabel = (date) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(date)

/** Statistics for the authenticated user. */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfChart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)

    const [totalUrls, todayUrls, monthUrls, clickResult, recentUrls] = await Promise.all([
      ShortUrl.countDocuments({ user: userId }),
      ShortUrl.countDocuments({ user: userId, createdAt: { $gte: startOfToday } }),
      ShortUrl.countDocuments({ user: userId, createdAt: { $gte: startOfMonth } }),
      ShortUrl.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(String(userId)) } },
        { $group: { _id: null, total: { $sum: '$clicks' } } },
      ]),
      ShortUrl.find({ user: userId, createdAt: { $gte: startOfChart } })
        .select('createdAt clicks')
        .lean(),
    ])

    // Always return all seven days so the chart has a stable x-axis.
    const chartData = []
    const chartIndex = new Map()
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)
      const key = dateKey(day)
      chartIndex.set(key, chartData.length)
      chartData.push({ date: key, label: dateLabel(day), urls: 0, clicks: 0 })
    }

    recentUrls.forEach((url) => {
      const index = chartIndex.get(dateKey(new Date(url.createdAt)))
      if (index === undefined) return
      chartData[index].urls += 1
      chartData[index].clicks += url.clicks || 0
    })

    return res.status(200).json({
      success: true,
      data: {
        totalUrls,
        todayUrls,
        monthUrls,
        totalClicks: clickResult[0]?.total || 0,
        chartData,
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

/** All shortened URLs that belong to the authenticated user. */
export const getMyUrls = async (req, res) => {
  try {
    const urls = await ShortUrl.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean()

    const baseUrl = `${req.protocol}://${req.get('host')}`

    return res.status(200).json({
      success: true,
      data: urls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        clicks: url.clicks || 0,
        createdAt: url.createdAt,
      })),
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
