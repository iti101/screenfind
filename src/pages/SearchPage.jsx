import { useRef, useState } from 'react'
import { searchMulti } from '../api/tmdb.js'
import FilterBar from '../components/FilterBar.jsx'
import ResultCard from '../components/ResultCard.jsx'
import SearchForm from '../components/SearchForm.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import './SearchPage.css'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [filter, setFilter] = useState('all')
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

  const filteredResults =
    filter === 'all'
      ? results
      : results.filter((result) => result.mediaType === filter)

  const showResults = status !== 'idle'

  return (
    <section
      className={`search-page${showResults ? ' search-page--active' : ''}`}
    >
      <div className="search-page__cluster">
        <h1 className="search-page__title" id="search-heading">
          Search
        </h1>

        <SearchForm
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          disabled={status === 'loading'}
        />

        {status === 'loading' && (
          <StatusMessage>Searching…</StatusMessage>
        )}

        {status === 'error' && (
          <StatusMessage variant="error" role="alert">
            {errorMessage}
          </StatusMessage>
        )}

        {status === 'success' && results.length > 0 && (
          <FilterBar activeFilter={filter} onFilterChange={setFilter} />
        )}
      </div>

      {showResults && status !== 'loading' && (
        <div
          className="search-page__results"
          aria-live="polite"
          aria-label="Search results"
        >
          {status === 'success' && filteredResults.length === 0 && (
            <p className="search-page__empty">
              No matches for &ldquo;{query.trim()}&rdquo;
              {filter !== 'all' ? ` in ${filter}` : ''}
            </p>
          )}

          {filteredResults.length > 0 && (
            <div className="search-page__grid">
              {filteredResults.map((result) => (
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

export default SearchPage
