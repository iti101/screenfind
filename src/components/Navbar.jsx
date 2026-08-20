import { useEffect, useState } from 'react'
import loginIcon from '../assets/ICON-login-user-account.svg'
import './Navbar.css'

const MENU_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'Features', id: 'features' },
  { label: 'Contact', id: 'contact' },
  { label: 'Sign-in' },
  { label: 'My Watchlist' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleMenuItemClick = (item) => {
    if (item.id) {
      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
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

        <button type="button" className="navbar__login" aria-label="Login">
          <img src={loginIcon} alt="" className="navbar__login-icon" />
        </button>
      </header>

      <div
        className={`navbar__overlay ${isOpen ? 'navbar__overlay--open' : ''}`}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Main navigation">
          <ul className="navbar__menu-list">
            {MENU_ITEMS.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="navbar__menu-link"
                  onClick={() => handleMenuItemClick(item)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Navbar
