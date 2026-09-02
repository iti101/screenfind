const NOVI_BASE =
  import.meta.env.VITE_NOVI_BASE_URL ||
  'https://novi-backend-api-wgsgz.ondigitalocean.app/api'

function getProjectId() {
  const projectId = import.meta.env.VITE_NOVI_PROJECT_ID
  if (!projectId || projectId === 'your_project_id_here') {
    throw new Error(
      'NOVI project ID is missing. Add VITE_NOVI_PROJECT_ID to your .env file.',
    )
  }
  return projectId
}

function buildHeaders(token) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'novi-education-project-id': getProjectId(),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function noviFetch(path, { method = 'GET', body, token, signal } = {}) {
  const response = await fetch(`${NOVI_BASE}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  if (!response.ok) {
    let detail = ''
    try {
      const data = await response.json()
      detail = data?.message || data?.error || JSON.stringify(data)
    } catch {
      detail = response.statusText
    }
    throw new Error(detail || `NOVI request failed (${response.status})`)
  }

  if (response.status === 204) return null

  const text = await response.text()
  if (!text) return null
  return JSON.parse(text)
}

/** Async 1 — register a new user */
export async function registerUser({ email, password, username }) {
  return noviFetch('/users', {
    method: 'POST',
    body: {
      email,
      password,
      username: username || email.split('@')[0],
      roles: ['user'],
    },
  })
}

/** Async 2 — log in and receive JWT */
export async function loginUser({ email, password }) {
  return noviFetch('/login', {
    method: 'POST',
    body: { email, password },
  })
}

/** Async 3 — fetch current user profile */
export async function fetchCurrentUser(userId, token) {
  return noviFetch(`/users/${userId}`, { token })
}

/** Async 4 — list watchlist items for the signed-in user */
export async function fetchWatchlist(token, userEmail) {
  const items = await noviFetch('/watchlistItems', { token })
  const list = Array.isArray(items) ? items : items?.data || []
  return list.filter((item) => item.userEmail === userEmail)
}

/** Async 5 — add an item to the watchlist */
export async function addWatchlistItem(token, item) {
  return noviFetch('/watchlistItems', {
    method: 'POST',
    token,
    body: item,
  })
}

/** Async 6 — update watchlist item status */
export async function updateWatchlistItem(token, id, patch) {
  return noviFetch(`/watchlistItems/${id}`, {
    method: 'PATCH',
    token,
    body: patch,
  })
}

/** Async 7 — remove a watchlist item */
export async function removeWatchlistItem(token, id) {
  return noviFetch(`/watchlistItems/${id}`, {
    method: 'DELETE',
    token,
  })
}
