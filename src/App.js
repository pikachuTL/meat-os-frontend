import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import ThemeToggle from './components/ThemeToggle';
import AdminLogin from './pages/AdminLogin';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import CustomerPage from './pages/CustomerPage';
import Header from './components/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [view, setView] = useState('customer');
  const [adminTab, setAdminTab] = useState('category');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('admin');
    showNotification('Successfully logged in!', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setView('customer');
    showNotification('Successfully logged out!', 'info');
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
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
              {adminTab === 'category' && <CategoryPage showNotification={showNotification} />}
              {adminTab === 'product' && <ProductPage showNotification={showNotification} />}
              {adminTab === 'order' && <OrderPage showNotification={showNotification} />}
            </Box>
      ) : (
        <AdminLogin onLogin={handleLogin} />
          )
        ) : (
          <CustomerPage showNotification={showNotification} />
        )}

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
    </div>
    </ThemeProvider>
  );
}

export default App;