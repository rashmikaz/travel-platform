import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ListingDetail from './pages/ListingDetail'
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import MyListings from './pages/MyListings'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/create" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditListing /></PrivateRoute>} />
        <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
      </Routes>
      <Toaster position="bottom-right" toastOptions={{
        style: { fontFamily: 'DM Sans, sans-serif', borderRadius: 12, background: '#1a1208', color: 'white' }
      }} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
