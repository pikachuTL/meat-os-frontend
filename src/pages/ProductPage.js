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
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingSpinner from '../components/LoadingSpinner';

const API = 'https://meat-os-backend-production.up.railway.app/api/product';
const CATEGORY_API = 'https://meat-os-backend-production.up.railway.app/api/category';

const ProductPage = ({ showNotification }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    setForm(f => ({ ...f, image: e.target.files[0] }));
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
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Product Management
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="price"
                  label="Price (₹)"
                  value={form.price}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="gram">gram</MenuItem>
                    <MenuItem value="pcs">pcs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      name="available"
                      checked={form.available}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  }
                  label="Available"
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
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <input
                  type="file"
                  onChange={handleFile}
                  style={{ display: 'none' }}
                  id="product-image-upload"
                  accept="image/*"
                />
                <label htmlFor="product-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={submitting}
                    fullWidth
                  >
                    Choose Product Image
                  </Button>
                </label>
                {form.image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {form.image.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={editingProduct ? <EditIcon /> : <AddIcon />}
                    disabled={submitting || !form.name || !form.category || !form.price}
                    fullWidth
                  >
                    {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </Button>
                  {editingProduct && (
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Products ({products.length})
          </Typography>
          <List>
            {products.map((prod, index) => (
              <React.Fragment key={prod._id}>
                <ListItem>
                  <ListItemAvatar>
                    {prod.image ? (
                      <Avatar
                        src={`https://meat-os-backend-production.up.railway.app/${prod.image.replace(/\\/g, "/")}`}
                        alt={prod.name}
                        sx={{ width: 56, height: 56 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.main' }}>
                        {prod.name.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {prod.name}
                        </Typography>
                        <Chip 
                          label={prod.unit} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={prod.available ? 'Available' : 'Not Available'} 
                          size="small" 
                          color={prod.available ? 'success' : 'error'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          ₹{prod.price} | {prod.category?.name}
                        </Typography>
                        {prod.description && (
                          <Typography variant="body2" color="text.secondary">
                            {prod.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleEdit(prod)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDelete(prod._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < products.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          {products.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No products found. Add your first product above.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductPage;
