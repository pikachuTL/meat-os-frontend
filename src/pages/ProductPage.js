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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Paper,
  Fade,
  Slide,
  Grow,
  Container,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import InventoryIcon from '@mui/icons-material/Inventory';
import ImageIcon from '@mui/icons-material/Image';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import LoadingSpinner from '../components/LoadingSpinner';

const API = 'https://meat-os-backend-production.up.railway.app/api/product';
const CATEGORY_API = 'https://meat-os-backend-production.up.railway.app/api/category';

const ProductPage = ({ showNotification }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'kg',
    description: '',
    available: true,
    image: null
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(API),
          axios.get(CATEGORY_API)
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        showNotification('Error loading data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showNotification]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && value) data.append(key, value);
        else if (key !== 'image') data.append(key, value);
      });

      if (editingProduct) {
        // Update
        await axios.put(`${API}/${editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setEditingProduct(null);
        showNotification('Product updated successfully!', 'success');
      } else {
        // Create
        await axios.post(API, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Product added successfully!', 'success');
      }
      
      setForm({
        name: '',
        category: '',
        price: '',
        unit: 'kg',
        description: '',
        available: true,
        image: null
      });
      setImagePreview(null);
      setFormOpen(false);
      
      // Refresh data
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(API),
        axios.get(CATEGORY_API)
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      showNotification('Error saving product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = prod => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      category: prod.category?._id || prod.category,
      price: prod.price,
      unit: prod.unit,
      description: prod.description,
      available: prod.available,
      image: null
    });
    setImagePreview(null);
    setFormOpen(true);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`${API}/${id}`);
      setProducts(products.filter(prod => prod._id !== id));
      showNotification('Product deleted successfully!', 'success');
    } catch (error) {
      showNotification('Error deleting product', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: '',
      price: '',
      unit: 'kg',
      description: '',
      available: true,
      image: null
    });
    setImagePreview(null);
    setFormOpen(false);
  };

  const handleOpenForm = () => {
    setFormOpen(true);
    setEditingProduct(null);
    setForm({
      name: '',
      category: '',
      price: '',
      unit: 'kg',
      description: '',
      available: true,
      image: null
    });
    setImagePreview(null);
  };

  const handleToggleAvailable = async (prod) => {
    try {
      await axios.put(`${API}/${prod._id}`, { ...prod, available: !prod.available });
      const productsRes = await axios.get(API);
      setProducts(productsRes.data);
      showNotification('Product availability updated!', 'success');
    } catch (error) {
      showNotification('Failed to update availability', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
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
            Product Management
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Add and manage your meat products with images and details
          </Typography>
          
          {/* Add Product Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(254, 107, 139, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(254, 107, 139, 0.4)'
              }
            }}
          >
            Add Product
          </Button>
        </Box>
      </Fade>

      {/* Add/Edit Product Dialog */}
      <Dialog 
        open={formOpen} 
        onClose={handleCancelEdit} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
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
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Category</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={submitting}
                    startAdornment={
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
                      </InputAdornment>
                    }
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '& .MuiSelect-icon': { color: 'white' }
                    }}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="price"
                  label="Price (₹)"
                  value={form.price}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
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
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    disabled={submitting}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '& .MuiSelect-icon': { color: 'white' }
                    }}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="gram">gram</MenuItem>
                    <MenuItem value="pcs">pcs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      name="available"
                      checked={form.available}
                      onChange={handleChange}
                      disabled={submitting}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                          }
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  }
                  label="Available"
                  sx={{ color: 'rgba(255,255,255,0.9)' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  label="Description"
                  value={form.description}
                  onChange={handleChange}
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
              
              <Grid item xs={12} md={8}>
                <input
                  type="file"
                  onChange={handleFile}
                  style={{ display: 'none' }}
                  id="product-image-upload"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                />
                <label htmlFor="product-image-upload">
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
                    Choose Product Image
                  </Button>
                </label>
                {form.image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'rgba(255,255,255,0.8)' }}>
                    Selected: {form.image.name}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={editingProduct ? <EditIcon /> : <AddIcon />}
                    disabled={submitting || !form.name || !form.category || !form.price}
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
                    {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </Button>
                </Box>
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
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCancelEdit}
            disabled={submitting}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Products List */}
      <Slide direction="up" in={true} timeout={1500}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <InventoryIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Products ({products.length})
            </Typography>
          </Box>

          {products.length === 0 ? (
            <Alert severity="info" sx={{ textAlign: 'center', py: 4 }}>
              No products found. Click "Add Product" to get started!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {products.map((prod, index) => (
                <Grid item xs={12} sm={6} md={4} key={prod._id}>
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
                        {prod.image ? (
                          <Box
                            component="img"
                            src={`https://meat-os-backend-production.up.railway.app/uploads/${prod.image}`}
                            alt={prod.name}
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
                              backgroundColor: 'secondary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <InventoryIcon sx={{ fontSize: 60, color: 'white' }} />
                          </Box>
                        )}
                        
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                          <IconButton
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                backgroundColor: 'white'
                              }
                            }}
                            onClick={() => handleEdit(prod)}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                backgroundColor: 'white'
                              }
                            }}
                            onClick={() => handleDelete(prod._id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                            {prod.name}
                          </Typography>
                          <Chip 
                            label={prod.unit} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={prod.available}
                                onChange={() => handleToggleAvailable(prod)}
                                color="success"
                              />
                            }
                            label={prod.available ? 'Available' : 'Not Available'}
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                          ₹{prod.price}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Category: {prod.category?.name}
                        </Typography>
                        
                        {prod.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {prod.description}
                          </Typography>
                        )}
                        
                        <Chip 
                          label={prod.available ? 'Available' : 'Not Available'} 
                          size="small" 
                          color={prod.available ? 'success' : 'error'}
                          variant="filled"
                        />
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Slide>
    </Container>
  );
};

export default ProductPage;
