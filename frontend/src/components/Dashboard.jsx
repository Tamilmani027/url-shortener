import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import '../styles/dashboard-pages.css'

const emptyStats = {
  totalUrls: 0,
  todayUrls: 0,
  monthUrls: 0,
  totalClicks: 0,
  chartData: [],
}

const Dashboard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) return

    let active = true
    const loadStats = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get('/dashboard/stats')
        if (active) setStats(response.data?.data || emptyStats)
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || 'Failed to load dashboard statistics')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadStats()
    return () => {
      active = false
    }
  }, [isAuthenticated, reloadKey])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const cards = [
    { label: 'Total URLs created', value: stats.totalUrls },
    { label: 'URLs created today', value: stats.todayUrls },
    { label: 'URLs created this month', value: stats.monthUrls },
    { label: 'Total clicks', value: stats.totalClicks },
  ]

  return (
    <div className="stats-page">
      <div className="stats-inner">
        <div className="stats-header">
          <div>
            <h2>Dashboard</h2>
            <p>{user?.name ? `Welcome back, ${user.name}` : 'Your URL shortener overview'}</p>
          </div>
          <div className="stats-actions">
            <Link to="/my-urls">
              <button type="button" className="stats-button">My URLs</button>
            </Link>
            <Link to="/shorten">
              <button type="button" className="stats-button secondary">Create Short URL</button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="stats-message">Loading statistics...</div>
        ) : error ? (
          <div className="stats-message">
            <p>{error}</p>
            <button type="button" className="stats-button" onClick={() => setReloadKey((key) => key + 1)}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="stats-cards">
              {cards.map((card) => (
                <div className="stats-card" key={card.label}>
                  <h3>{card.label}</h3>
                  <p>{card.value}</p>
                </div>
              ))}
            </div>

            <div className="stats-panel">
              <h3>URL activity (last 7 days)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={stats.chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="urls" name="URLs created" fill="#0d4448" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clicks" name="Clicks" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
