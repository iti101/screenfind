import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { fetchCurrentUser, loginUser, registerUser } from '../api/novi.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'screenfind_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [status, setStatus] = useState('pending')

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const hydrateUser = useCallback(
    async (accessToken) => {
      const decoded = jwtDecode(accessToken)
      const userId = decoded.userId ?? decoded.sub ?? decoded.id
      if (!userId) {
        throw new Error('Token bevat geen gebruikers-id.')
      }
      const profile = await fetchCurrentUser(userId, accessToken)
      setToken(accessToken)
      setUser({
        id: profile.id ?? userId,
        email: profile.email,
        username: profile.username || profile.email,
        roles: profile.roles || [],
      })
    },
    [],
  )

  useEffect(() => {
    async function restoreSession() {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (!stored) {
        setStatus('ready')
        return
      }

      try {
        const decoded = jwtDecode(stored)
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          clearSession()
        } else {
          await hydrateUser(stored)
        }
      } catch {
        clearSession()
      } finally {
        setStatus('ready')
      }
    }

    restoreSession()
  }, [clearSession, hydrateUser])

  const login = useCallback(
    async ({ email, password }) => {
      const data = await loginUser({ email, password })
      const accessToken = data.accessToken || data.token || data.jwt
      if (!accessToken) {
        throw new Error('Geen token ontvangen van de NOVI API.')
      }
      localStorage.setItem(TOKEN_KEY, accessToken)
      await hydrateUser(accessToken)
      return data
    },
    [hydrateUser],
  )

  const register = useCallback(async ({ email, password, username }) => {
    await registerUser({ email, password, username })
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuth: Boolean(user && token),
      status,
      login,
      register,
      logout,
    }),
    [user, token, status, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
