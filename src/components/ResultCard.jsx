import { posterUrl } from '../api/tmdb.js'
import './ResultCard.css'

const MEDIA_LABELS = {
  movie: 'Movie',
  tv: 'TV',
  person: 'Person',
}

function ResultCard({ result }) {
  const imageUrl = posterUrl(result.imagePath)
  const mediaLabel = MEDIA_LABELS[result.mediaType] ?? result.mediaType

  return (
    <article className="result-card">
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
    </article>
  )
}

export default ResultCard
