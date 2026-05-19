# Quick Start Commands

This file contains all commands needed to get AlureHub running.

## First Time Setup

### 1. Seed Database (One-time)
```bash
cd backend
npm install
npm run seed
```

### 2. Start Backend
```bash
cd backend
npm run dev
```

Expected: Backend running on port 5000

### 3. Start Frontend (in new terminal)
```bash
cd frontend
npm install
npm run dev
```

Expected: Frontend running on port 3000

## After First Setup

### To Start Application
Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Then open: http://localhost:3000

## Useful Commands

### Backend
```bash
npm run dev      # Start in development mode
npm start        # Start in production mode
npm run seed     # Re-seed database with 20 products
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linting
```

## Test Workflow

1. **Sign Up as Buyer**
   - Go to http://localhost:3000/auth/signup
   - Select "Buyer"
   - Create account

2. **Browse Products**
   - Click "Products" in navbar
   - Search or filter
   - Add items to cart

3. **Checkout**
   - Click "Cart" in navbar
   - Review items
   - Click "Proceed to Checkout"
   - Place order with COD

4. **View Orders**
   - Click your name → "My Orders"
   - See order history

5. **Admin Testing**
   - Sign out
   - Sign up as "Admin"
   - Click "Admin" in navbar
   - Manage products and orders

## Environment Variables

### Backend (.env already configured)
```
MONGODB_URI=mongodb://localhost:27017/AlureHub
PORT=5000
JWT_ACCESS_SECRET=your_access_secret_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_change_in_production
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
```

### Frontend (.env already configured)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Troubleshooting Commands

### Check if MongoDB is running
```bash
# Windows
# Check MongoDB service in Services app

# Mac
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

### Find and kill process on port 5000
```bash
lsof -i :5000
kill -9 <PID>
```

### Find and kill process on port 3000
```bash
lsof -i :3000
kill -9 <PID>
```

### Clear npm cache if install issues
```bash
npm cache clean --force
```

### Fresh install (if having issues)
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run seed
npm run dev

# Frontend (in new terminal)
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Database Commands (Optional MongoDB)

### View all products
```bash
# In MongoDB shell/Compass
use AlureHub
db.products.find()
```

### View users
```bash
db.users.find()
```

### View orders
```bash
db.orders.find()
```

### Clear all data (careful!)
```bash
db.dropDatabase()
```

## API Testing with Postman/cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "test123",
    "role": "buyer"
  }'
```

### Signin
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "test123",
    "role": "buyer"
  }'
```

### Get all products
```bash
curl http://localhost:5000/api/products
```

## Project Documentation

- `SETUP_GUIDE.md` - Detailed setup instructions
- `README.md` - Project overview
- `backend/README.md` - Backend documentation
- `frontend/README.md` - Frontend documentation
