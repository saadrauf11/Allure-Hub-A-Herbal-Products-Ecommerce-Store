'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d4a574',
    },
    secondary: {
      main: '#a1714c',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>AlureHub - Natural Beauty Products</title>
        <meta name="description" content="Premium natural beauty products" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
