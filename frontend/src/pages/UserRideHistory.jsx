import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import Header from '../components/Header'

const UserRideHistory = () => {
  const { user } = useContext(UserDataContext)
  const [filter, setFilter] = useState('all')
  const [rideToRate, setRideToRate] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  // Mock data - replace with API data
  const rideHistory = [
    {
      id: 1,
      date: '2024-01-15',
      time: '10:30 AM',
      from: 'Mumbai Central Station',
      to: 'BKC, Bandra',
      distance: '15 km',
      fare: '₹450',
      duration: '45 mins',
      driverName: 'Rajesh Kumar',
      driverRating: 4.8,
      carType: 'UberX',
      carNumber: 'MH01AB1234',
      status: 'Completed',
      rated: true,
      yourRating: 5,
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '02:15 PM',
      from: 'Dadar East',
      to: 'Worli Sea Face',
      distance: '8 km',
      fare: '₹220',
      duration: '25 mins',
      driverName: 'Priya Singh',
      driverRating: 4.9,
      carType: 'UberPlus',
      carNumber: 'MH01CD5678',
      status: 'Completed',
      rated: false,
      yourRating: 0,
    },
    {
      id: 3,
      date: '2024-01-13',
      time: '06:45 PM',
      from: 'Gateway of India',
      to: 'Bandra West',
      distance: '12 km',
      fare: '₹380',
      duration: '40 mins',
      driverName: 'Arjun Patel',
      driverRating: 4.7,
      carType: 'UberX',
      carNumber: 'MH01EF9012',
      status: 'Completed',
      rated: true,
      yourRating: 4,
    },
    {
      id: 4,
      date: '2024-01-12',
      time: '11:20 AM',
      from: 'Andheri West',
      to: 'Powai',
      distance: '6 km',
      fare: '₹180',
      duration: '20 mins',
      driverName: 'Vikram Sharma',
      driverRating: 4.6,
      carType: 'UberXL',
      carNumber: 'MH01GH3456',
      status: 'Completed',
      rated: false,
      yourRating: 0,
    },
    {
      id: 5,
      date: '2024-01-11',
      time: '09:00 PM',
      from: 'NCPA, Nariman Point',
      to: 'Marine Lines',
      distance: '3 km',
      fare: '₹120',
      duration: '15 mins',
      driverName: 'Suresh Iyer',
      driverRating: 4.9,
      carType: 'UberX',
      carNumber: 'MH01IJ7890',
      status: 'Completed',
      rated: true,
      yourRating: 5,
    },
  ]

  const filteredRides = filter === 'all' ? rideHistory : rideHistory.filter(r => r.status.toLowerCase() === filter)

  const handleRateRide = (ride) => {
    setRideToRate(ride)
    setRating(ride.yourRating || 0)
    setReview('')
  }

  const submitRating = () => {
    setRideToRate(null)
    setRating(0)
    setReview('')
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header userType='user' />
      <div className='py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Your Ride History</h1>
          <p className='text-gray-600'>View and manage all your rides</p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Total Rides</p>
            <p className='text-2xl font-bold'>12</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Total Spent</p>
            <p className='text-2xl font-bold'>₹1,450</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Avg Rating Given</p>
            <p className='text-2xl font-bold'>4.8⭐</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Avg Trip Duration</p>
            <p className='text-2xl font-bold'>32 mins</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className='flex gap-2 mb-6 flex-wrap'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:border-black'
            }`}
          >
            All Rides
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'completed'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:border-black'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Rides List */}
        <div className='space-y-4'>
          {filteredRides.map((ride) => (
            <div key={ride.id} className='bg-white rounded-lg shadow-md p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <p className='text-2xl'>🚗</p>
                    <div>
                      <h3 className='font-bold text-lg'>{ride.carType}</h3>
                      <p className='text-gray-600 text-sm'>{ride.date} at {ride.time}</p>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-green-600'>{ride.fare}</p>
                  <p className='text-green-600 text-sm font-semibold'>{ride.status}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 pb-4 border-b'>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Route</p>
                  <div className='flex items-start gap-3'>
                    <div className='text-xl'>📍</div>
                    <div>
                      <p className='font-semibold'>{ride.from}</p>
                      <p className='text-gray-600 text-sm'>↓</p>
                      <p className='font-semibold'>{ride.to}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Trip Details</p>
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Distance:</span>
                      <span className='font-semibold'>{ride.distance}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Duration:</span>
                      <span className='font-semibold'>{ride.duration}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Car Number:</span>
                      <span className='font-semibold uppercase'>{ride.carNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              <div className='mb-4 pb-4 border-b'>
                <p className='text-gray-600 text-sm mb-3'>Driver Information</p>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>{ride.driverName}</p>
                    <p className='text-gray-600 text-sm'>⭐ {ride.driverRating}</p>
                  </div>
                  <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center'>
                    <span className='text-xl'>👤</span>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className='flex items-center justify-between'>
                {ride.rated ? (
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-600'>Your Rating:</span>
                    <div className='flex gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < ride.yourRating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className='text-gray-600 text-sm'>Not rated yet</p>
                )}
                <div className='flex gap-2'>
                  {!ride.rated && (
                    <button
                      onClick={() => handleRateRide(ride)}
                      className='border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold'
                    >
                      Rate Ride
                    </button>
                  )}
                  <button className='border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition'>
                    View Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <div className='bg-white rounded-lg shadow-md p-12 text-center'>
            <p className='text-3xl mb-4'>🚗</p>
            <p className='text-xl font-bold mb-2'>No rides found</p>
            <p className='text-gray-600'>You don't have any {filter} rides yet.</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {rideToRate && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
            <h2 className='text-2xl font-bold mb-4'>Rate Your Ride</h2>

            <div className='bg-gray-100 p-4 rounded-lg mb-6'>
              <p className='font-semibold mb-2'>{rideToRate.from} → {rideToRate.to}</p>
              <p className='text-gray-600 text-sm flex items-center gap-2'>
                🚗 {rideToRate.driverName} • {rideToRate.carType}
              </p>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-semibold mb-3'>How was your ride?</label>
              <div className='flex justify-center gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className='text-4xl transition transform hover:scale-110'
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-semibold mb-2'>Add a review (optional)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder='Share your feedback about this ride...'
                className='input w-full h-24 resize-none'
              />
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-semibold mb-3'>Add tip (optional)</label>
              <div className='flex gap-2'>
                {['₹0', '₹10', '₹20', '₹50'].map((amount) => (
                  <button
                    key={amount}
                    className='flex-1 border-2 border-gray-300 py-2 rounded-lg hover:border-black transition font-semibold'
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => setRideToRate(null)}
                className='flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition font-semibold'
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className='flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition font-semibold'
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default UserRideHistory
