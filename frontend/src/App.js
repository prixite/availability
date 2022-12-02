import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

import User from './pages/User'
import Navbar from './components/Navbar'
import Users from './pages/Users'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App () {
  const { user } = useAuthContext()

  return (
    <div className='App'>
      <BrowserRouter>
        <div className='pages'>
          <Navbar />
          <Routes>
            <Route
              path='/user'
              element={user ? <User /> : <Navigate to='/user/login' />}
            />
            <Route
              path='/user/all'
              element={user ? <Users /> : <Navigate to='/user/login' />}
            />
            <Route
              path='/user/login'
              element={!user ? <Login /> : <Navigate to='/user' />}
            />
            <Route
              path='/user/signup'
              element={!user ? <Signup /> : <Navigate to='/user' />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
