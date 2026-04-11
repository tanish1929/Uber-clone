import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = ({ userType = 'user', userData = null }) => {
  const navigate = useNavigate()
  const isUser = userType === 'user'
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    let name = ''

    // First, try to get from prop
    if (userData && userData.fullname && userData.fullname.firstname) {
      name = userData.fullname.firstname
    } 
    // If prop doesn't have data, try localStorage
    else {
      const storageKey = isUser ? 'user' : 'captain'
      const storedData = localStorage.getItem(storageKey)
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData)
          if (parsed && parsed.fullname && parsed.fullname.firstname) {
            name = parsed.fullname.firstname
          }
        } catch (error) {
          console.error('Error parsing localStorage:', error)
        }
      }
    }
    
    setDisplayName(name)
  }, [userData, isUser])
  
  const profilePath = isUser ? '/user/profile' : '/captain/profile'
  const homePath = isUser ? '/home' : '/captain-home'
  const ridesPath = isUser ? '/user/rides' : '/captain/rides'
  const logoutPath = isUser ? '/user/logout' : '/captain/logout'

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link to={homePath} className='flex items-center'>
          <img
            className="w-12"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="uber logo"
          />
        </Link>

        {/* Navigation Links */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link to={homePath} className='text-gray-700 hover:text-black font-semibold transition'>
            {isUser ? 'Book Ride' : 'Dashboard'}
          </Link>
          <Link to={ridesPath} className='text-gray-700 hover:text-black font-semibold transition'>
            {isUser ? 'My Rides' : 'My Earnings'}
          </Link>
          <Link to={profilePath} className='text-gray-700 hover:text-black font-semibold transition'>
            Profile
          </Link>
        </nav>

        {/* Right Section */}
        <div className='flex items-center gap-2 sm:gap-4'>
          <div className='text-right'>
            <p className='text-xs sm:text-sm text-gray-500'>Welcome</p>
            <p className='text-sm sm:text-base text-gray-900 font-semibold'>{displayName || 'User'}</p>
          </div>
          <Link
            to={logoutPath}
            className='bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition'
          >
            Logout
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
