const http= require('http')
const app = require('./app')
const { Server } = require('socket.io')
const port = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:3000"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO event handlers
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle ride request from user
    socket.on('user:request-ride', (rideData) => {
        console.log('User requested ride:', rideData);
        // Broadcast to all captains
        io.emit('ride:new-request', rideData);
    });

    // Handle captain going online
    socket.on('captain:online', (captainData) => {
        console.log('Captain online:', captainData);
        socket.join('captains-room');
    });

    // Handle captain accepting ride
    socket.on('captain:accept-ride', (data) => {
        console.log('Captain accepted ride:', data);
        // Send to specific user
        io.emit('ride:accepted', data);
    });

    // Handle ride completion
    socket.on('ride:completed', (data) => {
        console.log('Ride completed:', data);
        io.emit('ride:completed-status', data);
    });

    // Handle location update
    socket.on('captain:location-update', (location) => {
        console.log('Captain location update:', location);
        io.emit('location:updated', location);
    });

    // Handle user rating
    socket.on('user:rate-ride', (ratingData) => {
        console.log('User rated ride:', ratingData);
        io.emit('ride:rated', ratingData);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    console.log(`Socket.IO server ready on http://localhost:${port}`);
})
