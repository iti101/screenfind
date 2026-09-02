import { useRef, useState } from 'react'
import { searchMulti } from '../api/tmdb.js'
import ResultCard from '../components/ResultCard.jsx'
import './SearchSect.css'

function SearchSect() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const abortRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmed = query.trim()
    if (!trimmed) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setErrorMessage('')
    setResults([])

    try {
      const data = await searchMulti(trimmed, { signal: controller.signal })
      setResults(data)
      setStatus('success')
    } catch (err) {
      if (err.name === 'AbortError') return
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const showResults = status !== 'idle'

  return (
    <section
      id="search"
      className={`search-section${showResults ? ' search-section--active' : ''}`}
    >
      <div className="search-section__cluster">
        <h1 className="search-section__title" id="search-heading">
          Search
        </h1>

        <form
          className="search-section__form"
          onSubmit={handleSubmit}
          role="search"
        >
          <div className="search-section__input-wrap">
            <input
              id="search-input"
              type="search"
              className="search-section__input"
              placeholder="Movies, shows, people…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={status === 'loading'}
              aria-labelledby="search-heading"
              aria-busy={status === 'loading'}
              autoComplete="off"
            />
            <button
              type="submit"
              className="search-section__submit"
              aria-label="Search"
              disabled={status === 'loading'}
            >
              <svg
                className="search-section__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </form>

        {status === 'loading' && (
          <p className="search-section__status" aria-live="polite">
            Searching…
          </p>
        )}

        {status === 'error' && (
          <p className="search-section__status search-section__status--error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>

      {showResults && status !== 'loading' && (
        <div
          className="search-section__results"
          aria-live="polite"
          aria-label="Search results"
        >
          {status === 'success' && results.length === 0 && (
            <p className="search-section__empty">
              No matches for &ldquo;{query.trim()}&rdquo;
            </p>
          )}

          {results.length > 0 && (
            <div className="search-section__grid">
              {results.map((result) => (
                <ResultCard
                  key={`${result.mediaType}-${result.id}`}
                  result={result}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default SearchSect
