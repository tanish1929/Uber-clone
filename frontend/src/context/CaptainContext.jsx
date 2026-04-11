import React, { createContext, useState, useContext, useEffect } from 'react'
import { getSocket, onNewRideRequest } from '../services/socket'

export const CaptainDataContext = createContext()

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [acceptedRides, setAcceptedRides] = useState([])
    const [availableRides, setAvailableRides] = useState([])
    const [isOnline, setIsOnline] = useState(false)

    const updateCaptain = (captainData) => {
        setCaptain(captainData)
    }

    // Load captain data from localStorage on mount
    useEffect(() => {
        const storedCaptain = localStorage.getItem('captain')
        if (storedCaptain) {
            try {
                setCaptain(JSON.parse(storedCaptain))
            } catch (error) {
                console.error('Error parsing stored captain data:', error)
            }
        }
    }, [])

    // Save captain to localStorage whenever it changes
    useEffect(() => {
        if (captain) {
            localStorage.setItem('captain', JSON.stringify(captain))
        }
    }, [captain])

    // Initialize socket and setup listeners
    useEffect(() => {
        const socket = getSocket()

        // Listen for new ride requests
        onNewRideRequest((rideData) => {
            setAvailableRides(prevRides => {
                // Avoid duplicates
                const exists = prevRides.some(ride => ride.id === rideData.id)
                if (exists) return prevRides
                return [rideData, ...prevRides]
            })
        })

        return () => {
            // Cleanup listeners
        }
    }, [])

    const value = {
        captain,
        setCaptain: updateCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain,
        acceptedRides,
        setAcceptedRides,
        availableRides,
        setAvailableRides,
        isOnline,
        setIsOnline
    }

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    )
}

export const useCaptain = () => {
    const context = useContext(CaptainDataContext)
    if (!context) {
        throw new Error('useCaptain must be used within a CaptainContext')
    }
    return context
}

export default CaptainContext
