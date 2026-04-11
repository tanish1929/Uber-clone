import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const Captainsignup = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [vehicleColor, setVehicleColor] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')
  const [vehicleType, setVehicleType] = useState('')

  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      )

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('captainToken', data.token)
        navigate('/captain-home')
      }

    } catch (error) {
      console.log(error)
      alert('Signup failed ❌')
    }

    // reset
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }

  return (
    <div className='p-6 min-h-screen flex flex-col justify-between bg-gray-100'>

      <div className='max-w-md mx-auto w-full bg-white p-6 rounded-xl shadow-lg'>

        <img
          className="w-20 mb-5 mx-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber logo"
        />

        <form onSubmit={submitHandler}>

          <h3 className='text-lg font-semibold mb-3'>Captain Name</h3>
          <div className='flex gap-2 mb-4'>
            <input
              required
              className='input'
              type="text"
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              required
              className='input'
              type="text"
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className='text-lg font-semibold mb-2'>Email</h3>
          <input
            required
            className='input mb-4'
            type="email"
            placeholder='email@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className='text-lg font-semibold mb-2'>Password</h3>
          <input
            required
            className='input mb-4'
            type="password"
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 🚗 VEHICLE DETAILS */}
          <h3 className='text-lg font-semibold mb-2'>Vehicle Details</h3>
          <div className='flex gap-2 mb-4'>
            <input
              required
              type="text"
              className='input mb-3'
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />

            <input
              required
              type="text"
              className='input mb-3'
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>

          <div className='flex gap-2 mb-4'>
            <input
              required
              type="text"
              className='input mb-3'
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />

            <select
              required
              className='input mb-4'
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <button type='submit' className='bg-black text-white font-semibold rounded px-4 py-2 w-full'>
            Sign Up As Captain
          </button>

        </form>

        <p className='text-center mt-4'>
          Already have an account?{' '}
          <Link to='/captain-login' className='text-blue-600'>
            Login here
          </Link>
        </p>

      </div>

      <p className='text-xs text-center mt-5 px-4'>
        By proceeding, you agree to our Terms & Privacy Policy.
      </p>

    </div>
  )
}

export default Captainsignup