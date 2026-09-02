import { Link } from 'react-router-dom'
import { posterUrl } from '../api/tmdb.js'
import './ResultCard.css'

const MEDIA_LABELS = {
  movie: 'Movie',
  tv: 'TV',
  person: 'Person',
}

function ResultCard({ result, onSelect }) {
  const imageUrl = posterUrl(result.imagePath)
  const mediaLabel = MEDIA_LABELS[result.mediaType] ?? result.mediaType
  const to = `/details/${result.mediaType}/${result.id}`

  const handleClick = () => {
    onSelect?.(result)
  }

  return (
    <article className="result-card">
      <Link to={to} className="result-card__link" onClick={handleClick}>
        <div className="result-card__poster">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="result-card__image"
              loading="lazy"
            />
          ) : (
            <div className="result-card__placeholder" aria-hidden="true">
              No image
            </div>
          )}
          <span className="result-card__badge">{mediaLabel}</span>
        </div>
        <div className="result-card__info">
          <h3 className="result-card__title">{result.title}</h3>
          {result.subtitle && (
            <p className="result-card__subtitle">{result.subtitle}</p>
          )}
        </div>
      </Link>
    </article>
  )
}

export default ResultCard
