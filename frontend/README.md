# AlureHub Frontend

Next.js + Material-UI (Bazaar MUI) ecommerce frontend for natural beauty products.

## Features

- User authentication (signup/signin for buyers and admins)
- Role-based access control (protected routes)
- Product catalog with search and filtering
- Shopping cart with localStorage persistence and database sync
- Checkout with COD payment
- Order management and order history
- Admin dashboard for product management
- Admin order management with status updates
- Auto token refresh on 401 responses
- Professional MUI design with custom theme

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env.local` file:
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Pages & Routes

### Public Routes
- `/` - Home page
- `/products` - Product catalog
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Protected Routes (Buyers & Admins)
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/account/orders` - Order history

### Admin Routes
- `/admin/products` - Product management
- `/admin/orders` - Order management

## Project Structure

```
frontend/
├── app/
│   ├── auth/           # Authentication pages
│   ├── products/       # Product listing
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout page
│   ├── account/        # User account pages
│   ├── admin/          # Admin dashboard
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── ProtectedRoute.tsx
├── context/            # React context
│   └── AuthContext.js
├── hooks/              # Custom hooks
│   └── useAuth.js
├── services/           # API services
│   └── api.js
├── public/             # Static files
│   └── images/
├── next.config.js      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
└── .env               # Environment variables
```

## Features Details

### Authentication
- Sign up as buyer or admin
- Sign in with email and password
- Automatic token refresh when access token expires
- Secure token storage (localStorage)
- Protected routes with role-based access

### Products
- Browse all products with pagination
- Search products by name/description
- Filter by category
- Product details
- Add to cart functionality

### Shopping Cart
- Add/remove items
- Update quantities
- Cart persistence (localStorage for guests, database for logged-in users)
- Real-time cart updates

### Checkout
- Review order items
- Order confirmation dialog
- COD payment method
- Order success confirmation

### Admin Dashboard
- Add/Edit/Delete products
- Upload product images
- Manage all orders
- Update order status (pending → sent → delivered)

### Order Management
- View order history
- Cancel pending orders
- Track order status
- View detailed order information

## API Integration

The frontend communicates with the backend API through `services/api.js`:

- Axios interceptors handle automatic token refresh on 401 responses
- All API calls use Bearer token authentication
- Error handling with user-friendly notifications
- Loading states for better UX

## Theme Configuration

Custom Material-UI theme with:
- Primary color: `#d4a574` (elegant gold)
- Secondary color: `#a1714c` (warm brown)
- Professional typography with Poppins font
- Responsive design for all screen sizes

## Notes

- Product images are served from backend's public/images folder
- Cart data persists in localStorage for offline access
- Logged-in users have cart data synced with backend
- Admin access requires role:admin in JWT token
- All sensitive operations are protected by backend middleware

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000/api)
