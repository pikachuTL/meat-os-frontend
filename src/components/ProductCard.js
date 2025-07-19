import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        }
      }}
    >
      {product.image && (
        <CardMedia
          component="img"
          height="200"
          image={`https://meat-os-backend-production.up.railway.app/${product.image.replace(/\\/g, "/")}`}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.description}
        </Typography>
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ₹{product.price}
            </Typography>
            <Chip 
              label={product.unit} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => onAddToCart(product)}
            sx={{ minWidth: 'auto' }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
