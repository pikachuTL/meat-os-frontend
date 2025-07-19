import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Button, Typography } from '@mui/material';
import { theme } from './theme';
import AdminLogin from './pages/AdminLogin';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import CustomerPage from './pages/CustomerPage';
import Header from './components/Header'; // Add this line

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
        <Header 
          view={view} 
          setView={setView} 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout} 
        />
        
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