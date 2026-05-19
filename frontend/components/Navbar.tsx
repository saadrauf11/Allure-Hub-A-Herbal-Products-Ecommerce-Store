'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const Navbar = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#2c2416', marginBottom: 3 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box
            component={Link}
            href="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#d4a574',
                fontSize: '1.5rem',
              }}
            >
              AlureHub
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              component={Link}
              href="/products"
              sx={{ color: 'white', fontWeight: 500 }}
            >
              Products
            </Button>

            {isAuthenticated && isAdmin && (
              <Button
                component={Link}
                href="/admin/products"
                sx={{ color: '#d4a574', fontWeight: 500 }}
              >
                Admin
              </Button>
            )}

            {isAuthenticated && (
              <Button
                component={Link}
                href="/cart"
                startIcon={<ShoppingCartIcon />}
                sx={{ color: 'white', fontWeight: 500 }}
              >
                Cart
              </Button>
            )}

            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleMenuOpen}
                  sx={{ color: '#d4a574', fontWeight: 500 }}
                >
                  {user?.name}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    component={Link}
                    href="/account/orders"
                    onClick={handleMenuClose}
                  >
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/auth/signin"
                  sx={{ color: 'white', fontWeight: 500 }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  href="/auth/signup"
                  variant="contained"
                  sx={{
                    backgroundColor: '#d4a574',
                    color: '#2c2416',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#c49564',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
