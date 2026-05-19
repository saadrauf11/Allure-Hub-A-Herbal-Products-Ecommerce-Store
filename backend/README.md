# AlureHub Backend

Express.js + MongoDB ecommerce backend for natural beauty products.

## Features

- JWT authentication (signup/signin for buyers and admins)
- Product management (CRUD operations)
- Shopping cart management
- Order management with status tracking
- Role-based access control (admin/buyer)
- Image upload for products
- Automatic token refresh on 401

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: MongoDB connection string
- `JWT_ACCESS_SECRET`: Secret key for access tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `PORT`: Server port (default: 5000)

3. Seed database with sample products:
```bash
npm run seed
```

4. Start the server:
```bash
npm run dev   # Development mode with nodemon
npm start     # Production mode
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login
- `POST /api/auth/refresh` - Refresh access token

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders/checkout` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)
- `DELETE /api/orders/:id` - Cancel order

## Project Structure

```
backend/
├── src/
│   ├── config/        # Database configuration
│   ├── models/        # MongoDB schemas
│   ├── controllers/   # Request handlers
│   ├── routes/        # API routes
│   └── middleware/    # Authentication & authorization
├── public/
│   └── images/        # Product images
├── server.js          # Entry point
├── seed.js            # Database seeding script
└── .env               # Environment variables
```

## Product Sample Data

20 natural beauty products are included in the seed script including:
- Face oils and serums
- Face masks and exfoliants
- Body care and moisturizers
- Hair treatments
- Essential oils
- Lip care and treatments

All sample products use `sample.jpg` as the image reference.

## Notes

- All images should be placed in `backend/public/images/`
- Images are served statically via Express
- JWT tokens expire in 30 minutes (access) and 7 days (refresh)
- Passwords are hashed with bcrypt before storage
