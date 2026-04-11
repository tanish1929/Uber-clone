import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainLogout from './pages/CaptainLogout'
import UserContext from './context/UserContext'
import CaptainContext from './context/CaptainContext'
import CaptainHome from './pages/CaptainHome'
import UserProfile from './pages/UserProfile'
import CaptainProfile from './pages/CaptainProfile'
import UserRideHistory from './pages/UserRideHistory'
import CaptainRideHistory from './pages/CaptainRideHistory'



const App = () => {
  return (
    <UserContext>
      <CaptainContext>
        <div>
          <Routes>
            <Route path='/' element={<Start />} />
            <Route path='/login' element={<UserLogin />} />
            <Route path='/signup' element={<UserSignup />} />
            <Route path='/captain-login' element={<CaptainLogin/>} />
            <Route path='/captain-signup' element={<CaptainSignup/>} />
            <Route path='/home' element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            } />
            <Route path='/user/logout' element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            } />

            <Route path='/captain-home' element={
              <CaptainProtectWrapper>
                <CaptainHome />
              </CaptainProtectWrapper>
            } />

            <Route path='/captain/logout' element={
              <CaptainProtectWrapper>
                <CaptainLogout />
              </CaptainProtectWrapper>
            } />

            <Route path='/user/profile' element={
              <UserProtectWrapper>
                <UserProfile />
              </UserProtectWrapper>
            } />

            <Route path='/captain/profile' element={
              <CaptainProtectWrapper>
                <CaptainProfile />
              </CaptainProtectWrapper>
            } />

            <Route path='/user/rides' element={
              <UserProtectWrapper>
                <UserRideHistory />
              </UserProtectWrapper>
            } />

            <Route path='/captain/rides' element={
              <CaptainProtectWrapper>
                <CaptainRideHistory />
              </CaptainProtectWrapper>
            } />
          </Routes>
        </div>
      </CaptainContext>
    </UserContext>
  )
}

export default App;