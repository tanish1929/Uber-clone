# User Registration Endpoint Documentation

## Overview
This document provides detailed information about the `/users/register` endpoint used for user registration in the Uber Clone application.

---

## Endpoint: POST /users/register

### Description
The `/users/register` endpoint allows new users to create an account by providing their personal information and credentials. Upon successful registration, the endpoint returns the created user object and a JWT authentication token for immediate login.

---

## Request Details

### Method
```
POST
```

### URL
```
http://localhost:<PORT>/users/register
```

### Headers
```
Content-Type: application/json
```

### Request Body
The request body must contain the following fields in JSON format:

```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string"
}
```

#### Field Requirements:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|-----------|
| `firstname` | String | Yes | User's first name | Must not be empty |
| `lastname` | String | No | User's last name | - |
| `email` | String | Yes | User's email address | Must be a valid email format and unique in database |
| `password` | String | Yes | User's password | Must not be empty; recommended minimum length of 6 characters |

### Example Request

```bash
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

---

## Response Details

### Success Response

#### Status Code: `201 Created`

Response body on successful registration:

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "createdAt": "2026-03-27T14:26:32.843Z",
    "updatedAt": "2026-03-27T14:26:32.843Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Error Responses

#### Status Code: `400 Bad Request`

Returned when validation fails or required fields are missing.

**Example Response:**
```json
{
  "errors": [
    {
      "msg": "All fields are required",
      "param": "firstname",
      "location": "body"
    }
  ]
}
```

**Common scenarios:**
- Missing required fields (firstname, email, password)
- Invalid email format
- Empty password field

---

#### Status Code: `400 Bad Request` - Duplicate Email

Returned when the email address already exists in the database.

**Example Response:**
```json
{
  "message": "Email already registered",
  "error": "Email already in use"
}
```

---

#### Status Code: `500 Internal Server Error`

Returned when an unexpected server error occurs during registration.

**Example Response:**
```json
{
  "message": "Internal server error",
  "error": "Error message details"
}
```

---

## Request/Response Flow

1. **Client sends** POST request with user data
2. **Server validates** all required fields
3. **Server hashes** the password for security
4. **Server creates** user in database
5. **Server generates** JWT authentication token
6. **Server responds** with user data and token

---

## Data Storage

The registered user data is stored in the database with the following structure:

```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String,
    lastname: String
  },
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Notes

- **Passwords** are hashed before storage using bcrypt or similar algorithm
- **JWT Token** provided in response should be used for subsequent authenticated requests
- **Email** must be unique to prevent duplicate accounts
- **HTTPS** should be used in production for secure transmission

---

## Example Usage

