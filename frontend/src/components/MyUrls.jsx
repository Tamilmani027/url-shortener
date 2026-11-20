import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../styles/dashboard-pages.css'

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(value))

const MyUrls = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return

    let active = true
    const loadUrls = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/my-urls')
        if (active) setUrls(response.data?.data || [])
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || 'Failed to load your URLs')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadUrls()
    return () => {
      active = false
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="stats-page">
      <div className="stats-inner">
        <div className="stats-header">
          <div>
            <h2>My URLs</h2>
            <p>All the short links you have created.</p>
          </div>
          <div className="stats-actions">
            <Link to="/dashboard">
              <button type="button" className="stats-button secondary">Back to Dashboard</button>
            </Link>
            <Link to="/shorten">
              <button type="button" className="stats-button">Create Short URL</button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="stats-message">Loading your URLs...</div>
        ) : error ? (
          <div className="stats-message">{error}</div>
        ) : (
          <div className="my-urls-table-wrap">
            <table className="my-urls-table">
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Short URL</th>
                  <th>Clicks</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {urls.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="my-urls-empty">
                      No URLs created yet. <Link to="/shorten">Create your first one</Link>.
                    </td>
                  </tr>
                ) : (
                  urls.map((url) => (
                    <tr key={url.id}>
                      <td className="my-urls-original" title={url.originalUrl}>{url.originalUrl}</td>
                      <td>
                        <a
                          className="my-urls-short"
                          href={url.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={url.shortUrl}
                        >
                          /{url.shortCode}
                        </a>
                      </td>
                      <td className="my-urls-clicks">{url.clicks}</td>
                      <td>{formatDate(url.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyUrls
