import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Fade,
  Slide,
  Grow,
  Paper
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TimerIcon from '@mui/icons-material/Timer';

const CategoryHero = ({ onCategorySelect }) => {
  const categories = [
    {
      id: 'chicken',
      name: 'Fresh Chicken',
      description: 'Premium quality chicken cuts',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      color: '#FF6B6B',
      features: ['Fresh Daily', 'Hygienic', 'Premium Cuts']
    },
    {
      id: 'mutton',
      name: 'Fresh Mutton',
      description: 'Tender and flavorful mutton',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      color: '#4ECDC4',
      features: ['Premium Quality', 'Tender Cuts', 'Fresh Supply']
    },
    {
      id: 'fish',
      name: 'Fresh Fish',
      description: 'Delicious and healthy fish varieties',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80', // visually appealing fish image
      color: '#2196F3',
      features: ['Omega-3 Rich', 'Cleaned & Cut', 'Fresh Catch']
    },
    {
      id: 'prawns',
      name: 'Fresh Prawns',
      description: 'Juicy and succulent prawns',
      image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1000&q=80',
      color: '#FF9800',
      features: ['Juicy', 'Cleaned', 'Premium Quality']
    }
  ];

  return (
    <Box sx={{ py: 4, mb: 4 }}>
      {/* Hero Section */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Fresh Meat Categories
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Choose from our premium selection of fresh meat
          </Typography>
          
          {/* Features */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantIcon color="primary" />
              <Typography variant="body2">Fresh Daily</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon color="primary" />
              <Typography variant="body2">Fast Delivery</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon color="primary" />
              <Typography variant="body2">45 Min Delivery</Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Category Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 4
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={category.id}
            sx={{
              width: '100%'
            }}
          >
            <Slide direction="up" in={true} timeout={800 + index * 200}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    '& .category-image': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
                onClick={() => onCategorySelect(category.id)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={category.image}
                    alt={category.name}
                    className="category-image"
                    sx={{
                      transition: 'transform 0.3s ease',
                      filter: 'brightness(0.8)'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(45deg, ${category.color}80, ${category.color}40)`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: 'white'
                    }}
                  >
                    <Grow in={true} timeout={1200 + index * 300}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                          {category.description}
                        </Typography>
                        {/* Features */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                          {category.features.map((feature, featureIndex) => (
                            <Paper
                              key={featureIndex}
                              sx={{
                                px: 2,
                                py: 0.5,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 2,
                                border: '1px solid rgba(255,255,255,0.3)'
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {feature}
                              </Typography>
                            </Paper>
                          ))}
                        </Box>
                        <Button
                          variant="contained"
                          size="large"
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: category.color,
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            '&:hover': {
                              backgroundColor: 'white',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          Explore {category.name}
                        </Button>
                      </Box>
                    </Grow>
                  </Box>
                </Box>
              </Card>
            </Slide>
          </Box>
        ))}
      </Box>

      {/* Additional Info */}
      <Fade in={true} timeout={2000}>
        <Paper sx={{ p: 4, mt: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Why Choose Our Meat?
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 2
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <RestaurantIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Fresh Daily
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                All our meat is sourced fresh daily from trusted suppliers
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <LocalShippingIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Fast Delivery
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Get your order delivered within 45 minutes
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <TimerIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Quality Assured
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Premium quality meat with hygiene guarantee
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default CategoryHero; 