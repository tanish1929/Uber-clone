# 🚀 Uber Clone - Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Step 1: Install Dependencies

```bash
# Frontend
cd frontend    npm run dev


# Backend (if available)
cd backend   npx nodemon

```

### Step 2: Environment Configuration

Create a `.env.local` file in the frontend directory:

```env
VITE_BASE_URL=http://localhost:3000
```

### Step 3: Start the Application

```bash
# Terminal 1 - Frontend (from frontend directory)
npm run dev

# Terminal 2 - Backend (from backend directory) 
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 📝 Testing the App

### Rider Flow
1. Navigate to `http://localhost:5173`
2. Click "I'm a Rider"
3. Click "Sign up here"
4. Fill in registration details
5. Login with your credentials
6. Try booking a ride:
   - Enter pickup location (e.g., "Gateway of India")
   - Enter dropoff location (e.g., "BKC")
   - Select a ride type
   - Click "Confirm Ride"
7. Click "Profile" to view/edit your details
8. Click "My Rides" to see ride history and rate drivers
9. Click "Logout" to exit

### Captain Flow
1. Navigate to `http://localhost:5173`
2. Click "I'm a Captain"
3. Fill in registration details including:
   - Name, Email, Phone
   - Vehicle Type, Color, Plate, Capacity
4. Login with your credentials
5. Click "Go Online" to receive ride requests
6. Accept or skip incoming ride requests
7. Click "Profile" to manage vehicle details
8. Click "My Earnings" to view earnings history
9. Click "Logout" to exit

---

## 🗂️ Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── pages/              # All page components
│   │   ├── components/         # Reusable components (Header)
│   │   ├── context/            # React Context (UserContext, CaptainContext)
│   │   ├── App.jsx             # Main router
│   │   ├── App.css
│   │   ├── index.css           # Tailwind styles
│   │   └── main.jsx
│   ├── dist/                   # Production build
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
├── backend/                    # Node.js/Express API
│   ├── controllers/            # Route handlers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── middlewares/            # Auth middleware
│   ├── db/                     # Database connection
│   ├── app.js
│   ├── server.js
│   └── package.json
└── FEATURES_COMPLETE.md        # Complete features list
```

---

## 🔐 Authentication Details

### Token Storage
- **Riders**: Token stored in `localStorage.token`
- **Captains**: Token stored in `localStorage.captainToken`

### Login Behavior
- Tokens are automatically included in API requests
- Authorization header: `Authorization: Bearer {token}`
- Invalid tokens redirect to appropriate login page

### Protected Routes
- `/home` - Rider dashboard (requires rider token)
- `/captain-home` - Captain dashboard (requires captain token)
- `/user/profile` - Rider profile (requires rider token)
- `/captain/profile` - Captain profile (requires captain token)
- `/user/rides` - Rider history (requires rider token)
- `/captain/rides` - Captain earnings (requires captain token)

---

## 🎨 UI Features

### Rider Pages
- **Start.jsx** - Landing page with role selection
- **UserLogin.jsx** - Login form
- **UserSignup.jsx** - Registration form
- **Home.jsx** - Ride booking interface
- **UserProfile.jsx** - Profile management
- **UserRideHistory.jsx** - Trip history and ratings
- **UserLogout.jsx** - Logout confirmation

### Captain Pages
- **CaptainLogin.jsx** - Captain login
- **CaptainSignup.jsx** - Captain registration with vehicle
- **CaptainHome.jsx** - Dashboard with ride requests
- **CaptainProfile.jsx** - Profile and vehicle management
- **CaptainRideHistory.jsx** - Earnings and trip history
- **CaptainLogout.jsx** - Logout confirmation

### Shared Components
- **Header.jsx** - Navigation header (role-based)
- **ProtectWrapper.jsx** - Route protection (Rider & Captain versions)

---

## 📱 Features by Page

### 🏠 Home (Rider)
- Pickup/Dropoff location inputs
- Ride type selection (UberX, UberPlus, UberXL)
- Dynamic pricing display
- Ride request with loading animation
- Cancel ride option

### 🚗 CaptainHome
- Online/Offline status toggle
- Real-time ride request notifications
- Accept/Skip ride decisions
- Earnings dashboard
- Vehicle details display
- Edit vehicle information

### 👤 User Profile
- View personal information
- Edit profile details
- Payment methods management
- Notification preferences
- Account settings
- Link to ride history

### 🚕 Captain Profile
- View/Edit personal information
- Vehicle information management
- Earnings statistics
- Document verification status
- Settings and preferences
- Link to earnings history

### 📋 Ride History (Rider)
- List of all past rides
- Filter by status
- Expand for detailed information
- Driver ratings and info
- Rate rides (1-5 stars)
- Optional reviews and tips
- Download receipt

### 💰 Earnings History (Captain)
- Daily/Weekly earnings
- Total earnings display
- Acceptance rate
- Expand rides for details
- Passenger information
- Route visualization
- Download invoice
- Report issue option

---

## 🧪 Mock Data

The app uses mock data for demonstration:
- Ride requests appear after 2 seconds of going online (Captain)
- User profile data is fetched from context
- Ride history shows fixed 6 sample rides
- Earnings are calculated from mock rides

Replace with real API calls when backend is ready.

---

## 🔧 Customization

### Changing Colors
Edit `tailwind.config.js` and `src/index.css`:
```css
/* Primary colors */
bg-black → your-color
text-white → your-text-color
```

### Modifying Ride Types
Edit the ride type array in `Home.jsx`:
```javascript
const rideTypes = [
  { name: 'UberX', price: '₹12/km', ... }
  // Add more types here
]
```

### Updating Vehicle Types
Edit the select options in `CaptainSignup.jsx` and `CaptainProfile.jsx`

---

## ⚠️ Common Issues & Solutions

### Issue: "Cannot find module 'Header'"
**Solution**: Ensure `components` folder exists in `src/`

### Issue: "Token not found" error
**Solution**: Make sure you're logged in and tokens are stored in localStorage

### Issue: Styles not loading
**Solution**: Run `npm run dev` again or clear browser cache

### Issue: API endpoints not responding
**Solution**: Ensure backend is running on `http://localhost:3000`

---

## 📚 API Expected Endpoints

### User Endpoints
- `POST /users/register` - Register new rider
- `POST /users/login` - Login rider
- `GET /users/profile` - Get rider profile
- `PUT /users/profile` - Update rider profile
- `GET /users/logout` - Logout rider

### Captain Endpoints
- `POST /captains/register` - Register new captain
- `POST /captains/login` - Login captain
- `GET /captains/profile` - Get captain profile
- `PUT /captains/profile` - Update captain profile
- `GET /captains/logout` - Logout captain

---

## 🚀 Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

Output: `dist/` folder ready for deployment

### Deploy Options
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- Any static hosting

### Deployment Steps (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📞 Support

For issues or questions:
1. Check FEATURES_COMPLETE.md for feature details
2. Review console errors in browser DevTools
3. Verify backend is running and accessible
4. Check .env configuration

---

## 📝 Development Notes

- App uses Vite for fast development
- React Context API for state management
- Tailwind CSS for styling
- Axios for HTTP requests
- React Router v6 for navigation

### Adding New Features
1. Create component in `src/pages/` or `src/components/`
2. Add route in `App.jsx` if it's a page
3. Import context if needed
4. Use Header component for consistency
5. Test on both mobile and desktop

---

**Happy Coding! 🎉**

Last Updated: January 2024
Version: 1.0.0 (Feature Complete)
