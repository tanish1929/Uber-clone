import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import Header from '../components/Header'
import { emitCaptainOnline, emitCaptainAcceptRide, emitRideCompleted } from '../services/socket'

const CaptainHome = () => {
  const { captain, availableRides, setAvailableRides, setIsOnline, isOnline } = useContext(CaptainDataContext)
  const [rideAccepted, setRideAccepted] = useState(false)
  const [currentRide, setCurrentRide] = useState(null)
  const [hasRideRequest, setHasRideRequest] = useState(false)

  const acceptRide = (ride) => {
    // Calculate estimated price based on ride type
    const estimatedPrice = Math.floor(Math.random() * 300) + 150

    // Create captain details object
    const captainDetails = {
      name: captain?.fullname?.firstname || 'Driver',
      driverRating: captain?.fullname?.firstname ? 4.9 : 4.5,
      vehicleType: captain?.vehicle?.vehicleType || 'car',
      vehicleColor: captain?.vehicle?.color || 'white',
      licensePlate: captain?.vehicle?.plate || 'XX-00-XX-0000',
      vehicleCapacity: captain?.vehicle?.capacity || 5,
      estimatedPrice: estimatedPrice,
      acceptedAt: new Date().toISOString()
    }

    // Emit ride acceptance via Socket.IO
    const rideData = {
      ...ride,
      status: 'accepted',
      captainDetails
    }

    emitCaptainAcceptRide(rideData)

    setCurrentRide(rideData)
    setRideAccepted(true)
    setHasRideRequest(false)
    
    // Remove from available rides
    setAvailableRides(prev => prev.filter(r => r.id !== ride.id))
  }

  const skipRide = (ride) => {
    // Remove from available rides
    setAvailableRides(prev => prev.filter(r => r.id !== ride.id))
    setHasRideRequest(false)
  }

  const completeRide = () => {
    if (currentRide) {
      const completedRideData = {
        ...currentRide,
        status: 'completed',
        completedAt: new Date().toISOString()
      }
      
      // Emit ride completion via Socket.IO
      emitRideCompleted(completedRideData)
    }
    
    setRideAccepted(false)
    setHasRideRequest(false)
    setCurrentRide(null)
  }

  const handleGoOnline = () => {
    setIsOnline(true)
    // Emit captain online event
    emitCaptainOnline({
      captainId: captain?._id || 'captain_' + Date.now(),
      name: captain?.fullname?.firstname || 'Driver',
      timestamp: new Date().toISOString()
    })
  }

  const handleGoOffline = () => {
    setIsOnline(false)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header userType='captain' userData={captain} />

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {!rideAccepted ? (
          <>
            {/* Status Section */}
            <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold mb-2'>{isOnline ? "You're Online" : "You're Offline"}</h2>
                  <p className='text-gray-600'>{isOnline ? 'Ready to accept rides' : 'Go online to start earning'}</p>
                </div>
                <button
                  onClick={() => {
                    if (!isOnline) {
                      handleGoOnline()
                    } else {
                      handleGoOffline()
                    }
                  }}
                  className={`px-8 py-3 rounded-lg font-bold text-lg transition ${
                    isOnline
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </button>
              </div>
            </div>

            {/* Earnings Dashboard */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <p className='text-gray-600 text-sm mb-2'>Today's Earnings</p>
                <h3 className='text-4xl font-bold mb-2'>₹{Math.floor(Math.random() * 2000) + 500}</h3>
                <p className='text-gray-600'>{Math.floor(Math.random() * 8) + 2} trips completed</p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-md'>
                <p className='text-gray-600 text-sm mb-2'>This Week</p>
                <h3 className='text-4xl font-bold mb-2'>₹{Math.floor(Math.random() * 8000) + 3000}</h3>
                <p className='text-gray-600'>{Math.floor(Math.random() * 30) + 10} trips completed</p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-md'>
                <p className='text-gray-600 text-sm mb-2'>Acceptance Rate</p>
                <h3 className='text-4xl font-bold mb-2'>95%</h3>
                <p className='text-gray-600'>Great work! Keep it up 👏</p>
              </div>
            </div>

            {/* Ride Request Notification */}
            {hasRideRequest && currentRide && (
              <div className='bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg shadow-lg mb-8 animate-pulse'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-2xl font-bold mb-4'>🚗 New Ride Request!</h3>
                    <div className='space-y-2 mb-6'>
                      <p><span className='font-semibold'>From:</span> {currentRide.pickupLocation}</p>
                      <p><span className='font-semibold'>To:</span> {currentRide.dropoffLocation}</p>
                      <p><span className='font-semibold'>Passenger:</span> {currentRide.userName} ⭐{currentRide.rating}</p>
                      <p><span className='font-semibold'>Ride Type:</span> <span className='capitalize'>{currentRide.rideType}</span></p>
                      <p><span className='font-semibold'>Estimated Earnings:</span> <span className='text-green-600 font-bold'>₹{Math.floor(Math.random() * 300) + 150}</span></p>
                      <p><span className='font-semibold'>Available Requests:</span> {availableRides.length}</p>
                    </div>
                  </div>
                  <div className='text-5xl'>📍</div>
                </div>
                <div className='flex gap-4'>
                  <button
                    onClick={() => acceptRide(currentRide)}
                    className='flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition text-lg'
                  >
                    Accept Ride
                  </button>
                  <button
                    onClick={() => skipRide(currentRide)}
                    className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition text-lg'
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {/* Available Rides List */}
            {isOnline && availableRides.length > 0 && !hasRideRequest && (
              <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
                <h3 className='text-xl font-bold mb-4'>📋 Available Ride Requests ({availableRides.length})</h3>
                <div className='space-y-3 max-h-96 overflow-y-auto'>
                  {availableRides.map((ride) => (
                    <div key={ride.id} className='border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <p className='font-semibold text-lg'>{ride.userName}</p>
                          <p className='text-sm text-gray-600'>📍 {ride.pickupLocation}</p>
                          <p className='text-sm text-gray-600'>📍 {ride.dropoffLocation}</p>
                          <p className='text-xs text-gray-500 mt-1 capitalize'>Type: {ride.rideType}</p>
                        </div>
                        <button
                          onClick={() => {
                            setHasRideRequest(true)
                            setCurrentRide(ride)
                          }}
                          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition'
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vehicle Details */}
            <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
              <h3 className='text-xl font-bold mb-4'>Your Vehicle</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>Vehicle Type</p>
                  <p className='text-lg font-semibold capitalize'>{captain?.vehicle?.vehicleType || 'Not specified'}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>Vehicle Color</p>
                  <p className='text-lg font-semibold capitalize'>{captain?.vehicle?.color || 'Not specified'}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>License Plate</p>
                  <p className='text-lg font-semibold uppercase'>{captain?.vehicle?.plate || 'Not specified'}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>Capacity</p>
                  <p className='text-lg font-semibold'>{captain?.vehicle?.capacity || 'Not specified'} seats</p>
                </div>
              </div>
              <button className='mt-4 w-full border-2 border-black text-black font-semibold py-2 rounded-lg hover:bg-gray-100 transition'>
                Edit Vehicle Details
              </button>
            </div>

            {/* Support Sections */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
                <h4 className='font-bold text-lg mb-3'>🛡️ Safety Tips</h4>
                <p className='text-gray-700 mb-4 text-sm'>Always drive safely, maintain vehicle standards, and follow traffic rules to enjoy a perfect rating.</p>
                <button className='w-full border-2 border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition'>
                  View Guidelines
                </button>
              </div>

              <div className='bg-purple-50 p-6 rounded-lg border border-purple-200'>
                <h4 className='font-bold text-lg mb-3'>💬 Support Center</h4>
                <p className='text-gray-700 mb-4 text-sm'>Have questions? Our support team is available 24/7 to help you.</p>
                <button className='w-full border-2 border-purple-600 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition'>
                  Contact Support
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Ride Accepted Screen */
          <div className='max-w-2xl mx-auto'>
            <div className='bg-white p-8 rounded-lg shadow-lg mb-6'>
              <div className='text-center mb-6'>
                <h2 className='text-2xl font-bold mb-4'>🚗 Trip in Progress</h2>
                <div className='inline-block'>
                  <div className='animate-bounce rounded-full h-20 w-20 bg-green-500 flex items-center justify-center text-4xl'>
                    📍
                  </div>
                </div>
              </div>

              <div className='bg-gray-100 p-6 rounded-lg mb-6 space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='font-semibold'>Passenger:</span>
                  <span>{currentRide?.userName || 'User'}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='font-semibold'>From:</span>
                  <span>{currentRide?.pickupLocation || 'N/A'}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='font-semibold'>To:</span>
                  <span>{currentRide?.dropoffLocation || 'N/A'}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='font-semibold'>Ride Type:</span>
                  <span className='capitalize'>{currentRide?.rideType || 'car'}</span>
                </div>
                <div className='flex justify-between items-center border-t pt-4'>
                  <span className='font-bold text-lg'>Estimated Earnings:</span>
                  <span className='text-green-600 font-bold text-lg'>₹{Math.floor(Math.random() * 300) + 150}</span>
                </div>
              </div>

              <button
                onClick={completeRide}
                className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition text-lg'
              >
                ✓ Complete Ride
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CaptainHome