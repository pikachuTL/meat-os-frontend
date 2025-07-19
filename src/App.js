import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Button, Typography } from '@mui/material';
import { theme } from './theme';
import AdminLogin from './pages/AdminLogin';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import CustomerPage from './pages/CustomerPage';
import Logo from './components/Logo';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [view, setView] = useState('customer');
  const [adminTab, setAdminTab] = useState('category');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setView('customer');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2, 
          bgcolor: 'background.paper',
          boxShadow: 1
        }}>
          <Logo variant="h5" />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant={view === 'customer' ? 'contained' : 'outlined'}
              onClick={() => setView('customer')}
            >
              Customer Panel
            </Button>
            <Button 
              variant={view === 'admin' ? 'contained' : 'outlined'}
              onClick={() => setView('admin')}
            >
              Admin Panel
            </Button>
            {isLoggedIn && view === 'admin' && (
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Box>
        </Box>
        
        {view === 'admin' ? (
          isLoggedIn ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Admin Dashboard
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Button 
                  variant={adminTab === 'category' ? 'contained' : 'outlined'}
                  onClick={() => setAdminTab('category')}
                >
                  Category
                </Button>
                <Button 
                  variant={adminTab === 'product' ? 'contained' : 'outlined'}
                  onClick={() => setAdminTab('product')}
                >
                  Product
                </Button>
                <Button 
                  variant={adminTab === 'order' ? 'contained' : 'outlined'}
                  onClick={() => setAdminTab('order')}
                >
                  Orders
                </Button>
              </Box>
              {adminTab === 'category' && <CategoryPage />}
              {adminTab === 'product' && <ProductPage />}
              {adminTab === 'order' && <OrderPage />}
            </Box>
          ) : (
            <AdminLogin onLogin={handleLogin} />
          )
        ) : (
          <CustomerPage />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;