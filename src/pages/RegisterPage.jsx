import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import './AuthPages.css'

function RegisterPage() {
  const { register, isAuth } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (isAuth) {
    return <Navigate to="/watchlist" replace />
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
    setSuccessMessage('')

    try {
      await register({
        email: email.trim(),
        password,
        username: username.trim(),
      })
      setStatus('success')
      setSuccessMessage('Account aangemaakt. Je kunt nu inloggen.')
      setTimeout(() => navigate('/login'), 800)
    } catch (error) {
      setErrorMessage(error.message || 'Registreren mislukt.')
      setStatus('error')
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label" htmlFor="register-username">
            Username
          </label>
          <input
            id="register-username"
            className="auth-form__input"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={status === 'loading'}
            minLength={3}
          />

          <label className="auth-form__label" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            className="auth-form__input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
          />

          <label className="auth-form__label" htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            className="auth-form__input"
            type="password"
            autoComplete="new-password"
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
            {status === 'loading' ? 'Creating…' : 'Register'}
          </button>
        </form>

        {status === 'error' && (
          <StatusMessage variant="error" role="alert">
            {errorMessage}
          </StatusMessage>
        )}
        {status === 'success' && (
          <StatusMessage>{successMessage}</StatusMessage>
        )}

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
