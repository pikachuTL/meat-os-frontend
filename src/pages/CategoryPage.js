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
  ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LoadingSpinner from '../components/LoadingSpinner';

const API = 'https://meat-os-backend-production.up.railway.app/api/category';

const CategoryPage = ({ showNotification }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
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
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Category Management
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
                  disabled={submitting}
        />
              </Grid>
              <Grid item xs={12} sm={4}>
        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="image-upload"
                  accept="image/*"
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={submitting}
                    fullWidth
                  >
                    Choose Image
                  </Button>
                </label>
                {image && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {image.name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={submitting || !name}
                  fullWidth
                >
                  {submitting ? 'Adding...' : 'Add Category'}
                </Button>
              </Grid>
            </Grid>
      </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Categories ({categories.length})
          </Typography>
          <List>
        {categories.map(cat => (
              <ListItem key={cat._id} divider>
                <ListItemAvatar>
                  {cat.image ? (
                    <Avatar
                      src={`https://meat-os-backend-production.up.railway.app/${cat.image.replace(/\\/g, "/")}`}
                alt={cat.name}
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                      {cat.name.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={cat.name}
                  secondary={`ID: ${cat._id}`}
              />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDelete(cat._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          {categories.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No categories found. Add your first category above.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CategoryPage;
