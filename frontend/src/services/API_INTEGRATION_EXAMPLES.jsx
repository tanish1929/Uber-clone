import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

/**
 * Example of how to integrate API calls in frontend components
 * This shows the pattern used by UserLogin, UserSignup, CaptainLogin, CaptainSignup
 */

const UserLoginExample = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call API using the centralized api service
      const response = await api.user.login({
        email,
        password,
      })

      // Store token in localStorage
      localStorage.setItem('token', response.data.token)

      // Store user data in context or state
      // dispatch(setUser(response.data.user))

      // Redirect to home
      navigate('/home')

      setEmail('')
      setPassword('')
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        disabled={loading}
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

// ==========================================
// API Service Usage Patterns
// ==========================================

/**
 * Pattern 1: User Registration
 */
export const registerUserExample = async (userData) => {
  try {
    const response = await api.user.register({
      fullname: {
        firstname: userData.firstName,
        lastname: userData.lastName,
      },
      email: userData.email,
      password: userData.password,
    })

    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    console.error('Registration failed:', error.response?.data?.error)
    throw error
  }
}

/**
 * Pattern 2: Captain Registration
 */
export const registerCaptainExample = async (captainData) => {
  try {
    const response = await api.captain.register({
      fullname: {
        firstname: captainData.firstName,
        lastname: captainData.lastName,
      },
      email: captainData.email,
      password: captainData.password,
      vehicle: {
        color: captainData.vehicleColor,
        plate: captainData.licensePlate,
        capacity: Number(captainData.capacity),
        vehicleType: captainData.vehicleType,
      },
    })

    localStorage.setItem('captainToken', response.data.token)
    return response.data
  } catch (error) {
    console.error('Captain registration failed:', error.response?.data?.error)
    throw error
  }
}

/**
 * Pattern 3: Get User Profile (Protected)
 */
export const getUserProfileExample = async () => {
  try {
    const response = await api.user.getProfile()
    return response.data.user
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      // Redirect to login
    }
    throw error
  }
}

/**
 * Pattern 4: Get Captain Profile (Protected)
 */
export const getCaptainProfileExample = async () => {
  try {
    const response = await api.captain.getProfile()
    return response.data.captain
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('captainToken')
    }
    throw error
  }
}

/**
 * Pattern 5: Logout
 */
export const logoutExample = async (userType = 'user') => {
  try {
    if (userType === 'user') {
      await api.user.logout()
      localStorage.removeItem('token')
    } else {
      await api.captain.logout()
      localStorage.removeItem('captainToken')
    }
  } catch (error) {
    console.error('Logout failed:', error)
    // Still clear localStorage on client side
    localStorage.removeItem('token')
    localStorage.removeItem('captainToken')
  }
}

/**
 * Pattern 6: Update User Profile (To be implemented in backend)
 */
export const updateUserProfileExample = async (userData) => {
  try {
    const response = await api.user.updateProfile({
      fullname: {
        firstname: userData.firstName,
        lastname: userData.lastName,
      },
      phone: userData.phone,
      profilePicture: userData.profilePicture,
    })
    return response.data.user
  } catch (error) {
    console.error('Profile update failed:', error.response?.data?.error)
    throw error
  }
}

/**
 * Pattern 7: Update Captain Vehicle (To be implemented in backend)
 */
export const updateCaptainVehicleExample = async (vehicleData) => {
  try {
    const response = await api.captain.updateVehicle({
      color: vehicleData.color,
      plate: vehicleData.plate,
      capacity: vehicleData.capacity,
      vehicleType: vehicleData.vehicleType,
    })
    return response.data.captain
  } catch (error) {
    console.error('Vehicle update failed:', error.response?.data?.error)
    throw error
  }
}

/**
 * Pattern 8: Error Handling
 * The axios interceptor handles:
 * - 401 Unauthorized: Clears tokens and redirects to login
 * - 403 Forbidden: Logs error
 * - 500 Server Error: Logs error
 * 
 * For custom error handling in components:
 */
export const errorHandlingExample = async () => {
  try {
    const response = await api.user.login({
      email: 'test@example.com',
      password: 'wrong',
    })
  } catch (error) {
    // error.response.status === 401 (invalid credentials)
    // error.response.status === 500 (server error)
    // error.message === 'Network Error' (connection failed)

    if (error.response?.status === 401) {
      console.log('Invalid email or password')
    } else if (error.response?.status === 400) {
      console.log('Validation error:', error.response.data.errors)
    } else if (error.message === 'Network Error') {
      console.log('Cannot connect to server. Check if backend is running.')
    } else {
      console.log('Unexpected error:', error.message)
    }
  }
}

export default UserLoginExample
