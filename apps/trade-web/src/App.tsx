import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'
import './App.css'
import { Login, type AuthUser } from './Login'
import { Dashboard } from './Dashboard'
import { SearchResults } from './SearchResults'
import { CardDetails } from './CardDetails'
import { Wishlist } from './Wishlist'
import { Inventory } from './Inventory'
import Register from './Register'

function App() {
  const [user, userSet] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('token')
    return stored ? { access_token: stored } : null
  })

  const handleLogout = () => {
    userSet(null)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      userSet({ access_token: token })
      params.delete('token')
      const url = window.location.pathname
      const newSearch = params.toString()
      const newUrl = newSearch ? `${url}?${newSearch}` : url
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('token', user.access_token)
    } else {
      localStorage.removeItem('token')
    }
  }, [user])

  return (
    <Container maxWidth={false} disableGutters>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Login onUserLogin={(u) => userSet(u)} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? <Register /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/search"
            element={
              user ? (
                <SearchResults user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/inventory"
            element={
              user ? (
                <Inventory user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/wishlist"
            element={
              user ? (
                <Wishlist user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/cards/:id"
            element={
              user ? (
                <CardDetails user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/auth/verify-email"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
        </Routes>
      </BrowserRouter>
    </Container>
  )
}

export default App
