import React, { useContext, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import Header from '../components/Header'

const CaptainRideHistory = () => {
  const { captain } = useContext(CaptainDataContext)
  const [dateFilter, setDateFilter] = useState('today')
  const [expandedRide, setExpandedRide] = useState(null)

  // Mock data - replace with API data
  const rideHistory = [
    {
      id: 1,
      date: '2024-01-15',
      time: '10:30 AM',
      passengerName: 'John Doe',
      from: 'Mumbai Central Station',
      to: 'BKC, Bandra',
      distance: '15 km',
      fare: '450',
      duration: '45 mins',
      passengerRating: 5,
      status: 'Completed',
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '02:15 PM',
      passengerName: 'Sarah Khan',
      from: 'Dadar East',
      to: 'Worli Sea Face',
      distance: '8 km',
      fare: '220',
      duration: '25 mins',
      passengerRating: 4,
      status: 'Completed',
    },
    {
      id: 3,
      date: '2024-01-15',
      time: '06:45 PM',
      passengerName: 'Amit Sharma',
      from: 'Gateway of India',
      to: 'Bandra West',
      distance: '12 km',
      fare: '380',
      duration: '40 mins',
      passengerRating: 5,
      status: 'Completed',
    },
    {
      id: 4,
      date: '2024-01-14',
      time: '11:20 AM',
      passengerName: 'Priya Nair',
      from: 'Andheri West',
      to: 'Powai',
      distance: '6 km',
      fare: '180',
      duration: '20 mins',
      passengerRating: 4,
      status: 'Completed',
    },
    {
      id: 5,
      date: '2024-01-14',
      time: '09:00 PM',
      passengerName: 'Rajesh Gupta',
      from: 'NCPA, Nariman Point',
      to: 'Marine Lines',
      distance: '3 km',
      fare: '120',
      duration: '15 mins',
      passengerRating: 5,
      status: 'Completed',
    },
    {
      id: 6,
      date: '2024-01-14',
      time: '03:30 PM',
      passengerName: 'Neha Singh',
      from: 'Vile Parle',
      to: 'Fort',
      distance: '18 km',
      fare: '520',
      duration: '50 mins',
      passengerRating: 5,
      status: 'Completed',
    },
  ]

  const filteredRides = dateFilter === 'today' 
    ? rideHistory.filter(r => r.date === '2024-01-15')
    : rideHistory

  const todayEarnings = rideHistory
    .filter(r => r.date === '2024-01-15')
    .reduce((sum, r) => sum + parseInt(r.fare), 0)

  const totalEarnings = rideHistory.reduce((sum, r) => sum + parseInt(r.fare), 0)
  const averageRating = (rideHistory.reduce((sum, r) => sum + r.passengerRating, 0) / rideHistory.length).toFixed(1)

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header userType='captain' />
      <div className='py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Your Earnings</h1>
          <p className='text-gray-600'>Track your rides and earnings history</p>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Today's Earnings</p>
            <p className='text-3xl font-bold text-green-600'>₹{todayEarnings}</p>
            <p className='text-gray-600 text-xs mt-1'>3 rides completed</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Total Earnings</p>
            <p className='text-3xl font-bold text-green-600'>₹{totalEarnings}</p>
            <p className='text-gray-600 text-xs mt-1'>6 rides completed</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Avg Rating</p>
            <p className='text-3xl font-bold'>⭐{averageRating}</p>
            <p className='text-gray-600 text-xs mt-1'>From 6 rides</p>
          </div>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <p className='text-gray-600 text-sm mb-1'>Acceptance Rate</p>
            <p className='text-3xl font-bold'>95%</p>
            <p className='text-gray-600 text-xs mt-1'>Great work!</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className='flex gap-2 mb-6'>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              dateFilter === 'today'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:border-black'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              dateFilter === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:border-black'
            }`}
          >
            All Rides
          </button>
          <div className='ml-auto'>
            <select className='border border-gray-300 px-4 py-2 rounded-lg focus:outline-none'>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Rides List */}
        <div className='space-y-4'>
          {filteredRides.map((ride) => (
            <div
              key={ride.id}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              {/* Main Row */}
              <div
                onClick={() => setExpandedRide(expandedRide?.id === ride.id ? null : ride)}
                className='p-6 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between'
              >
                <div className='flex-1'>
                  <div className='flex items-start gap-4'>
                    <div className='text-3xl'>🚗</div>
                    <div>
                      <h3 className='font-bold text-lg'>{ride.passengerName}</h3>
                      <p className='text-gray-600 text-sm'>{ride.date} at {ride.time}</p>
                      <p className='text-gray-600 text-sm mt-1'>
                        {ride.from} → {ride.to}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='text-right min-w-fit ml-4'>
                  <p className='text-3xl font-bold text-green-600'>₹{ride.fare}</p>
                  <p className='text-gray-600 text-sm mt-2'>{ride.distance}</p>
                  <div className='flex gap-1 justify-end mt-2'>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < ride.passengerRating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <button className='ml-4 text-gray-400 hover:text-gray-600 text-xl'>
                  {expandedRide?.id === ride.id ? '▲' : '▼'}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedRide?.id === ride.id && (
                <div className='border-t px-6 py-4 bg-gray-50 space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <h4 className='font-semibold mb-3'>Ride Details</h4>
                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Duration:</span>
                          <span className='font-semibold'>{ride.duration}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Distance:</span>
                          <span className='font-semibold'>{ride.distance}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Status:</span>
                          <span className='font-semibold text-green-600'>{ride.status}</span>
                        </div>
                        <div className='flex justify-between border-t pt-2'>
                          <span className='text-gray-600'>Base Fare:</span>
                          <span className='font-semibold'>₹{ride.fare}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-semibold mb-3'>Passenger Info</h4>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
                            👤
                          </div>
                          <div>
                            <p className='font-semibold'>{ride.passengerName}</p>
                            <p className='text-gray-600 text-sm'>⭐ {ride.passengerRating} stars</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Map Visual */}
                  <div className='bg-white p-4 rounded-lg border border-gray-200'>
                    <h4 className='font-semibold mb-3'>Route</h4>
                    <div className='space-y-2'>
                      <div className='flex items-start gap-3'>
                        <span className='text-xl mt-1'>📍</span>
                        <div>
                          <p className='font-semibold text-sm'>Pickup</p>
                          <p className='text-gray-600 text-sm'>{ride.from}</p>
                        </div>
                      </div>
                      <div className='ml-3 h-4 border-l-2 border-gray-300'></div>
                      <div className='flex items-start gap-3'>
                        <span className='text-xl mt-1'>📍</span>
                        <div>
                          <p className='font-semibold text-sm'>Dropoff</p>
                          <p className='text-gray-600 text-sm'>{ride.to}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-3 pt-4 border-t'>
                    <button className='flex-1 border-2 border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition font-semibold'>
                      Download Invoice
                    </button>
                    <button className='flex-1 border-2 border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition font-semibold'>
                      Report Issue
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <div className='bg-white rounded-lg shadow-md p-12 text-center'>
            <p className='text-3xl mb-4'>🚗</p>
            <p className='text-xl font-bold mb-2'>No rides yet</p>
            <p className='text-gray-600'>Go online to start accepting rides and earning</p>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default CaptainRideHistory
