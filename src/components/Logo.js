import React from 'react';
import { Typography, Box } from '@mui/material';

const Logo = ({ variant = "h4", color = "primary" }) => {
  return (
    <Box display="flex" alignItems="center">
      <Typography 
        variant={variant} 
        color={color}
        sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        🥩 meat-OS
      </Typography>
    </Box>
  );
};

export default Logo;
