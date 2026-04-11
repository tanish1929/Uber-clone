# Socket.IO Real-Time Implementation Guide

## Overview
This document outlines the Socket.IO integration for real-time ride request and acceptance synchronization in the Uber clone application.

## Architecture

### Backend Setup
- **Framework**: Express.js with Socket.IO
- **Server Port**: 4000
- **CORS Configuration**: Enabled for frontend URL (http://localhost:5173 or http://localhost:5174)

### Socket.IO Events

#### User Events
```javascript
// User requests a ride
socket.on('user:request-ride', (rideData) => {
  // Broadcast to all captains
  io.emit('ride:new-request', rideData)
})

// User rates a ride
socket.on('user:rate-ride', (ratingData) => {
  io.emit('ride:rated', ratingData)
})
```

#### Captain Events
```javascript
// Captain goes online
socket.on('captain:online', (captainData) => {
  socket.join('captains-room')
})

// Captain accepts a ride
socket.on('captain:accept-ride', (data) => {
  io.emit('ride:accepted', data)
})

// Captain updates location
socket.on('captain:location-update', (location) => {
  io.emit('location:updated', location)
})
```

#### Ride Events
```javascript
// Ride completion
socket.on('ride:completed', (data) => {
  io.emit('ride:completed-status', data)
})
```

## Frontend Implementation

### Socket Service (`src/services/socket.js`)

Provides utility functions for Socket.IO operations:

**Initialization Functions**:
- `initializeSocket()` - Initialize connection to Socket.IO server
- `getSocket()` - Get existing socket or create new one
- `disconnectSocket()` - Disconnect from server

**Emit Functions**:
- `emitUserRideRequest(rideData)` - User requests a ride
- `emitCaptainOnline(captainData)` - Captain goes online
- `emitCaptainAcceptRide(data)` - Captain accepts a ride
- `emitRideCompleted(data)` - Mark ride as complete
- `emitCaptainLocationUpdate(location)` - Update captain location
- `emitUserRateRide(ratingData)` - User rates the ride

**Listener Functions**:
- `onNewRideRequest(callback)` - Listen for new ride requests
- `onRideAccepted(callback)` - Listen for ride acceptance
- `onRideCompleted(callback)` - Listen for ride completion
- `onLocationUpdate(callback)` - Listen for location updates
- `onRideRated(callback)` - Listen for ride ratings

### Context Updates

#### UserContext Updates
```javascript
// New states added
const [acceptedRide, setAcceptedRide] = useState(null)
const [rideStatus, setRideStatus] = useState('idle') // idle, searching, accepted, completed
const [completedRide, setCompletedRide] = useState(null)
const [rideError, setRideError] = useState(null)

// Socket listeners set up in useEffect
useEffect(() => {
  const socket = getSocket()
  
  onRideAccepted((rideData) => {
    setAcceptedRide(rideData)
    setRideStatus('accepted')
  })

  onRideCompleted((rideData) => {
    setCompletedRide(rideData)
    setRideStatus('completed')
  })
}, [])
```

#### CaptainContext Updates
```javascript
// New states added
const [availableRides, setAvailableRides] = useState([])
const [isOnline, setIsOnline] = useState(false)

// Socket listeners set up in useEffect
useEffect(() => {
  const socket = getSocket()
  
  onNewRideRequest((rideData) => {
    setAvailableRides(prevRides => {
      const exists = prevRides.some(ride => ride.id === rideData.id)
      if (exists) return prevRides
      return [rideData, ...prevRides]
    })
  })
}, [])
```

## Component Updates

### Home.jsx (User Page)
**Changes**:
- Removed localStorage polling
- Added Socket.IO event emissions
- Three states: searching, accepted, completed
- Real-time updates from Socket.IO listeners

**Flow**:
1. User enters pickup/dropoff location
2. `emitUserRideRequest()` broadcasts request to captains
3. Listens for `ride:accepted` event
4. Displays captain details when ride is accepted
5. Listens for `ride:completed` event
6. Shows trip summary and rating screen

### CaptainHome.jsx (Captain Page)
**Changes**:
- Replaced localStorage ride management with Socket.IO
- Added `emitCaptainOnline()` when going online
- `emitCaptainAcceptRide()` when accepting rides
- `emitRideCompleted()` when finishing rides

**Flow**:
1. Captain clicks "Go Online" → `emitCaptainOnline()`
2. Receives `ride:new-request` events in real-time
3. Clicks "Accept Ride" → `emitCaptainAcceptRide()` with captain details
4. Completes ride → `emitRideCompleted()`
5. User sees real-time updates without polling

## Connection Configuration

The frontend connects to Socket.IO using:
```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

socket = io(BACKEND_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
})
```

**Features**:
- Automatic reconnection on disconnect
- Exponential backoff for reconnection delays
- Maximum 5 reconnection attempts
- Automatic connection on mount

## Real-Time Data Flow

### User to Captain Flow
```
User: Request Ride
    ↓
emit('user:request-ride')
    ↓
Backend: io.emit('ride:new-request')
    ↓
Captain: Receives availableRides list
    ↓
Captain: Accepts ride
    ↓
emit('captain:accept-ride')
    ↓
Backend: io.emit('ride:accepted')
    ↓
User: Receives captain details in real-time
    ↓
Display driver card with price, vehicle info, rating
```

### Ride Completion Flow
```
Captain: Complete Ride
    ↓
emit('ride:completed')
    ↓
Backend: io.emit('ride:completed-status')
    ↓
User: Receives completion notification
    ↓
Display trip summary, pricing, and rating screen
```

## Environment Setup

### Backend (.env)
```
PORT=4000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:4000
```

## Testing Socket.IO

### Test Case 1: Real-Time Ride Request
1. Open user page (http://localhost:5174/home)
2. Open captain page (http://localhost:5174/captain-home) in another tab
3. User: Book a ride with locations
4. Captain: Should see the ride in available requests list in real-time
5. Captain: Click "Accept"
6. User: Should see captain details card within 1 second

### Test Case 2: Ride Completion
1. Captain accepts a ride
2. User sees captain details
3. Captain: Click "Complete Ride"
4. User: Should see trip summary and rating screen
5. Verify pricing breakdown displays correctly

### Test Case 3: Connection Recovery
1. Close backend server while connection is active
2. Open backend server again
3. Socket should automatically reconnect
4. New ride requests should work normally

## Advantages Over localStorage Polling

| Feature | localStorage | Socket.IO |
|---------|--------------|-----------|
| Real-time Updates | 1s polling delay | Instant |
| Server Load | High (constant polling) | Low (event-based) |
| Network Efficiency | Inefficient | Efficient |
| Scalability | Limited | Highly Scalable |
| Bidirectional Comm | Not native | Native support |
| Connection Status | Not tracked | Tracked automatically |

## Future Enhancements

1. **Rooms**: Implement Socket.IO rooms for targeted notifications
   - Captains in specific zones
   - Users waiting for specific driver

2. **Location Tracking**: 
   - Real-time captain location updates
   - Live map tracking
   - ETA calculation

3. **Presence**: 
   - Online/offline status
   - User activity tracking
   - Driver availability zones

4. **Message Queue**:
   - Redis for message persistence
   - Fallback mechanism for offline users
   - Message retry logic

5. **Authentication**:
   - JWT validation for Socket.IO connections
   - User/Captain identification
   - Secure namespace separation

## Troubleshooting

### Connection Issues
```javascript
// Enable debug logging
localStorage.debug = '*'

// Check connection status
const socket = getSocket()
console.log('Connected:', socket.connected)
console.log('Socket ID:', socket.id)
```

### Event Not Fired
- Verify backend is running on correct port
- Check CORS configuration in server.js
- Verify event names match exactly (case-sensitive)
- Check browser console for Socket.IO errors

### Rapid Reconnections
- May indicate server crashes
- Check backend logs for errors
- Increase `reconnectionDelayMax` if needed

## References
- [Socket.IO Documentation](https://socket.io/docs/)
- [Socket.IO Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO Server API](https://socket.io/docs/v4/server-api/)
