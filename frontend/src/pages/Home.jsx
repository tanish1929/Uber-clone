import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import Header from '../components/Header'
import axios from 'axios'
import { emitUserRideRequest, emitUserRateRide } from '../services/socket'

const Home = () => {
  const { user, acceptedRide, setAcceptedRide, rideStatus, setRideStatus, completedRide, setCompletedRide } = useContext(UserDataContext)
  const navigate = useNavigate()
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [activeTab, setActiveTab] = useState('ride')
  const [rideRequested, setRideRequested] = useState(false)
  const [selectedRideType, setSelectedRideType] = useState('car')
  const [currentRideId, setCurrentRideId] = useState(null)

  const searchRides = async (e) => {
    e.preventDefault()
    if (!pickupLocation || !dropoffLocation) {
      alert('Please enter both locations')
      return
    }

    // Create ride request
    const rideRequest = {
      id: Date.now(),
      userId: user?._id || 'user_' + Date.now(),
      userName: user?.fullname?.firstname || 'Guest User',
      userEmail: user?.email || 'user@example.com',
      pickupLocation,
      dropoffLocation,
      rideType: selectedRideType,
      timestamp: new Date().toISOString(),
      status: 'pending',
      rating: 4.8,
    }

    setCurrentRideId(rideRequest.id)
    setRideRequested(true)
    setRideStatus('searching')
    setAcceptedRide(null)
    setCompletedRide(null)

    // Emit ride request via Socket.IO
    emitUserRideRequest(rideRequest)
  }

  const cancelRide = () => {
    setRideRequested(false)
    setPickupLocation('')
    setDropoffLocation('')
    setCurrentRideId(null)
    setAcceptedRide(null)
    setCompletedRide(null)
    setRideStatus('idle')
  }

  const newRide = () => {
    setRideRequested(false)
    setPickupLocation('')
    setDropoffLocation('')
    setCurrentRideId(null)
    setAcceptedRide(null)
    setCompletedRide(null)
    setRideStatus('idle')
  }



  return (
    <div className='min-h-screen bg-gray-50'>
      <Header userType='user' userData={user} />

      {/* Main Content */}
      {!rideRequested ? (
        <div className='max-w-7xl mx-auto px-4 py-8'>
          {/* Search Section */}
          <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-2xl font-bold mb-6'>Where to?</h2>
            
            <form onSubmit={searchRides} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Pickup Location</label>
                  <input
                    type="text"
                    className='input w-full'
                    placeholder='Enter pickup location'
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>Dropoff Location</label>
                  <input
                    type="text"
                    className='input w-full'
                    placeholder='Where to?'
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type='submit' className='w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition'>
                Search Rides
              </button>
            </form>
          </div>

          {/* Ride Types */}
          <div className='mb-8'>
            <h3 className='text-xl font-bold mb-4'>Choose Your Ride</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {[
                { name: 'UberX', price: '₹12/km', description: 'Affordable, everyday rides', icon: '🚗' },
                { name: 'UberPlus', price: '₹16/km', description: 'Premium cars, top drivers', icon: '⭐' },
                { name: 'UberXL', price: '₹14/km', description: 'More seats, more savings', icon: '🚙' }
              ].map((ride, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedRideType(ride.name)}
                  className={`p-4 rounded-lg shadow-md cursor-pointer transition border-2 ${
                    selectedRideType === ride.name ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:shadow-lg'
                  }`}
                >
                  <div className='text-3xl mb-2'>{ride.icon}</div>
                  <h4 className='font-bold text-lg'>{ride.name}</h4>
                  <p className={selectedRideType === ride.name ? 'text-gray-300' : 'text-gray-600'} >{ride.description}</p>
                  <p className='font-semibold mt-2'>{ride.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='font-bold text-lg mb-3'>💼 Schedule a Ride</h4>
              <p className='text-gray-600 mb-4'>Plan ahead and let drivers know when you need them</p>
              <button className='w-full border-2 border-black text-black font-semibold py-2 rounded-lg hover:bg-gray-100 transition'>
                Schedule
              </button>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h4 className='font-bold text-lg mb-3'>❤️ Saved Places</h4>
              <p className='text-gray-600 mb-4'>Save your frequent destinations for faster booking</p>
              <button className='w-full border-2 border-black text-black font-semibold py-2 rounded-lg hover:bg-gray-100 transition'>
                Add Places
              </button>
            </div>
          </div>

          {/* Safety Section */}
          <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
            <h4 className='font-bold text-lg mb-3'>🛡️ Your Safety Matters</h4>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <p className='font-semibold'>Verified Drivers</p>
                <p className='text-sm text-gray-600'>All drivers are background checked</p>
              </div>
              <div>
                <p className='font-semibold'>📍 Real-time Tracking</p>
                <p className='text-sm text-gray-600'>Share your trip with trusted contacts</p>
              </div>
              <div>
                <p className='font-semibold'>🆘 24/7 Support</p>
                <p className='text-sm text-gray-600'>Emergency support available anytime</p>
              </div>
            </div>
          </div>
        </div>
      ) : rideStatus === 'accepted' && acceptedRide && acceptedRide.captainDetails ? (
        /* Ride Accepted Screen - Show Captain Details */
        <div className='max-w-3xl mx-auto px-4 py-8'>
          <div className='bg-white p-8 rounded-lg shadow-lg'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold mb-4'>✅ Ride Accepted!</h2>
              <p className='text-gray-600 text-lg'>Your driver is on the way</p>
            </div>

            {/* Driver Details Card */}
            <div className='bg-linear-to-br from-blue-50 to-blue-100 p-8 rounded-lg mb-6 border-2 border-blue-300'>
              <div className='grid grid-cols-2 gap-8 mb-8'>
                <div className='text-center'>
                  <div className='bg-blue-500 text-white rounded-full h-24 w-24 flex items-center justify-center text-5xl mx-auto mb-3'>
                    👤
                  </div>
                  <h3 className='text-2xl font-bold mb-1'>{acceptedRide.captainDetails.name}</h3>
                  <p className='text-gray-700'>
                    <span className='text-yellow-500 text-lg'>⭐</span> {acceptedRide.captainDetails.driverRating || 4.9}
                  </p>
                </div>
                <div className='flex flex-col justify-center'>
                  <div className='bg-white p-4 rounded-lg mb-4 shadow-sm'>
                    <p className='text-gray-600 text-sm mb-1'>Vehicle Type</p>
                    <p className='text-xl font-bold capitalize'>{acceptedRide.captainDetails.vehicleType}</p>
                  </div>
                  <div className='bg-white p-4 rounded-lg shadow-sm'>
                    <p className='text-gray-600 text-sm mb-1'>License Plate</p>
                    <p className='text-xl font-bold uppercase tracking-widest'>{acceptedRide.captainDetails.licensePlate}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='text-gray-600 text-sm mb-1'>Vehicle Color</p>
                  <p className='text-lg font-semibold capitalize'>{acceptedRide.captainDetails.vehicleColor}</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='text-gray-600 text-sm mb-1'>Seats Available</p>
                  <p className='text-lg font-semibold'>{acceptedRide.captainDetails.vehicleCapacity} Seater</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='text-gray-600 text-sm mb-1'>Estimated Fare</p>
                  <p className='text-xl font-bold text-green-600'>₹{acceptedRide.captainDetails.estimatedPrice}</p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className='bg-gray-50 p-6 rounded-lg mb-6 space-y-4 border-l-4 border-blue-500'>
              <div>
                <p className='text-gray-600 text-sm mb-1'>📍 Pickup Location</p>
                <p className='text-lg font-semibold'>{acceptedRide.pickupLocation}</p>
              </div>
              <div>
                <p className='text-gray-600 text-sm mb-1'>📍 Dropoff Location</p>
                <p className='text-lg font-semibold'>{acceptedRide.dropoffLocation}</p>
              </div>
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>Ride Type</p>
                  <p className='font-semibold capitalize'>{acceptedRide.rideType}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>Accepted At</p>
                  <p className='font-semibold'>
                    {new Date(acceptedRide.captainDetails.acceptedAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <button
                onClick={newRide}
                className='flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition'
              >
                Cancel Ride
              </button>
              <button
                onClick={newRide}
                disabled
                className='flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg opacity-50 cursor-not-allowed'
              >
                Trip in Progress...
              </button>
            </div>
          </div>
        </div>
      ) : rideStatus === 'completed' && completedRide ? (
        /* Ride Completed Screen - Show Completion Details */
        <div className='max-w-3xl mx-auto px-4 py-8'>
          <div className='bg-white p-8 rounded-lg shadow-lg'>
            <div className='text-center mb-8'>
              <h2 className='text-4xl mb-2'>✅ Trip Complete!</h2>
              <p className='text-gray-600 text-lg'>Thank you for your ride</p>
            </div>

            {/* Driver & Vehicle Info Summary */}
            <div className='bg-linear-to-br from-green-50 to-green-100 p-8 rounded-lg mb-6 border-2 border-green-300'>
              <h3 className='text-xl font-bold mb-6 text-center'>Trip Summary</h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='text-gray-600 text-sm mb-2'>👤 Driver Name</p>
                  <p className='text-2xl font-bold'>{completedRide.captainDetails?.name || 'Your Driver'}</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-sm'>
                  <p className='text-gray-600 text-sm mb-2'>🚗 Vehicle</p>
                  <p className='text-lg font-semibold'>
                    <span className='capitalize'>{completedRide.captainDetails?.vehicleColor || 'white'}</span> {' '}
                    <span className='capitalize'>{completedRide.captainDetails?.vehicleType || 'car'}</span>
                  </p>
                  <p className='text-sm text-gray-600 uppercase tracking-wider'>
                    {completedRide.captainDetails?.licensePlate || 'XX-00-XX-0000'}
                  </p>
                </div>
              </div>

              {/* Route Details */}
              <div className='border-t-2 border-gray-200 pt-6 mb-6 space-y-4'>
                <div className='flex items-start gap-4'>
                  <span className='text-2xl mt-1'>📍</span>
                  <div>
                    <p className='text-gray-600 text-sm'>Pickup</p>
                    <p className='font-semibold text-lg'>{completedRide.pickupLocation}</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <span className='text-2xl mt-1'>📍</span>
                  <div>
                    <p className='text-gray-600 text-sm'>Dropoff</p>
                    <p className='font-semibold text-lg'>{completedRide.dropoffLocation}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className='bg-gray-100 p-6 rounded-lg border-2 border-green-300'>
                <div className='flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-300'>
                  <span className='text-gray-700 font-semibold'>Base Fare</span>
                  <span className='font-semibold'>₹120</span>
                </div>
                <div className='flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-300'>
                  <span className='text-gray-700 font-semibold'>Ride Charge</span>
                  <span className='font-semibold'>₹{completedRide.captainDetails?.estimatedPrice - 120 || 150}</span>
                </div>
                <div className='flex justify-between items-center text-xl font-bold text-green-600 pt-2'>
                  <span>Total Amount</span>
                  <span>₹{completedRide.captainDetails?.estimatedPrice || 270}</span>
                </div>
              </div>
            </div>

            {/* Rating & Feedback */}
            <div className='bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200'>
              <h3 className='text-lg font-bold mb-4'>Rate Your Ride</h3>
              <div className='flex justify-center items-center gap-3 mb-6'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className='text-4xl hover:scale-110 transition transform cursor-pointer'
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <textarea
                placeholder='Share your feedback...'
                className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500'
                rows='3'
              />
            </div>

            {/* Action Buttons */}
            <button
              onClick={newRide}
              className='w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition text-lg'
            >
              Book Another Ride
            </button>
          </div>
        </div>
      ) : (
        /* Ride Requested Screen - Finding Ride */
        <div className='max-w-2xl mx-auto px-4 py-8'>
          <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
            <div className='mb-6'>
              <div className='inline-block'>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-black'></div>
              </div>
            </div>
            
            <h2 className='text-2xl font-bold mb-4'>Finding Your Ride...</h2>
            
            <div className='bg-gray-100 p-6 rounded-lg mb-6 text-left'>
              <p className='mb-3'><span className='font-semibold'>From:</span> {pickupLocation}</p>
              <p className='mb-3'><span className='font-semibold'>To:</span> {dropoffLocation}</p>
              <p className='mb-3'><span className='font-semibold'>Ride Type:</span> {selectedRideType}</p>
              <p><span className='font-semibold'>Status:</span> <span className='text-green-600 font-semibold'>Looking for drivers...</span></p>
            </div>

            <button 
              onClick={cancelRide}
              className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition'
            >
              Cancel Ride
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home