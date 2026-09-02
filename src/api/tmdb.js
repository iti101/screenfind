const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342'

function getCredentials() {
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN
  if (!token || token === 'your_token_here') {
    throw new Error(
      'TMDB access token is missing. Add VITE_TMDB_ACCESS_TOKEN to your .env file.',
    )
  }
  // v4 read access tokens are JWTs; v3 API keys are short hex strings
  const isJwt = token.includes('.')
  return { token, isJwt }
}

function buildSearchUrl(query, token, isJwt) {
  const params = new URLSearchParams({
    query,
    include_adult: 'false',
  })
  if (!isJwt) params.set('api_key', token)
  return `${TMDB_BASE}/search/multi?${params}`
}

function buildSearchHeaders(token, isJwt) {
  const headers = { Accept: 'application/json' }
  if (isJwt) headers.Authorization = `Bearer ${token}`
  return headers
}

export function posterUrl(path) {
  if (!path) return null
  return `${IMAGE_BASE}${path}`
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

export async function searchMulti(query, { signal } = {}) {
  const trimmed = query.trim()
  if (!trimmed) return []

  const { token, isJwt } = getCredentials()
  const response = await fetch(buildSearchUrl(trimmed, token, isJwt), {
    headers: buildSearchHeaders(token, isJwt),
    signal,
  })

  if (!response.ok) {
    throw new Error(`TMDB search failed (${response.status})`)
  }

  const data = await response.json()
  return (data.results ?? [])
    .map(normalizeResult)
    .filter(Boolean)
}
