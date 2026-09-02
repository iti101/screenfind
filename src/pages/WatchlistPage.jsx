import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchWatchlist,
  removeWatchlistItem,
  updateWatchlistItem,
} from '../api/novi.js'
import { posterUrl } from '../api/tmdb.js'
import { useAuth } from '../context/AuthContext.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import './WatchlistPage.css'

const STATUS_OPTIONS = [
  { value: 'to-watch', label: 'To watch' },
  { value: 'watching', label: 'Watching' },
  { value: 'watched', label: 'Watched' },
]

function WatchlistPage() {
  const { token, user } = useAuth()
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [actionError, setActionError] = useState('')

  const loadWatchlist = useCallback(async () => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const data = await fetchWatchlist(token, user.email)
      setItems(data)
      setStatus('success')
    } catch (error) {
      setErrorMessage(error.message || 'Could not load watchlist.')
      setStatus('error')
    }
  }, [token, user.email])

  useEffect(() => {
    loadWatchlist()
  }, [loadWatchlist])

  const handleStatusChange = async (item, nextStatus) => {
    setActionError('')
    try {
      await updateWatchlistItem(token, item.id, { status: nextStatus })
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, status: nextStatus } : entry,
        ),
      )
    } catch (error) {
      setActionError(error.message || 'Could not update status.')
    }
  }

  const handleRemove = async (item) => {
    setActionError('')
    try {
      await removeWatchlistItem(token, item.id)
      setItems((current) => current.filter((entry) => entry.id !== item.id))
    } catch (error) {
      setActionError(error.message || 'Could not remove item.')
    }
  }

  return (
    <section className="watchlist-page">
      <header className="watchlist-page__header">
        <h1 className="watchlist-page__title">My Watchlist</h1>
        <p className="watchlist-page__subtitle">
          Hello, {user.username || user.email}
        </p>
      </header>

      {status === 'loading' && <StatusMessage>Loading watchlist…</StatusMessage>}

      {status === 'error' && (
        <StatusMessage variant="error" role="alert">
          {errorMessage}
        </StatusMessage>
      )}

      {actionError && (
        <StatusMessage variant="error" role="alert">
          {actionError}
        </StatusMessage>
      )}

      {status === 'success' && items.length === 0 && (
        <div className="watchlist-page__empty">
          <p>Your watchlist is empty.</p>
          <Link className="button" to="/search">
            Find something to watch
          </Link>
        </div>
      )}

      {status === 'success' && items.length > 0 && (
        <ul className="watchlist-page__list">
          {items.map((item) => {
            const imageUrl = posterUrl(item.posterPath)
            return (
              <li key={item.id} className="watchlist-card">
                <Link
                  to={`/details/${item.mediaType}/${item.tmdbId}`}
                  className="watchlist-card__media"
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="watchlist-card__image" />
                  ) : (
                    <div className="watchlist-card__placeholder">No image</div>
                  )}
                </Link>
                <div className="watchlist-card__body">
                  <h2 className="watchlist-card__title">{item.title}</h2>
                  <p className="watchlist-card__meta">{item.mediaType}</p>
                  <label className="watchlist-card__label" htmlFor={`status-${item.id}`}>
                    Status
                  </label>
                  <select
                    id={`status-${item.id}`}
                    className="watchlist-card__select"
                    value={item.status || 'to-watch'}
                    onChange={(event) =>
                      handleStatusChange(item, event.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default WatchlistPage
