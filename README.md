# IronTrip

IronTrip is a full-stack MERN (MongoDB, Express, React, Node.js) application that connects travelers with hosts offering spaces. Users can create listings, send requests, and manage their profiles.

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

- `GET /auth/me`: Get the logged-in user's info
- `POST /auth/signup`
  - **Body:**
    ```json
    {
      "username": "testuser",
      "email": "testuser@example.com",
      "password": "password123",
      "city": "Test City",
      "country": "Test Country"
    }
    ```
- `POST /auth/login`
  - **Body:**
    ```json
    {
      "email": "testuser@example.com",
      "password": "password123"
    }
    ```
- `POST /auth/logout`
  - **Body:** (empty)

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

The URL to your presentation slides:
- **Slides Link:** [Slides Link](PENDING-LINK-HERE)
