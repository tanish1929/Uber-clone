import React, { createContext, useState, useEffect } from 'react'
import { getSocket, onRideAccepted, onRideCompleted } from '../services/socket'

export const UserDataContext = createContext()

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [acceptedRide, setAcceptedRide] = useState(null)
  const [rideStatus, setRideStatus] = useState('idle') // idle, searching, accepted, completed
  const [completedRide, setCompletedRide] = useState(null)
  const [rideError, setRideError] = useState(null)

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user data:', error)
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user])

  // Initialize socket and setup listeners on mount
  useEffect(() => {
    const socket = getSocket()
    
    // Listen for ride acceptance
    onRideAccepted((rideData) => {
      setAcceptedRide(rideData)
      setRideStatus('accepted')
      setRideError(null)
    })

    // Listen for ride completion
    onRideCompleted((rideData) => {
      setCompletedRide(rideData)
      setRideStatus('completed')
    })

    return () => {
      // Cleanup listeners
    }
  }, [])

  return (
    <UserDataContext.Provider 
      value={{ 
        user, 
        setUser, 
        acceptedRide, 
        setAcceptedRide, 
        rideStatus, 
        setRideStatus,
        completedRide,
        setCompletedRide,
        rideError,
        setRideError
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext