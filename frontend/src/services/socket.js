import { io } from 'socket.io-client'

let socket = null

export const initializeSocket = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    
    socket = io(BACKEND_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    })

    socket.on('connect', () => {
        console.log('Connected to server:', socket.id)
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from server')
    })

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
    })

    return socket
}

export const getSocket = () => {
    if (!socket) {
        return initializeSocket()
    }
    return socket
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}

// Ride-related event emitters

// User emits ride request
export const emitUserRideRequest = (rideData) => {
    const socket = getSocket()
    socket.emit('user:request-ride', rideData)
}

// Captain goes online
export const emitCaptainOnline = (captainData) => {
    const socket = getSocket()
    socket.emit('captain:online', captainData)
}

// Captain accepts ride
export const emitCaptainAcceptRide = (data) => {
    const socket = getSocket()
    socket.emit('captain:accept-ride', data)
}

// Ride completed
export const emitRideCompleted = (data) => {
    const socket = getSocket()
    socket.emit('ride:completed', data)
}

// Captain location update
export const emitCaptainLocationUpdate = (location) => {
    const socket = getSocket()
    socket.emit('captain:location-update', location)
}

// User rate ride
export const emitUserRateRide = (ratingData) => {
    const socket = getSocket()
    socket.emit('user:rate-ride', ratingData)
}

// Ride-related event listeners

// Listen for new ride requests (captains)
export const onNewRideRequest = (callback) => {
    const socket = getSocket()
    socket.on('ride:new-request', callback)
}

// Listen for ride acceptance (users)
export const onRideAccepted = (callback) => {
    const socket = getSocket()
    socket.on('ride:accepted', callback)
}

// Listen for ride completion
export const onRideCompleted = (callback) => {
    const socket = getSocket()
    socket.on('ride:completed-status', callback)
}

// Listen for location updates
export const onLocationUpdate = (callback) => {
    const socket = getSocket()
    socket.on('location:updated', callback)
}

// Listen for ride rating
export const onRideRated = (callback) => {
    const socket = getSocket()
    socket.on('ride:rated', callback)
}

// Remove listeners
export const removeListener = (event) => {
    const socket = getSocket()
    socket.off(event)
}
