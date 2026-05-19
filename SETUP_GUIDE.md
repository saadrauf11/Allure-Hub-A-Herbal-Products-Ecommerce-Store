# AlureHub - Complete Setup Guide

Complete step-by-step guide to get AlureHub running locally.

## Prerequisites

Before starting, ensure you have:
- Node.js v14 or higher
- MongoDB running locally on port 27017
- npm or yarn package manager
- A code editor (VS Code recommended)

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Install Dependencies
```bash
npm install
```

This installs:
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- dotenv - Environment variables
- cors - Cross-origin support
- multer - File upload handling
- cookie-parser - Cookie parsing

### 1.3 Configure Environment Variables
The `.env` file is already created with defaults:
```
MONGODB_URI=mongodb://localhost:27017/AlureHub
PORT=5000
JWT_ACCESS_SECRET=your_access_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
```

For production, update the JWT secrets to strong random strings.

### 1.4 Seed Database with 20 Products
```bash
npm run seed
```

This creates the MongoDB database and populates it with 20 natural beauty products including:
- Face oils and serums
- Face masks
- Body care products
- Hair treatments
- Essential oils

All products reference `sample.jpg` as placeholder image.

### 1.5 Start Backend Server
```bash
npm run dev
```

Expected output:
```
MongoDB Connected: localhost
Server running on port 5000
```

Backend is now running at: `http://localhost:5000`

### 1.6 Verify Backend
Open in browser or Postman:
```
GET http://localhost:5000/api/health
```

Response should be: `{"message":"Server is running"}`

## Step 2: Frontend Setup

### 2.1 Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

### 2.2 Install Dependencies
```bash
npm install
```

This installs:
- next - React framework
- react - UI library
- @mui/material - Material Design components
- @emotion/react & @emotion/styled - MUI styling
- axios - HTTP client

### 2.3 Environment Already Configured
The `.env` file is already set with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2.4 Start Frontend Development Server
```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
- Local: http://localhost:3000
```

Frontend is now running at: `http://localhost:3000`

## Step 3: Test the Application

### 3.1 Open in Browser
Navigate to: `http://localhost:3000`

You should see the AlureHub homepage with:
- Navigation bar
- Hero section
- Features section
- Call-to-action buttons

### 3.2 Create a Buyer Account

1. Click "Create Account" or "Sign Up"
2. Fill in details:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Role: Buyer
3. Click "Sign Up"
4. You should be redirected to /products page

### 3.3 Browse Products

1. View all 20 products
2. Try search: type "oil" to filter products
3. Try category filter
4. Click "Add to Cart" on any product
5. Select quantity and confirm

### 3.4 View Shopping Cart

1. Click "Cart" in navigation
2. You should see added items
3. Try updating quantities
4. Try removing items
5. View order summary with total

### 3.5 Checkout

1. From cart, click "Proceed to Checkout"
2. Review order summary
3. Click "Place Order" then confirm
4. You should see success message and be redirected to orders

### 3.6 View Orders

1. Click user menu → "My Orders"
2. You should see your placed order
3. Click "View" to see details
4. Status should be "pending"
5. Click "Cancel" to test order cancellation

### 3.7 Create Admin Account

1. Sign out (click user menu → Logout)
2. Go to Sign Up
3. Fill details:
   - Full Name: Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: Admin
4. Click "Sign Up"
5. You should see "Admin" link in navbar

### 3.8 Test Admin Dashboard

#### Product Management
1. Click "Admin" → you should see products table
2. Click "Add Product":
   - Name: Test Product
   - Description: Test description
   - Price: 29.99
   - Category: Test
   - Stock: 50
   - Upload Image: optional
3. Click "Add"
4. New product appears in table
5. Try "Edit" to update a product
6. Try "Delete" to remove a product

#### Order Management
1. From Admin menu, go to Orders
2. You should see orders placed by buyers
3. Click "Manage" on any order
4. Change status from pending → sent → delivered
5. Click "Update Status"
6. Status updates instantly

## Step 4: Add Product Images (Optional)

### 4.1 Prepare Images

Create or obtain product images and name them appropriately.

### 4.2 For Backend

1. Place images in: `backend/public/images/`
2. The backend serves them at: `http://localhost:5000/images/filename.jpg`

### 4.3 For Frontend

1. Place images in: `frontend/public/images/`
2. The frontend can reference them directly

### 4.4 Upload via Admin

1. Go to Admin → Products → Add Product
2. Click "Upload Image" button
3. Select an image file
4. Upload completes automatically with form submission

## Troubleshooting

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running locally
```bash
# On Windows: Check MongoDB service is running
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod
```

### Issue: Backend Won't Start - Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
# Or change PORT in .env file
```

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure backend CORS is configured for `http://localhost:3000`
Check server.js has: `cors({ origin: 'http://localhost:3000', credentials: true })`

### Issue: Frontend Can't Connect to Backend
Make sure:
1. Backend is running on port 5000
2. Frontend `.env` has: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3. Check browser console for errors (F12)

### Issue: Images Not Loading
1. Place images in `backend/public/images/` or `frontend/public/images/`
2. For backend images, ensure they're referenced correctly
3. Check image filename matches what's in database

## Project Folders Overview

### Backend Structure
```
backend/
├── src/
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Database schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   └── middleware/            # Auth & validation
│       └── auth.js
├── public/images/             # Product images
├── server.js                  # Entry point
├── seed.js                    # Database seeding
├── package.json
└── .env
```

### Frontend Structure
```
frontend/
├── app/
│   ├── auth/                  # Authentication pages
│   │   ├── signin/
│   │   └── signup/
│   ├── products/              # Product listing
│   ├── cart/                  # Shopping cart
│   ├── checkout/              # Checkout page
│   ├── account/               # User account
│   │   └── orders/
│   ├── admin/                 # Admin dashboard
│   │   ├── products/
│   │   └── orders/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css
├── components/                # Reusable components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── ProtectedRoute.tsx
├── context/                   # State management
│   └── AuthContext.js
├── hooks/                     # Custom hooks
│   └── useAuth.js
├── services/                  # API services
│   └── api.js
├── public/images/             # Static images
├── next.config.js
├── tsconfig.json
├── package.json
└── .env
```

## What's Included

✅ Complete Express.js backend with MongoDB
✅ Full Next.js frontend with Material-UI
✅ JWT authentication with auto-refresh
✅ 20 seeded beauty products
✅ Shopping cart system
✅ Order management
✅ Admin dashboard
✅ Product image upload
✅ Search and filtering
✅ Responsive design
✅ Protected routes
✅ Role-based access

## Next Steps

1. **Replace sample.jpg**: Add actual product images
2. **Customize theme**: Modify colors in frontend layout.tsx
3. **Update product data**: Edit seed.js with real products
4. **Add payment gateway**: Integrate with Stripe/PayPal
5. **Deploy**: Use Vercel (frontend) and Railway/Heroku (backend)

## Development Tips

- Use browser DevTools (F12) to debug frontend
- Use Postman to test API endpoints
- Check MongoDB data with MongoDB Compass
- Frontend hot reloads on file save
- Backend requires manual restart after code changes (unless using nodemon)

## Support

For detailed information:
- Backend docs: `backend/README.md`
- Frontend docs: `frontend/README.md`
- Main docs: `README.md`

Happy coding! 🎉
