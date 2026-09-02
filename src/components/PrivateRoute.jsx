import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function PrivateRoute({ children }) {
  const { isAuth, status } = useAuth()
  const location = useLocation()

  if (status === 'pending') {
    return (
      <div className="page page--center">
        <p className="status-message">Sessie controleren…</p>
      </div>
    )
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default PrivateRoute
