import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import Header from '../components/Header'
import axios from 'axios'

const CaptainProfile = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext)
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

  const [isEditing, setIsEditing] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    firstname: captain?.fullname?.firstname || '',
    lastname: captain?.fullname?.lastname || '',
    email: captain?.email || '',
    phone: captain?.phone || '',
    vehicleType: captain?.vehicle?.vehicleType || '',
    vehicleColor: captain?.vehicle?.color || '',
    vehiclePlate: captain?.vehicle?.plate || '',
    vehicleCapacity: captain?.vehicle?.capacity || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoadingUpdate(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const token = localStorage.getItem('captainToken')
      const response = await axios.put(
        `${VITE_BASE_URL}/captains/profile`,
        {
          fullname: {
            firstname: formData.firstname,
            lastname: formData.lastname,
          },
          email: formData.email,
          phone: formData.phone,
          vehicle: {
            vehicleType: formData.vehicleType,
            color: formData.vehicleColor,
            plate: formData.vehiclePlate,
            capacity: formData.vehicleCapacity,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )

      setCaptain(response.data.captain)
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setIsLoadingUpdate(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header userType='captain' />
      <div className='py-8'>
        <div className='max-w-3xl mx-auto px-4'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='flex items-center gap-6'>
            <div className='w-20 h-20 bg-black rounded-full flex items-center justify-center'>
              <span className='text-white text-3xl font-bold'>
                {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
              </span>
            </div>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold mb-2'>
                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </h1>
              <p className='text-gray-600 mb-3'>{captain?.email}</p>
              <div className='flex gap-2'>
                <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold'>
                  ✓ Verified
                </span>
                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold'>
                  ⭐ 4.9 Rating
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-semibold whitespace-nowrap'
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2'>
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2'>
            <span>✕</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-2xl font-bold mb-8'>Edit Your Profile</h2>

            {/* Personal Information Section */}
            <h3 className='text-lg font-bold mb-4 pb-2 border-b'>Personal Information</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div>
                <label className='block text-sm font-semibold mb-2'>First Name</label>
                <input
                  type='text'
                  name='firstname'
                  value={formData.firstname}
                  onChange={handleChange}
                  className='input w-full'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold mb-2'>Last Name</label>
                <input
                  type='text'
                  name='lastname'
                  value={formData.lastname}
                  onChange={handleChange}
                  className='input w-full'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div>
                <label className='block text-sm font-semibold mb-2'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='input w-full'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold mb-2'>Phone</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  className='input w-full'
                  placeholder='+91 XXXXX XXXXX'
                />
              </div>
            </div>

            {/* Vehicle Information Section */}
            <h3 className='text-lg font-bold mb-4 pb-2 border-b'>Vehicle Information</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div>
                <label className='block text-sm font-semibold mb-2'>Vehicle Type</label>
                <select
                  name='vehicleType'
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className='input w-full'
                  required
                >
                  <option value=''>Select Vehicle Type</option>
                  <option value='sedan'>Sedan</option>
                  <option value='suv'>SUV</option>
                  <option value='hatchback'>Hatchback</option>
                  <option value='auto'>Auto</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-semibold mb-2'>Vehicle Color</label>
                <input
                  type='text'
                  name='vehicleColor'
                  value={formData.vehicleColor}
                  onChange={handleChange}
                  className='input w-full'
                  placeholder='e.g., White, Black'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div>
                <label className='block text-sm font-semibold mb-2'>License Plate</label>
                <input
                  type='text'
                  name='vehiclePlate'
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                  className='input w-full uppercase'
                  placeholder='e.g., MH01AB1234'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold mb-2'>Seating Capacity</label>
                <select
                  name='vehicleCapacity'
                  value={formData.vehicleCapacity}
                  onChange={handleChange}
                  className='input w-full'
                  required
                >
                  <option value=''>Select Capacity</option>
                  <option value='2'>2 Seater</option>
                  <option value='4'>4 Seater</option>
                  <option value='6'>6 Seater</option>
                  <option value='7'>7 Seater</option>
                </select>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoadingUpdate}
              className='w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoadingUpdate ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          /* View Profile */
          <>
            {/* Personal Information */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h2 className='text-2xl font-bold mb-6'>Personal Information</h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>First Name</p>
                  <p className='text-lg font-semibold'>{captain?.fullname?.firstname}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Last Name</p>
                  <p className='text-lg font-semibold'>{captain?.fullname?.lastname}</p>
                </div>
              </div>

              <hr className='my-6' />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Email Address</p>
                  <p className='text-lg font-semibold'>{captain?.email}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Phone Number</p>
                  <p className='text-lg font-semibold'>{captain?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h2 className='text-2xl font-bold mb-6'>Vehicle Information</h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Vehicle Type</p>
                  <p className='text-lg font-semibold capitalize'>{captain?.vehicle?.vehicleType || 'Not specified'}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Vehicle Color</p>
                  <p className='text-lg font-semibold capitalize'>{captain?.vehicle?.color || 'Not specified'}</p>
                </div>
              </div>

              <hr className='my-6' />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>License Plate</p>
                  <p className='text-lg font-semibold uppercase'>{captain?.vehicle?.plate || 'Not specified'}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Seating Capacity</p>
                  <p className='text-lg font-semibold'>{captain?.vehicle?.capacity || 'Not specified'} Seats</p>
                </div>
              </div>
            </div>

            {/* Earnings & Performance */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold mb-3'>💰 Total Earnings</h3>
                <p className='text-3xl font-bold text-green-600'>₹12,450</p>
                <p className='text-gray-600 text-sm mt-2'>All time earnings</p>
                <Link to='/captain/rides' className='block w-full mt-4 border-2 border-green-600 text-green-600 font-semibold py-2 rounded-lg hover:bg-green-50 transition text-center'>
                  View Earnings Details
                </Link>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold mb-3'>🚗 Total Trips</h3>
                <p className='text-3xl font-bold'>156</p>
                <p className='text-gray-600 text-sm mt-2'>Completed rides</p>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold mb-3'>⭐ Your Rating</h3>
                <p className='text-3xl font-bold'>4.9</p>
                <p className='text-gray-600 text-sm mt-2'>Out of 5.0</p>
              </div>
            </div>

            {/* Documents & Compliance */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h2 className='text-2xl font-bold mb-6'>📋 Documents & Verification</h2>

              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>✓</span>
                    <div>
                      <p className='font-semibold'>Driving License</p>
                      <p className='text-gray-600 text-sm'>Verified</p>
                    </div>
                  </div>
                  <span className='text-green-600 font-semibold'>Active</span>
                </div>

                <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>✓</span>
                    <div>
                      <p className='font-semibold'>RC Certificate</p>
                      <p className='text-gray-600 text-sm'>Verified</p>
                    </div>
                  </div>
                  <span className='text-green-600 font-semibold'>Active</span>
                </div>

                <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl'>✓</span>
                    <div>
                      <p className='font-semibold'>Insurance Certificate</p>
                      <p className='text-gray-600 text-sm'>Verified</p>
                    </div>
                  </div>
                  <span className='text-green-600 font-semibold'>Active</span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h3 className='text-lg font-bold mb-6'>⚙️ Settings & Preferences</h3>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>Push Notifications</p>
                    <p className='text-gray-600 text-sm'>Get ride requests and updates</p>
                  </div>
                  <input type='checkbox' defaultChecked className='w-5 h-5' />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>SMS Notifications</p>
                    <p className='text-gray-600 text-sm'>Receive important alerts via SMS</p>
                  </div>
                  <input type='checkbox' defaultChecked className='w-5 h-5' />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>Share Location</p>
                    <p className='text-gray-600 text-sm'>Allow passengers to see your location</p>
                  </div>
                  <input type='checkbox' defaultChecked className='w-5 h-5' />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>Receive Ride Requests</p>
                    <p className='text-gray-600 text-sm'>Turn on/off ride request notifications</p>
                  </div>
                  <input type='checkbox' defaultChecked className='w-5 h-5' />
                </div>
              </div>
            </div>

            {/* Safety & Support */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
                <h3 className='text-lg font-bold text-blue-900 mb-4'>🛡️ Safety Resources</h3>
                <p className='text-gray-700 mb-4 text-sm'>Access safety guidelines and protocols for safe riding</p>
                <button className='w-full border-2 border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition'>
                  View Safety Guidelines
                </button>
              </div>

              <div className='bg-purple-50 border border-purple-200 rounded-lg p-6'>
                <h3 className='text-lg font-bold text-purple-900 mb-4'>💬 Support Center</h3>
                <p className='text-gray-700 mb-4 text-sm'>Contact our support team for any queries or issues</p>
                <button className='w-full border-2 border-purple-600 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition'>
                  Contact Support
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
              <h3 className='text-lg font-bold text-red-700 mb-4'>Danger Zone</h3>
              <p className='text-gray-700 mb-4'>Once you deactivate your account, you won\'t receive ride requests. This can be reversed anytime.</p>
              <button className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition'>
                Deactivate Account
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  )
}

export default CaptainProfile
