import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import Header from '../components/Header'
import axios from 'axios'

const UserProfile = () => {
  const { user, setUser } = useContext(UserDataContext)
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstname: user?.fullname?.firstname || '',
    lastname: user?.fullname?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${VITE_BASE_URL}/users/profile`,
        {
          fullname: {
            firstname: formData.firstname,
            lastname: formData.lastname,
          },
          email: formData.email,
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setUser(response.data.user)
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header userType='user' />
      <div className='py-8'>
        <div className='max-w-2xl mx-auto px-4'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='flex items-center gap-6'>
            <div className='w-20 h-20 bg-black rounded-full flex items-center justify-center'>
              <span className='text-white text-3xl font-bold'>
                {user?.fullname?.firstname?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold mb-2'>
                {user?.fullname?.firstname} {user?.fullname?.lastname}
              </h1>
              <p className='text-gray-600 mb-3'>{user?.email}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className='bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-semibold'
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
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
            <h2 className='text-2xl font-bold mb-6'>Edit Your Profile</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
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

            <div className='mb-6'>
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

            <div className='mb-6'>
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

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
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
                  <p className='text-lg font-semibold'>{user?.fullname?.firstname}</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm mb-2'>Last Name</p>
                  <p className='text-lg font-semibold'>{user?.fullname?.lastname}</p>
                </div>
              </div>

              <hr className='my-6' />

              <div>
                <p className='text-gray-600 text-sm mb-2'>Email Address</p>
                <p className='text-lg font-semibold mb-4'>{user?.email}</p>
              </div>

              <div>
                <p className='text-gray-600 text-sm mb-2'>Phone Number</p>
                <p className='text-lg font-semibold'>{user?.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold mb-3'>🚗 Your Rides</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Total Rides</span>
                    <span className='font-semibold'>12</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>This Month</span>
                    <span className='font-semibold'>3</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Total Spent</span>
                    <span className='font-semibold'>₹1,450</span>
                  </div>
                </div>
                <Link to='/user/rides' className='w-full mt-4 border-2 border-black text-black font-semibold py-2 rounded-lg hover:bg-gray-100 transition block text-center'>
                  View Ride History
                </Link>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold mb-3'>⭐ Your Rating</h3>
                <div className='text-center mb-4'>
                  <div className='text-5xl font-bold mb-2'>4.9</div>
                  <div className='flex justify-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < 5 ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className='text-gray-600 text-sm mt-2'>Based on 12 rides</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h3 className='text-lg font-bold mb-4'>💳 Payment Methods</h3>
              <div className='space-y-3'>
                <div className='flex items-center gap-4 p-4 border border-gray-200 rounded-lg'>
                  <div className='text-2xl'>💳</div>
                  <div className='flex-1'>
                    <p className='font-semibold'>Visa Card</p>
                    <p className='text-gray-600 text-sm'>**** **** **** 4242</p>
                  </div>
                  <button className='text-gray-500 hover:text-red-600'>✕</button>
                </div>
              </div>
              <button className='w-full mt-4 border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition'>
                + Add Payment Method
              </button>
            </div>

            {/* Preferences */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <h3 className='text-lg font-bold mb-6'>⚙️ Preferences</h3>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>Share my trip with</p>
                    <p className='text-gray-600 text-sm'>Allow contacts to track your ride</p>
                  </div>
                  <input type='checkbox' defaultChecked className='w-5 h-5' />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>Push Notifications</p>
                    <p className='text-gray-600 text-sm'>Get updates about rides and promos</p>
                  </div>
                  <input type='checkbox' defaultChecked className='w-5 h-5' />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold'>SMS Notifications</p>
                    <p className='text-gray-600 text-sm'>Receive ride confirmations via SMS</p>
                  </div>
                  <input type='checkbox' className='w-5 h-5' />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
              <h3 className='text-lg font-bold text-red-700 mb-4'>Danger Zone</h3>
              <p className='text-gray-700 mb-4'>Once you delete your account, there is no going back. Please be certain.</p>
              <button className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition'>
                Delete Account
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
