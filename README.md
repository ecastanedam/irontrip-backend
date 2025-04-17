# IronTrip

IronTrip is a full-stack MERN (MongoDB, Express, React, Node.js) application that connects travelers with hosts offering spaces. Users can create listings, send requests, and manage their profiles.

## Table of Contents

- [Server](#server)
  - [Models](#models)
    - [User Model](#user-model)
    - [Listing Model](#listing-model)
    - [Request Model](#request-model)
  - [API Endpoints/Backend Routes](#api-endpointsbackend-routes)
    - [Auth Routes](#auth-routes)
    - [User Routes](#user-routes)
    - [Listing Routes](#listing-routes)
    - [Request Routes](#request-routes)
- [Links](#links)
  - [Version Control](#version-control)
  - [Deployment](#deployment)
  - [Presentation](#presentation)

## Server

### Models

#### User Model

- `username`: `String` // Required, unique, lowercase, trimmed, min 3, max 20 characters
- `email`: `String` // Required, unique, lowercase, trimmed, must match email format
- `password`: `String` // Required, min 6 characters
- `city`: `String` // Required
- `country`: `String` // Required
- `offerSpace`: `Boolean` // Default: `false`
- `bio`: `String` // Optional, max 300 characters
- `profilePicture`: `String` // Optional, default profile picture URL

#### Listing Model

- `host`: `ObjectID<User>` // Required, references the User model
- `title`: `String` // Required, trimmed
- `address`: `String` // Required, trimmed
- `city`: `String` // Required, trimmed
- `country`: `String` // Required, trimmed
- `location`: `Object` // Optional, contains `lat` and `lng`
- `description`: `String` // Required, min 10 characters
- `availability`: `Array<Object>` // Required, contains `startDate` and `endDate`
- `image`: `String` // Optional, URL of the listing image

#### Request Model

- `traveler`: `ObjectID<User>` // Required, references the User model
- `host`: `ObjectID<User>` // Required, references the User model
- `listing`: `ObjectID<Listing>` // Required, references the Listing model
- `status`: `String` // Default: `pending`, options: `pending`, `approved`, `rejected`
- `message`: `String` // Optional, message from the traveler

## API Endpoints/Backend Routes

### Auth Routes

### Auth Routes

- `GET /auth/verify`: Checks if the provided authentication token is valid. Requires a valid JWT token to be sent (in the `Authorization` header as a Bearer token). 
- `POST /auth/signup`: Register a new user. Accepts an optional `profilePicture` which can be a URL or uploaded as a file.
  - **Request Body:**
    ```json
    {
      "username": "string (required)",
      "email": "string (required, unique)",
      "password": "string (required, min 6 characters)",
      "city": "string (required)",
      "country": "string (required)",
      "profilePicture": "string (optional, URL)"
    }
    ```
   
- `POST /auth/login`: Log in an existing user.
  - **Request Body:**
    ```json
    {
      "email": "string (required)",
      "password": "string (required)"
    }
    ```
 
### User Routes

- `GET /user/:userId`: Get user profile
- `PATCH /user/:userId`: Update user profile

### Listing Routes

- `GET /listing/`: Get all listings
- `GET /listing/:listingId`: Get a specific listing
- `POST /listing/create`
  - **Body:**
    ```json
    {
      "title": "Cozy Apartment",
      "address": "123 Main St",
      "city": "Test City",
      "country": "Test Country",
      "description": "A beautiful apartment in the heart of the city.",
      "availability": [
        { "startDate": "2025-05-01", "endDate": "2025-05-15" }
      ],
      "image": "[https://example.com/image.jpg](https://example.com/image.jpg)"
    }
    ```
- `PATCH /listing/:listingId`: Update a specific listing
- `DELETE /listing/:listingId`: Delete a specific listing

### Request Routes

- `GET /request/user/:userId`: Get all requests for a user
- `POST /request/create`
  - **Body:**
    ```json
    {
      "host": "host_user_object_id",
      "listing": "listing_object_id",
      "message": "Hello, I'd like to book this space."
    }
    ```
- `PATCH /request/:requestId`: Update a specific request
- `DELETE /request/:requestId`: Delete a specific request

## Links

### Git

- **Frontend Repository:** [irontrip-frontend](https://github.com/CannyRo/irontrip-frontend)
- **Backend Repository:** [irontrip-backend](https://github.com/ecastanedam/irontrip-backend)
- **Deployed Application (Frontend):** [IronTrip Frontend](https://irontrip-frontend.netlify.app/)

### Slides

- **Slides Link:** [Slides Link](https://docs.google.com/presentation/d/1F-yCA52RYL-UrmpNwFFl5f-q-TQKjfvYbN9wlklpn70/edit?usp=sharing)
