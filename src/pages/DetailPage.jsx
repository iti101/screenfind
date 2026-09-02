import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchMediaDetails, posterUrl } from '../api/tmdb.js'
import StatusMessage from '../components/StatusMessage.jsx'
import WatchlistButton from '../components/WatchlistButton.jsx'
import './DetailPage.css'

function DetailPage() {
  const { mediaType, id } = useParams()
  const [media, setMedia] = useState(null)
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadDetails() {
      setStatus('loading')
      setErrorMessage('')
      setMedia(null)

      try {
        const data = await fetchMediaDetails(mediaType, id, {
          signal: controller.signal,
        })
        setMedia(data)
        setStatus('success')
      } catch (error) {
        if (error.name === 'AbortError') return
        setErrorMessage(error.message || 'Could not load details.')
        setStatus('error')
      }
    }

    loadDetails()
    return () => controller.abort()
  }, [mediaType, id])

  if (status === 'loading') {
    return (
      <section className="detail-page">
        <StatusMessage>Loading details…</StatusMessage>
      </section>
    )
  }

  if (status === 'error' || !media) {
    return (
      <section className="detail-page">
        <StatusMessage variant="error" role="alert">
          {errorMessage || 'Not found'}
        </StatusMessage>
        <Link className="button button--secondary" to="/search">
          Back to search
        </Link>
      </section>
    )
  }

  const imageUrl = posterUrl(media.imagePath, true)

  return (
    <section className="detail-page">
      <div className="detail-page__layout">
        <div className="detail-page__poster">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="detail-page__image" />
          ) : (
            <div className="detail-page__placeholder">No image</div>
          )}
        </div>

        <div className="detail-page__content">
          <p className="detail-page__type">{media.mediaType}</p>
          <h1 className="detail-page__title">
            {media.title}
            {media.subtitle ? ` (${media.subtitle})` : ''}
          </h1>

          <div className="detail-page__meta">
            {media.rating != null && (
              <span>Rating {Number(media.rating).toFixed(1)}</span>
            )}
            {media.runtime != null && <span>{media.runtime} min</span>}
            {media.genres?.length > 0 && <span>{media.genres.join(' · ')}</span>}
          </div>

          {media.overview && (
            <p className="detail-page__overview">{media.overview}</p>
          )}

          <div className="detail-page__actions">
            <WatchlistButton media={media} />
            <Link className="button button--secondary" to="/search">
              Back to search
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DetailPage
