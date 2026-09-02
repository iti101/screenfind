const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV' },
  { id: 'person', label: 'People' },
]

function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter results by type">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter-bar__button${
            activeFilter === filter.id ? ' filter-bar__button--active' : ''
          }`}
          onClick={() => onFilterChange(filter.id)}
          aria-pressed={activeFilter === filter.id}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
