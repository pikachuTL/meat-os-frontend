import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      background: 'linear-gradient(135deg, #232326 60%, #c00 100%)',
      color: 'white',
      py: 4,
      px: 2,
      mt: 6,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
    }}
  >
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start" justifyContent="space-between" maxWidth={1100} mx="auto">
      <Box flex={1} minWidth={220}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          MEAT-OS
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.85, mb: 1 }}>
          Don’t just eat… MeatOS it!
        </Typography>
        <Box sx={{ height: 3, width: 60, background: '#fff', borderRadius: 2, mb: 2 }} />
      </Box>
      <Stack spacing={1} flex={2} minWidth={220}>
        <Box display="flex" alignItems="center" gap={1}>
          <PhoneIcon sx={{ color: '#FF8E53' }} />
          <Typography variant="body1" component="span">
            +91 92846 08255, +91 84323 64578
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <LanguageIcon sx={{ color: '#FF8E53' }} />
          <Link href="https://www.meatos.com" target="_blank" rel="noopener" underline="hover" color="inherit">
            www.meatos.com
          </Link>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon sx={{ color: '#FF8E53' }} />
          <Typography variant="body1" component="span">
            Narendra nagar, Nagpur - 440015
          </Typography>
        </Box>
      </Stack>
    </Stack>
    <Typography variant="caption" sx={{ opacity: 0.7, mt: 4, display: 'block', textAlign: 'center' }}>
      &copy; {new Date().getFullYear()} MEAT-OS. All rights reserved.
    </Typography>
  </Box>
);

export default Footer; 