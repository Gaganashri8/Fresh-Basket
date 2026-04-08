import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'
import Home from './pages/Home'
import Login from './pages/Login'
import Otp from './pages/Otp'
import Address from './pages/Address'
import Results from './pages/Results'
import Ordering from './pages/Ordering'
import Success from './pages/Success'
import Profile from './pages/Profile'
import NoResults from './pages/NoResults'

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAppStore(state => state.isLoggedIn)
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sm-background max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/address" element={<Address />} />
          
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/ordering" element={<ProtectedRoute><Ordering /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/no-results" element={<ProtectedRoute><NoResults /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
