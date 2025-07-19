import React from 'react';
import { Box, Button, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './Logo';

const Header = ({ view, setView, isLoggedIn, handleLogout }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: 'Customer Panel', value: 'customer' },
    { label: 'Admin Panel', value: 'admin' }
  ];

  const drawer = (
    <Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.value}
            onClick={() => {
              setView(item.value);
              setMobileOpen(false);
            }}
            selected={view === item.value}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isLoggedIn && view === 'admin' && (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      p: 2, 
      bgcolor: 'background.paper',
      boxShadow: 1
    }}>
      <Logo variant="h5" />
      
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </>
      ) : (
        <Box sx={{ display: 'flex', gap: 2 }}>
          {menuItems.map((item) => (
            <Button 
              key={item.value}
              variant={view === item.value ? 'contained' : 'outlined'}
              onClick={() => setView(item.value)}
            >
              {item.label}
            </Button>
          ))}
          {isLoggedIn && view === 'admin' && (
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Header;
