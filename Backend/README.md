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
