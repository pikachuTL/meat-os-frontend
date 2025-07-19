import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const Header = ({ view, setView, isLoggedIn, handleLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleViewChange = (newView) => {
    setView(newView);
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'Customer View', value: 'customer', icon: <PersonIcon /> },
    { text: 'Admin Panel', value: 'admin', icon: <AdminPanelSettingsIcon /> }
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.value}
            onClick={() => handleViewChange(item.value)}
            sx={{
              backgroundColor: view === item.value ? 'primary.light' : 'transparent',
              color: view === item.value ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: view === item.value ? 'primary.main' : 'action.hover'
              }
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </Box>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isLoggedIn && (
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              mt: 2,
              backgroundColor: 'error.light',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.main'
              }
            }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          boxShadow: '0 3px 15px rgba(0,0,0,0.2)'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <StorefrontIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Meat-OS
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
              <Button
                color="inherit"
                onClick={() => setView('customer')}
                sx={{
                  backgroundColor: view === 'customer' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Customer View
              </Button>
              <Button
                color="inherit"
                onClick={() => setView('admin')}
                sx={{
                  backgroundColor: view === 'admin' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Admin Panel
              </Button>
              {isLoggedIn && (
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
