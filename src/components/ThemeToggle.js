import React from 'react';
import { 
  IconButton, 
  Tooltip, 
  Box,
  Fade,
  Slide
} from '@mui/material';
import { 
  LightMode, 
  DarkMode 
} from '@mui/icons-material';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <Slide direction="down" in={true} timeout={1000}>
      <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1001 }}>
        <Fade in={true} timeout={1500}>
          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={onToggle}
              sx={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                color: isDarkMode ? '#FFD700' : '#FF8E53',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  transform: 'rotate(180deg) scale(1.1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        </Fade>
      </Box>
    </Slide>
  );
};

export default ThemeToggle; 