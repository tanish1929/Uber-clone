import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'


const UserLogin = () => {
  // ✅ useState is a React Hook that lets you store and update data in a component.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setuserData] = useState({})

const { user, setUser } = useContext(UserDataContext)
const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    // ✅ Here you would typically handle the login logic, such as sending a request to your backend API.
    const userData = {
      email:email,
      password:password
    }

    const response =await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData)
    if(response.status === 200){
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token',data.token)
      navigate('/home')
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

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>

          <h3 className='text-lg font-semibold mb-2'>User Email</h3>
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
            Login as User
          </button>

        </form>

        <p className='text-center mt-4'>
          New Here?{' '}
          <Link to='/signup' className='text-blue-600'>
            Create new Account
          </Link>
        </p>

      </div>

      <div className='max-w-md mx-auto w-full'>
        <Link
          to='/captain-login'
          className='bg-[#ee2409] flex items-center justify-center text-white font-semibold rounded px-4 py-2 w-full'>
          Sign in as Captain
        </Link>
      </div>

    </div>
  )
}

export default UserLogin;