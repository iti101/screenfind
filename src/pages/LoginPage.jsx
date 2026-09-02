import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import './AuthPages.css'

function LoginPage() {
  const { login, isAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const redirectTo = location.state?.from || '/watchlist'

  if (isAuth) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vul e-mailadres en wachtwoord in.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      await login({ email: email.trim(), password })
      setStatus('success')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Inloggen mislukt.')
      setStatus('error')
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Sign in</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className="auth-form__input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
          />

          <label className="auth-form__label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            className="auth-form__input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'loading'}
            required
            minLength={6}
          />

          <button
            type="submit"
            className="button auth-form__submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {status === 'error' && (
          <StatusMessage variant="error" role="alert">
            {errorMessage}
          </StatusMessage>
        )}

        <p className="auth-card__footer">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
