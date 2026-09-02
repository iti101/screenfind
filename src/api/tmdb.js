const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342'
const IMAGE_BASE_LARGE = 'https://image.tmdb.org/t/p/w500'

function getCredentials() {
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN
  if (!token || token === 'your_token_here') {
    throw new Error(
      'TMDB access token is missing. Add VITE_TMDB_ACCESS_TOKEN to your .env file.',
    )
  }
  const isJwt = token.includes('.')
  return { token, isJwt }
}

function buildUrl(path, params, token, isJwt) {
  const search = new URLSearchParams(params)
  if (!isJwt) search.set('api_key', token)
  const query = search.toString()
  return `${TMDB_BASE}${path}${query ? `?${query}` : ''}`
}

function buildHeaders(token, isJwt) {
  const headers = { Accept: 'application/json' }
  if (isJwt) headers.Authorization = `Bearer ${token}`
  return headers
}

async function tmdbFetch(path, params = {}, { signal } = {}) {
  const { token, isJwt } = getCredentials()
  const response = await fetch(buildUrl(path, params, token, isJwt), {
    headers: buildHeaders(token, isJwt),
    signal,
  })

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`)
  }

  return response.json()
}

export function posterUrl(path, large = false) {
  if (!path) return null
  return `${large ? IMAGE_BASE_LARGE : IMAGE_BASE}${path}`
}

function extractYear(dateString) {
  if (!dateString) return null
  const year = dateString.slice(0, 4)
  return year || null
}

function normalizeResult(item) {
  const { id, media_type: mediaType } = item

  if (mediaType === 'movie') {
    return {
      id,
      mediaType,
      title: item.title,
      imagePath: item.poster_path,
      subtitle: extractYear(item.release_date),
    }
  }

  if (mediaType === 'tv') {
    return {
      id,
      mediaType,
      title: item.name,
      imagePath: item.poster_path,
      subtitle: extractYear(item.first_air_date),
    }
  }

  if (mediaType === 'person') {
    return {
      id,
      mediaType,
      title: item.name,
      imagePath: item.profile_path,
      subtitle: item.known_for_department || null,
    }
  }

  return null
}

/** Async — multi search movies, TV, people */
export async function searchMulti(query, { signal } = {}) {
  const trimmed = query.trim()
  if (!trimmed) return []

  const data = await tmdbFetch(
    '/search/multi',
    { query: trimmed, include_adult: 'false' },
    { signal },
  )

  return (data.results ?? []).map(normalizeResult).filter(Boolean)
}

/** Async — movie details */
export async function fetchMovieDetails(id, { signal } = {}) {
  const data = await tmdbFetch(`/movie/${id}`, {}, { signal })
  return {
    id: data.id,
    mediaType: 'movie',
    title: data.title,
    overview: data.overview,
    imagePath: data.poster_path,
    backdropPath: data.backdrop_path,
    subtitle: extractYear(data.release_date),
    rating: data.vote_average,
    runtime: data.runtime,
    genres: (data.genres || []).map((g) => g.name),
  }
}

/** Async — TV details */
export async function fetchTvDetails(id, { signal } = {}) {
  const data = await tmdbFetch(`/tv/${id}`, {}, { signal })
  return {
    id: data.id,
    mediaType: 'tv',
    title: data.name,
    overview: data.overview,
    imagePath: data.poster_path,
    backdropPath: data.backdrop_path,
    subtitle: extractYear(data.first_air_date),
    rating: data.vote_average,
    runtime: data.episode_run_time?.[0] ?? null,
    genres: (data.genres || []).map((g) => g.name),
  }
}

/** Async — person details */
export async function fetchPersonDetails(id, { signal } = {}) {
  const data = await tmdbFetch(`/person/${id}`, {}, { signal })
  return {
    id: data.id,
    mediaType: 'person',
    title: data.name,
    overview: data.biography,
    imagePath: data.profile_path,
    backdropPath: null,
    subtitle: data.known_for_department || null,
    rating: null,
    runtime: null,
    genres: [],
  }
}

export async function fetchMediaDetails(mediaType, id, options) {
  if (mediaType === 'movie') return fetchMovieDetails(id, options)
  if (mediaType === 'tv') return fetchTvDetails(id, options)
  if (mediaType === 'person') return fetchPersonDetails(id, options)
  throw new Error(`Unsupported media type: ${mediaType}`)
}
