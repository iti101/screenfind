import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import loginIcon from '../assets/ICON-login-user-account.svg'
import { useAuth } from '../context/AuthContext.jsx'
import './Navbar.css'

const MENU_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'Contact', to: '/contact' },
  { label: 'Sign-in', to: '/login', guestOnly: true },
  { label: 'Register', to: '/register', guestOnly: true },
  { label: 'My Watchlist', to: '/watchlist', authOnly: true },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuth, logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const visibleItems = MENU_ITEMS.filter((item) => {
    if (item.authOnly && !isAuth) return false
    if (item.guestOnly && isAuth) return false
    return true
  })

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="navbar">
        <button
          type="button"
          className={`navbar__hamburger ${isOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="navbar__hamburger-bar" />
          <span className="navbar__hamburger-bar" />
          <span className="navbar__hamburger-bar" />
        </button>

        <Link
          to={isAuth ? '/watchlist' : '/login'}
          className="navbar__login"
          aria-label={isAuth ? 'Open watchlist' : 'Login'}
          onClick={() => setIsOpen(false)}
        >
          <img src={loginIcon} alt="" className="navbar__login-icon" />
        </Link>
      </header>

      <div
        className={`navbar__overlay ${isOpen ? 'navbar__overlay--open' : ''}`}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Main navigation">
          {isAuth && user && (
            <p className="navbar__user">Signed in as {user.username || user.email}</p>
          )}
          <ul className="navbar__menu-list">
            {visibleItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `navbar__menu-link${isActive ? ' navbar__menu-link--active' : ''}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {isAuth && (
              <li>
                <button
                  type="button"
                  className="navbar__menu-link"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Navbar
