import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Fade,
  Slide,
  Grow,
  Chip,
  Divider,
  Container,
  InputAdornment,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ImageIcon from '@mui/icons-material/Image';
import LoadingSpinner from '../components/LoadingSpinner';

const API = 'https://meat-os-backend-production.up.railway.app/api/category';

const CategoryPage = ({ showNotification }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API);
        setCategories(res.data);
      } catch (error) {
        showNotification('Error loading categories', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [showNotification]);

  // Handle image selection with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
    const form = new FormData();
    form.append('name', name);
    if (image) form.append('image', image);

    await axios.post(API, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
      
    setName('');
    setImage(null);
      setImagePreview(null);
      const res = await axios.get(API);
      setCategories(res.data);
      showNotification('Category added successfully!', 'success');
    } catch (error) {
      showNotification('Error adding category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
    await axios.delete(`${API}/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      showNotification('Category deleted successfully!', 'success');
    } catch (error) {
      showNotification('Error deleting category', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading categories..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            Category Management
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Manage your meat categories and organize your products
          </Typography>
        </Box>
      </Fade>

      {/* Add Category Form */}
      <Slide direction="up" in={true} timeout={1200}>
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Add New Category
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                  }}
        />
              </Grid>
              
              <Grid item xs={12} md={4}>
        <input
          type="file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="image-upload"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={submitting}
                    fullWidth
                    startIcon={<ImageIcon />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Choose Image
                  </Button>
                </label>
                {image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'rgba(255,255,255,0.8)' }}>
                    Selected: {image.name}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={submitting || !name}
                  fullWidth
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#764ba2',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'white'
                    }
                  }}
                >
                  {submitting ? 'Adding...' : 'Add Category'}
                </Button>
              </Grid>
            </Grid>
      </form>

          {/* Image Preview */}
          {imagePreview && (
            <Fade in={true} timeout={500}>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                  Image Preview:
                </Typography>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: 200,
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                />
              </Box>
            </Fade>
          )}
        </Paper>
      </Slide>

      {/* Categories List */}
      <Slide direction="up" in={true} timeout={1500}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <RestaurantIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Categories ({categories.length})
            </Typography>
          </Box>

          {categories.length === 0 ? (
            <Alert severity="info" sx={{ textAlign: 'center', py: 4 }}>
              No categories found. Add your first category above to get started!
            </Alert>
          ) : (
            <Box
              sx={{
                display: { xs: 'flex', md: 'grid' },
                flexDirection: { xs: 'row', md: 'unset' },
                overflowX: { xs: 'auto', md: 'unset' },
                gap: 3,
                gridTemplateColumns: { md: 'repeat(3, 1fr)' },
                pb: { xs: 2, md: 0 },
                mb: 2
              }}
            >
              {categories.map((cat, index) => (
                <Box
                  key={cat._id}
                  sx={{
                    minWidth: { xs: 220, md: 'unset' },
                    flex: { xs: '0 0 auto', md: 'unset' },
                    maxWidth: { xs: 260, md: 'unset' }
                  }}
                >
                  <Grow in={true} timeout={800 + index * 200}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        {cat.image ? (
                          <Box
                            component="img"
                            src={`https://meat-os-backend-production.up.railway.app/uploads/${cat.image}`}
                alt={cat.name}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: 200,
                              backgroundColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <RestaurantIcon sx={{ fontSize: 60, color: 'white' }} />
                          </Box>
            )}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              backgroundColor: 'white'
                            }
                          }}
                          onClick={() => handleDelete(cat._id)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {cat.name}
                        </Typography>
                        <Chip 
                          label={`ID: ${cat._id.slice(-8)}`} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grow>
                </Box>
        ))}
            </Box>
          )}
        </Paper>
      </Slide>
    </Container>
  );
};

export default CategoryPage;
