import React from 'react';
import { Box, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: 2,
          mb: 1,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.08)' }
          }
        }}
      >
        meat-OS
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ 
          animation: 'fadeInOut 2s ease-in-out infinite',
          '@keyframes fadeInOut': {
            '0%, 100%': { opacity: 0.6 },
            '50%': { opacity: 1 }
          }
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
