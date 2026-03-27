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
