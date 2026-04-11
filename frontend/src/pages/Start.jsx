import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-[url('https://plus.unsplash.com/premium_photo-1737109193379-3ecf2fd3359a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0')] flex flex-col justify-between">

      {/* Logo */}
      <img 
        className="w-16 sm:w-20 md:w-24 lg:w-28 ml-4 sm:ml-6 mt-4 sm:mt-6"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="uber logo"
      />

      {/* Bottom Card */}
      <div className="bg-white w-full sm:max-w-md md:max-w-lg mx-auto rounded-t-3xl px-5 sm:px-8 py-6 sm:py-8 shadow-xl">

        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center leading-snug">
          Get Started with Uber
        </h2>

        <p className='text-center text-gray-600 mt-3 mb-6 text-sm sm:text-base'>
          Choose your role to continue
        </p>

        <Link 
          to="/login" 
          className="flex items-center justify-center w-full bg-black text-white py-3 sm:py-4 rounded-lg mt-3 text-sm sm:text-base md:text-lg hover:bg-gray-900 transition font-semibold"
        >
          I'm a Rider
        </Link>

        <Link 
          to="/captain-login" 
          className="flex items-center justify-center w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg mt-3 text-sm sm:text-base md:text-lg hover:bg-green-700 transition font-semibold"
        >
          I'm a Captain
        </Link>

        <p className='text-center text-gray-600 mt-6 text-xs sm:text-sm'>
          By proceeding, you agree to our <span className='text-blue-600 cursor-pointer'>Terms & Conditions</span>
        </p>

      </div>
    </div>
  )
}

export default Start
