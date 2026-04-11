import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const Captainlogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    const captainData = {
      email,
      password
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captainData
      )

      if (response.status === 200) {
        const data = response.data

        setCaptain(data.captain)
        localStorage.setItem('captainToken', data.token)

        navigate('/captain-home')
      }

    } catch (error) {
      console.log(error)
      alert('Login failed ❌')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-6 min-h-screen flex flex-col justify-between bg-gray-100'>

      <div className='max-w-md mx-auto w-full bg-white p-6 rounded-xl shadow-lg'>

        <img
          className="w-20 mb-6 mx-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber logo"
        />

        <form onSubmit={submitHandler}>

          <h3 className='text-lg font-semibold mb-2'>Captain Email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input mb-4'
            type="email"
            placeholder='email@gmail.com'
          />

          <h3 className='text-lg font-semibold mb-2'>Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input mb-6'
            type="password"
            placeholder='password'
          />

          <button type='submit' className='bg-black text-white font-semibold rounded px-4 py-2 w-full'>
            Login as Captain
          </button>

        </form>

        <p className='text-center mt-4'>
          Join as Captain?{' '}
          <Link to='/captain-signup' className='text-blue-600'>
            Register
          </Link>
        </p>

      </div>

      <div className='max-w-md mx-auto w-full'>
        <Link
          to='/login'
          className='bg-[#ee2409] flex items-center justify-center text-white font-semibold rounded px-4 py-2 w-full'>
          Sign in as User
        </Link>
      </div>

    </div>
  )
}

export default Captainlogin