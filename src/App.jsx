import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import ContactPage from './pages/ContactPage.jsx'
import DetailPage from './pages/DetailPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="details/:mediaType/:id" element={<DetailPage />} />
        <Route
          path="watchlist"
          element={
            <PrivateRoute>
              <WatchlistPage />
            </PrivateRoute>
          }
        />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
