function SearchForm({
  query,
  onQueryChange,
  onSubmit,
  disabled = false,
  placeholder = 'Movies, shows, people…',
}) {
  return (
    <form className="search-form" onSubmit={onSubmit} role="search">
      <div className="search-form__input-wrap">
        <label htmlFor="search-input" className="visually-hidden">
          Search query
        </label>
        <input
          id="search-input"
          type="search"
          className="search-form__input"
          placeholder={placeholder}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={disabled}
          aria-busy={disabled}
          autoComplete="off"
        />
        <button
          type="submit"
          className="search-form__submit"
          aria-label="Search"
          disabled={disabled}
        >
          <svg
            className="search-form__icon"
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
  )
}

export default SearchForm
