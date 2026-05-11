import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [userData, setUserData] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  
  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // ✅ Validation checks
    if (firstName.length < 3) {
      setError('First name must be at least 3 characters long')
      setLoading(false)
      return
    }
    if (lastName.length < 3) {
      setError('Last name must be at least 3 characters long')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email: email,
        password: password
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || err.message || 'Signup failed'
      setError(errorMessage)
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }

    setemail('')
    setpassword('')
    setfirstName('')
    setlastName('')
  }

      

  return (
    <div className='p-6 min-h-screen flex flex-col justify-between bg-gray-100'>

      <div className='max-w-md mx-auto w-full bg-white p-6 rounded-xl shadow-lg'>

        <img
          className="w-20 mb-5 mx-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="uber logo"
        />

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
            {error}
          </div>
        )}

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>

          <h3 className='text-lg font-semibold mb-3'>User Name</h3>
          <div className='flex gap-2 mb-4'>
            <input
              required
              className='input'
              type="text"
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
            />

            <input
              required
              className='input'
              type="text"
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
            />
          </div>

          <h3 className='text-lg font-semibold mb-2'>Email</h3>
          <input
            required
            className='input mb-4'
            type="email"
            placeholder='email@gmail.com'
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />

          <h3 className='text-lg font-semibold mb-2'>Password</h3>
          <input
            required
            className='input mb-4'
            type="password"
            placeholder='password'
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />

          <button type='submit' disabled={loading} className='bg-black text-white font-semibold rounded px-4 py-2 w-full disabled:bg-gray-400 disabled:cursor-not-allowed'>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

        </form>

        <p className='text-center mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600'>
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

export default UserSignup
