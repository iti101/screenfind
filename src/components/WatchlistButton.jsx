import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { addWatchlistItem } from '../api/novi.js'
import StatusMessage from './StatusMessage.jsx'

function WatchlistButton({ media, onAdded }) {
  const { isAuth, token, user } = useAuth()
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (media.mediaType === 'person') return null

  if (!isAuth) {
    return (
      <Link className="button button--secondary" to="/login">
        Sign in to save
      </Link>
    )
  }

  const handleAdd = async () => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const created = await addWatchlistItem(token, {
        userEmail: user.email,
        tmdbId: media.id,
        mediaType: media.mediaType,
        title: media.title,
        posterPath: media.imagePath || '',
        status: 'to-watch',
      })
      setStatus('success')
      onAdded?.(created)
    } catch (error) {
      setErrorMessage(error.message || 'Could not add to watchlist.')
      setStatus('error')
    }
  }

  return (
    <div className="watchlist-button">
      <button
        type="button"
        className="button"
        onClick={handleAdd}
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading'
          ? 'Saving…'
          : status === 'success'
            ? 'Saved to watchlist'
            : 'Add to watchlist'}
      </button>
      {status === 'error' && (
        <StatusMessage variant="error" role="alert">
          {errorMessage}
        </StatusMessage>
      )}
    </div>
  )
}

export default WatchlistButton
