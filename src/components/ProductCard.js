import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip,
  Fade,
  Grow,
  IconButton,
  Tooltip
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BlockIcon from '@mui/icons-material/Block';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist, highlighted, id }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    // Add a small animation effect
    const button = document.activeElement;
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
  };

  return (
    <Grow in={true} timeout={800}>
      <Card 
        id={id}
        sx={{ 
          height: 390, // increased card height
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: highlighted ? '3px solid #FE6B8B' : 'none',
          boxShadow: highlighted ? '0 0 24px 4px #FE6B8B55' : undefined,
          animation: highlighted ? 'highlight-pulse 1s infinite alternate' : 'none',
          '@keyframes highlight-pulse': {
            from: { boxShadow: '0 0 24px 4px #FE6B8B55' },
            to: { boxShadow: '0 0 36px 8px #FE6B8B99' }
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            '& .product-image': {
              transform: 'scale(1.1)',
            }
          }
        }}
      >
        {/* Favorite Button */}
        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
          <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
            <IconButton
              onClick={() => onToggleWishlist(product)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              {isInWishlist ? (
                <FavoriteIcon sx={{ color: '#e91e63' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Product Image */}
        {product.image && (
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Fade in={imageLoaded} timeout={500}>
              <CardMedia
                component="img"
                height="260"
                width="220"
                image={`https://meat-os-backend-production.up.railway.app/uploads/${product.image}`}
                alt={product.name}
                className="product-image"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => setImageLoaded(true)}
                sx={{ 
                  objectFit: 'cover',
                  width: '100%',
                  height: 260,
                  transition: 'transform 0.3s ease',
                  filter: imageLoaded ? 'none' : 'blur(10px)'
                }}
              />
            </Fade>
            {!imageLoaded && (
              <Box 
                sx={{ 
                  height: 260, 
                  backgroundColor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {product.image}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocalOfferIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description}
          </Typography>

          {/* In ProductCard, show available/not available chip (read-only) */}
          <Box sx={{ mt: 1, mb: 1 }}>
            <Chip 
              label={product.available ? 'Available' : 'Not Available'} 
              size="small" 
              color={product.available ? 'success' : 'error'}
              variant="filled"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography 
                variant="h5" 
                color="primary" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                ₹{product.price}
              </Typography>
              <Chip 
                label={product.unit} 
                size="small" 
                sx={{ 
                  backgroundColor: 'primary.light',
                  color: 'white',
                  fontWeight: 'bold',
                  mt: 0.5
                }}
              />
            </Box>
            
            <Tooltip title={product.available ? 'Add to cart' : 'This product is not available for order'}>
              <span>
            <Button
              variant="contained"
                  startIcon={product.available ? <AddShoppingCartIcon /> : <BlockIcon />}
              onClick={handleAddToCart}
              sx={{ 
                minWidth: 'auto',
                px: 3,
                py: 1,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(254, 107, 139, 0.4)'
                }
              }}
                  disabled={!product.available}
            >
                  {product.available ? 'Add' : 'Unavailable'}
            </Button>
              </span>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ProductCard;
