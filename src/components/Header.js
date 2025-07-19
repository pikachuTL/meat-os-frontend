import React, { useState, useEffect } from 'react';
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
  useMediaQuery,
  Fade,
  Slide,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Header = ({ view, setView, isLoggedIn, handleLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
    setDrawerOpen(false);
  };

  const menuItems = [
    { 
      text: 'Customer View', 
      value: 'customer', 
      icon: <PersonIcon />,
      color: '#4CAF50'
    },
    { 
      text: 'Admin Panel', 
      value: 'admin', 
      icon: <AdminPanelSettingsIcon />,
      color: '#FF9800'
    }
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Box sx={{ p: 2, textAlign: 'center', mb: 2 }}>
        <RestaurantIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Meat-OS
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Fresh Meat Delivery
        </Typography>
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <Slide direction="left" in={true} timeout={300 + index * 100}>
            <ListItem 
              button 
              key={item.value}
              onClick={() => handleViewChange(item.value)}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                backgroundColor: view === item.value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'translateX(10px)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: view === item.value ? 'bold' : 'normal'
                  }
                }}
              />
              {view === item.value && (
                <Chip 
                  label="Active" 
                  size="small" 
                  sx={{ 
                    backgroundColor: item.color,
                    color: 'white',
                    fontSize: '0.7rem'
                  }} 
                />
              )}
            </ListItem>
          </Slide>
        ))}
        {isLoggedIn && (
          <Slide direction="left" in={true} timeout={500}>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                mx: 2,
                mt: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(244,67,54,0.8)',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(244,67,54,1)',
                  transform: 'translateX(10px)'
                }
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </Slide>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: scrolled 
            ? 'rgba(254, 107, 139, 0.95)' 
            : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(0,0,0,0.15)' 
            : '0 3px 15px rgba(0,0,0,0.2)'
        }}
      >
        <Toolbar>
          <Fade in={true} timeout={1000}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <StorefrontIcon 
                sx={{ 
                  mr: 1, 
                  fontSize: 32,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }} 
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Meat-OS
              </Typography>
            </Box>
          </Fade>

          {isMobile ? (
            <Fade in={true} timeout={1500}>
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ 
                  ml: 'auto',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(90deg)',
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Fade>
          ) : (
            <Fade in={true} timeout={1500}>
              <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                {menuItems.map((item, index) => (
                  <Slide direction="down" in={true} timeout={800 + index * 200}>
                    <Button
                      key={item.value}
                      color="inherit"
                      onClick={() => setView(item.value)}
                      sx={{
                        backgroundColor: view === item.value ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </Box>
                      {item.text}
                    </Button>
                  </Slide>
                ))}
                {isLoggedIn && (
                  <Slide direction="down" in={true} timeout={1200}>
                    <Button
                      color="inherit"
                      onClick={handleLogout}
                      sx={{
                        backgroundColor: 'rgba(244,67,54,0.8)',
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(244,67,54,1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Logout
                    </Button>
                  </Slide>
                )}
              </Box>
            </Fade>
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
      
      {/* Spacer for fixed header */}
      <Box sx={{ height: 64 }} />
    </>
  );
};

export default Header;
