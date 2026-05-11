import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                navigate('/login')
            }
        }).catch((error) => {
            console.log(error)
            localStorage.removeItem('token')
            navigate('/login')
        })
    }, [token, navigate])

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <p>Logging out...</p>
        </div>
    )
}

export default UserLogout