### JavaScript/Fetch
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (response.status === 201) {
      const data = await response.json();
      console.log('User registered successfully:', data.user);
      console.log('Auth token:', data.token);
      return data;
    } else {
      console.error('Registration failed:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
registerUser({
  firstname: 'Jane',
  lastname: 'Smith',
  email: 'jane.smith@example.com',
  password: 'mySecurePass123'
});
```

---

## Status Code Summary

| Status Code | Description |
|------------|-------------|
| `201` | User successfully registered |
| `400` | Bad request - validation error or missing fields |
| `500` | Internal server error |

---

## Notes

- The `lastname` field is optional but recommended for complete user profiles
- The JWT token should be stored securely on the client side (localStorage, sessionStorage, or cookies)
- Consider implementing rate limiting to prevent brute force registration attempts
- Email validation should be performed to ensure valid email addresses

---

---

# User Login Endpoint Documentation

## Endpoint: POST /users/login

### Description
The `/users/login` endpoint allows registered users to authenticate by providing their email and password credentials. Upon successful authentication, the endpoint returns the user object and a JWT authentication token that can be used for subsequent authenticated requests.

---

## Request Details

### Method
```
POST
```

### URL
```
http://localhost:<PORT>/users/login
```

### Headers
```
Content-Type: application/json
```

### Request Body
The request body must contain the following fields in JSON format:

```json
{
  "email": "string",
  "password": "string"
}
```

#### Field Requirements:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|-----------|
| `email` | String | Yes | User's registered email address | Must be a valid email format and exist in database |
| `password` | String | Yes | User's password | Must not be empty; minimum length of 6 characters |

### Example Request

```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

---

## Response Details

### Success Response

#### Status Code: `200 OK`

Response body on successful login:

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "createdAt": "2026-03-27T14:26:32.843Z",
    "updatedAt": "2026-03-27T14:26:32.843Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Error Responses

#### Status Code: `400 Bad Request`

Returned when validation fails or required fields are missing.

**Example Response:**
```json
{
  "errors": [
    {
      "msg": "Please enter a valid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Common scenarios:**
- Missing required fields (email, password)
- Invalid email format
- Empty password field

---

#### Status Code: `401 Unauthorized` - Invalid Credentials

Returned when the email or password is incorrect, or the email does not exist in the database.

**Example Response:**
```json
{
  "error": "Invalid email or password"
}
```

**Scenarios:**
- Email address not found in database
- Password does not match the registered user's password

---

#### Status Code: `500 Internal Server Error`

Returned when an unexpected server error occurs during login.

**Example Response:**
```json
{
  "message": "Internal server error",
  "error": "Error message details"
}
```

---

## Request/Response Flow

1. **Client sends** POST request with email and password
2. **Server validates** all required fields
3. **Server queries** database for user with provided email
4. **Server compares** provided password with stored hashed password
5. **Server generates** JWT authentication token on successful match
6. **Server responds** with user data and token, or error message

---

## Security Notes

- **Password Comparison**: Passwords are compared using secure hashing algorithms (e.g., bcrypt) to prevent direct exposure
- **JWT Token**: Provided token should be used in Authorization header for subsequent requests (`Authorization: Bearer <token>`)
- **Generic Error Messages**: Server returns generic "Invalid email or password" messages to prevent user enumeration attacks
- **HTTPS**: Should be used in production for secure credential transmission
- **Rate Limiting**: Should be implemented to prevent brute force attacks
- **Session Management**: Token should be securely stored on client side and cleared on logout

---

## Example Usage

### JavaScript/Fetch
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('User logged in successfully:', data.user);
      console.log('Auth token:', data.token);
      
      // Store token for future requests
      localStorage.setItem('authToken', data.token);
      
      return data;
    } else if (response.status === 401) {
      console.error('Invalid email or password');
    } else {
      console.error('Login failed:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
loginUser({
  email: 'john.doe@example.com',
  password: 'securePassword123'
});
```

### Using Auth Token in Subsequent Requests
```javascript
const fetchUserProfile = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:5000/users/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
};
```

---

## Comparison: Login vs Register

| Aspect | Register | Login |
|--------|----------|-------|
| **Endpoint** | POST /users/register | POST /users/login |
| **Status Code** | 201 Created | 200 OK |
| **Required Fields** | firstname, email, password | email, password |
| **Purpose** | Create new user account | Authenticate existing user |
| **Password Handling** | Hashed and stored | Hashed and compared |
| **User Existence** | Must not exist | Must exist |

---

## Status Code Summary - All Endpoints

| Status Code | Description |
|------------|-------------|
| `200` | User successfully logged in |
| `201` | User successfully registered |
| `400` | Bad request - validation error or missing fields |
| `401` | Unauthorized - invalid credentials |
| `500` | Internal server error |

---

## General Notes

- Always use HTTPS in production to protect user credentials
- JWT tokens have expiration times and should be refreshed periodically
- Implement logout functionality to clear stored tokens on client side
- Consider implementing "Remember Me" functionality for improved UX
- Monitor and log login attempts for security auditing purposes

---

---

# User Profile Endpoint Documentation

## Endpoint: GET /users/profile

### Description
The `/users/profile` endpoint retrieves the profile information of the currently authenticated user. This endpoint requires a valid JWT token in the Authorization header and returns the authenticated user's complete profile data.

---

## Request Details

### Method
```
GET
```

### URL
```
http://localhost:<PORT>/users/profile
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

#### Required Headers:

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `Authorization` | Yes | Bearer token obtained from login/register endpoint (format: `Bearer <token>`) |

### Authentication
- **Required**: Yes
- **Method**: JWT Token (Bearer token in Authorization header)
- **Token Source**: Obtained from `/users/login` or `/users/register` endpoints

### Request Body
No request body is required for this endpoint.

### Example Request

```bash
curl -X GET http://localhost:5000/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Response Details

### Success Response

#### Status Code: `200 OK`

Response body on successful profile retrieval:

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "createdAt": "2026-03-27T14:26:32.843Z",
    "updatedAt": "2026-03-27T14:26:32.843Z"
  }
}
```

---

### Error Responses

#### Status Code: `401 Unauthorized` - Missing or Invalid Token

Returned when no token is provided or the token is invalid/expired.

**Example Response:**
```json
{
  "error": "Unauthorized - No token provided"
}
```

or

```json
{
  "error": "Unauthorized - Invalid or expired token"
}
```

**Scenarios:**
- Authorization header not provided
- Token is malformed
- Token has expired
- Token signature is invalid

---

#### Status Code: `403 Forbidden` - Insufficient Permissions

Returned when the user does not have permission to access this resource.

**Example Response:**
```json
{
  "error": "Access denied"
}
```

---

#### Status Code: `500 Internal Server Error`

Returned when an unexpected server error occurs while retrieving the profile.

**Example Response:**
```json
{
  "message": "Internal server error",
  "error": "Error message details"
}
```

---

## Request/Response Flow

1. **Client sends** GET request with valid Authorization header
2. **Server verifies** JWT token validity
3. **Server extracts** user ID from token
4. **Server retrieves** user data from database
5. **Server responds** with user profile data

---

## Security Notes

- **Token Required**: This is a protected endpoint that requires valid JWT authentication
- **Token Validation**: Server validates token signature and expiration before responding
- **User Data**: Returns only the authenticated user's data, preventing unauthorized access to other users' profiles
- **Token Storage**: Keep JWT tokens secure (use httpOnly cookies or secure localStorage)
- **Token Expiration**: Implement token refresh mechanism for long-lived sessions

---

## Example Usage

### JavaScript/Fetch
```javascript
const getUserProfile = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('No authentication token found');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/users/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('User profile:', data.user);
      return data.user;
    } else if (response.status === 401) {
      console.error('Session expired or invalid token');
      // Redirect to login
    } else {
      console.error('Failed to retrieve profile:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
getUserProfile();
```

### Axios Example
```javascript
import axios from 'axios';

const getUserProfile = async () => {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await axios.get('http://localhost:5000/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('User profile:', response.data.user);
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Unauthorized - Please login again');
    }
    console.error('Error:', error.message);
  }
};
```

---

# User Logout Endpoint Documentation

## Endpoint: GET /users/logout

### Description
The `/users/logout` endpoint logs out the currently authenticated user by invalidating their JWT token. This endpoint clears the authentication cookie and blacklists the token to prevent further use. After logout, the user must login again to access protected resources.

---

## Request Details

### Method
```
GET
```

### URL
```
http://localhost:<PORT>/users/logout
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

#### Required Headers:

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `Authorization` | Yes | Bearer token obtained from login/register endpoint (format: `Bearer <token>`) |

### Authentication
- **Required**: Yes
- **Method**: JWT Token (Bearer token in Authorization header)
- **Token Source**: Obtained from `/users/login` or `/users/register` endpoints

### Request Body
No request body is required for this endpoint.

### Example Request

```bash
curl -X GET http://localhost:5000/users/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Response Details

### Success Response

#### Status Code: `200 OK`

Response body on successful logout:

```json
{
  "message": "Logged out successfully"
}
```

---

### Error Responses

#### Status Code: `401 Unauthorized` - Missing or Invalid Token

Returned when no token is provided or the token is invalid/expired.

**Example Response:**
```json
{
  "error": "Unauthorized - No token provided"
}
```

or

```json
{
  "error": "Unauthorized - Invalid or expired token"
}
```

**Scenarios:**
- Authorization header not provided
- Token is malformed
- Token has already been blacklisted
- Token signature is invalid

---

#### Status Code: `403 Forbidden` - Insufficient Permissions

Returned when the user does not have permission to logout.

**Example Response:**
```json
{
  "error": "Access denied"
}
```

---

#### Status Code: `500 Internal Server Error`

Returned when an unexpected server error occurs during logout.

**Example Response:**
```json
{
  "message": "Internal server error",
  "error": "Error message details"
}
```

---

## Request/Response Flow

1. **Client sends** GET request with valid Authorization header
2. **Server verifies** JWT token validity
3. **Server clears** authentication cookie
4. **Server blacklists** the token to prevent reuse
5. **Server responds** with success message

---

## Logout Process Details

The logout process involves:
1. **Cookie Clearing**: HTTP cookie containing token is cleared from client
2. **Token Blacklisting**: Token is added to a blacklist collection in the database
3. **Token Invalidation**: Token becomes unusable for future requests
4. **Session Termination**: User session is effectively terminated

---

## Security Notes

- **Token Blacklisting**: Tokens are blacklisted immediately to prevent their reuse
- **Cookie Clearing**: Authentication cookies are cleared to remove stored tokens
- **Immediate Invalidation**: Token becomes invalid immediately upon logout
- **Database Cleanup**: Blacklisted tokens should be periodically cleaned from database based on expiration time
- **Client-Side Cleanup**: Client should remove stored tokens from localStorage/sessionStorage after logout

---

## Example Usage

### JavaScript/Fetch
```javascript
const logoutUser = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('No authentication token found');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/users/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      const data = await response.json();
      console.log(data.message);
      
      // Clear token from client storage
      localStorage.removeItem('authToken');
      
      // Redirect to login page
      window.location.href = '/login';
    } else if (response.status === 401) {
      console.error('Session expired or invalid token');
    } else {
      console.error('Logout failed:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
logoutUser();
```

### Axios Example
```javascript
import axios from 'axios';

const logoutUser = async () => {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await axios.get('http://localhost:5000/users/logout', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(response.data.message);
    
    // Clear client-side storage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Unauthorized - Session may have expired');
    }
    console.error('Error:', error.message);
  }
};
```

---

## Complete Authentication Flow Example

```javascript
// Step 1: Register/Login and store token
const registerOrLogin = async (credentials) => {
  const endpoint = isNewUser ? '/users/register' : '/users/login';
  const response = await fetch(`http://localhost:5000${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  return data.user;
};

// Step 2: Access protected resources
const accessProtectedResource = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Step 3: Logout and clean up
const logout = async () => {
  const token = localStorage.getItem('authToken');
  await fetch('http://localhost:5000/users/logout', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // Clear all stored data
  localStorage.removeItem('authToken');
  // Redirect to login
  window.location.href = '/login';
};
```

---

## Updated Endpoint Summary Table

| Endpoint | Method | Auth Required | Purpose | Status Code |
|----------|--------|---------------|---------|-------------|
| `/users/register` | POST | No | Create new user account | 201, 400, 500 |
| `/users/login` | POST | No | Authenticate user | 200, 400, 401, 500 |
| `/users/profile` | GET | Yes | Get user profile | 200, 401, 403, 500 |
| `/users/logout` | GET | Yes | Logout user and invalidate token | 200, 401, 403, 500 |

---

## Important Notes

- **Protected Endpoints**: `/users/profile` and `/users/logout` require valid JWT authentication
- **Token Storage**: Always store tokens securely (preferably in httpOnly cookies)
- **Token Expiration**: Implement token refresh strategy for better security
- **Logout Best Practice**: Always logout before closing the application to invalidate the token
- **CORS Headers**: Ensure CORS is properly configured for cross-origin requests
- **Error Handling**: Implement proper error handling on client-side for better user experience
