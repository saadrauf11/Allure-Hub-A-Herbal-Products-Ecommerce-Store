# AlureHub - Natural Beauty Ecommerce Store

A complete MERN stack ecommerce platform for natural beauty products with JWT authentication, product catalog, shopping cart, COD checkout, and comprehensive admin dashboard.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: Next.js, React, Material-UI (Bazaar MUI)
- **Authentication**: JWT (access + refresh tokens)
- **State Management**: React Context
- **HTTP Client**: Axios
- **Image Storage**: Local file system

## Project Structure

```
AlureHub/
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── models/       # MongoDB schemas
│   │   ├── controllers/  # Route handlers
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Auth & authorization
│   ├── public/images/    # Product images
│   ├── seed.js          # Database seeding
│   └── server.js        # Entry point
│
└── frontend/             # Next.js application
    ├── app/             # Pages and layouts
    ├── components/      # React components
    ├── context/         # React context
    ├── hooks/           # Custom hooks
    ├── services/        # API services
    └── public/images/   # Static images
```

## Features

### User Features
✅ User authentication (sign up, sign in, logout)
✅ Buyer and Admin account types
✅ Product catalog with 20 natural beauty products
✅ Search and category filtering
✅ Add to cart functionality
✅ Shopping cart management
✅ Checkout with COD payment
✅ Order history and tracking
✅ Cancel pending orders

### Admin Features
✅ Product management (add, edit, delete)
✅ Product image uploads
✅ Order management dashboard
✅ Order status updates (pending → sent → delivered)
✅ View all orders and customer details
✅ Real-time inventory management

### Technical Features
✅ JWT authentication with auto-refresh on 401
✅ Role-based access control
✅ Protected routes (frontend + backend verification)
✅ Cart persistence (localStorage for guests, database for users)
✅ Automatic token refresh before expiry
✅ Professional MUI design
✅ Responsive design for all devices

## Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (running locally on port 27017)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env`:
```bash
cp .env.example .env
```

4. Seed database with 20 sample products:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Default Test Accounts

After seeding, you can use these accounts to test:

### Buyer Account
- Email: (create new via signup)
- Role: Buyer
- Access: Products, Cart, Checkout, Orders

### Admin Account
- Email: (create new via signup as Admin)
- Role: Admin
- Access: Product Management, Order Management

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - List all
- `GET /api/products/:id` - Get one
- `POST /api/products` - Create (admin)
- `PUT /api/products/:id` - Update (admin)
- `DELETE /api/products/:id` - Delete (admin)

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add item
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders
- `POST /api/orders/checkout` - Place order
- `GET /api/orders` - User orders
- `GET /api/orders/admin/all` - All orders (admin)
- `PUT /api/orders/:id` - Update status (admin)
- `DELETE /api/orders/:id` - Cancel order

## Product Data

20 natural beauty products are included:
- Face oils and serums (Rose, Jojoba, Argan, Tea Tree, etc.)
- Face masks and exfoliants (Green Tea, Charcoal, Turmeric, etc.)
- Body care products (Coconut Oil, Shea Butter, Body Butter)
- Hair treatments (Argan Hair Oil)
- Essential oils (Lavender, Tea Tree)
- Lip and specialty care

All products use `sample.jpg` as image placeholder. Replace with actual product images in `backend/public/images/` and `frontend/public/images/`.

## Authentication Flow

1. User signs up with name, email, password, and role (buyer/admin)
2. Password hashed with bcrypt before storage
3. Access token (30 min) and refresh token (7 days) generated
4. Tokens stored in localStorage and httpOnly cookies
5. API calls include Bearer token in Authorization header
6. When access token expires (401 response), automatically refresh using refresh token
7. Refresh happens transparently without user intervention

## Cart Persistence

- **Guests**: Cart stored in localStorage only
- **Logged-in users**: Cart stored in both localStorage (for instant UI) and database (for persistence)
- When user logs in, cart from localStorage is synced with database
- Checkout clears both localStorage and database cart

## Image Management

1. Place `sample.jpg` in both:
   - `backend/public/images/`
   - `frontend/public/images/`

2. Admin can upload new product images:
   - Images uploaded to `backend/public/images/`
   - Filename stored in database
   - Frontend fetches from `http://localhost:5000/images/filename`

## Development Notes

- Backend CORS configured to accept requests from `http://localhost:3000`
- JWT tokens auto-refresh on 401 errors through axios interceptors
- Admin routes verified on both frontend (redirect) and backend (middleware)
- All passwords hashed with bcrypt (10 salt rounds)
- Database indexes on email for fast user lookup

## Production Deployment

For production:

1. Update environment variables:
   - Change JWT secrets
   - Update MongoDB URI to production database
   - Set `NODE_ENV=production`
   - Update CORS origin

2. Build frontend:
```bash
npm run build
npm start
```

3. Deploy backend to hosting service (Heroku, Railway, etc.)

4. Deploy frontend (Vercel recommended for Next.js)

## License

MIT

## Support

For issues or questions, refer to individual README files in backend/ and frontend/ folders.
