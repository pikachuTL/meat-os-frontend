import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid,
  Container,
  Fade,
  Slide,
  Grow,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PaymentModal from '../components/PaymentModal';
import OrderTracking from '../components/OrderTracking';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';

const API = 'https://meat-os-backend-production.up.railway.app/api/product';
const CATEGORY_API = 'https://meat-os-backend-production.up.railway.app/api/category';

const CustomerPage = ({ showNotification }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [orders, setOrders] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

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
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item._id === product._id);
      if (found) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, qty) => {
    setCart(cart =>
      cart.map(item =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart => cart.filter(item => item._id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category?._id === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleOrder = () => {
    if (!customer.name || !customer.phone || !customer.address) {
      showNotification('Please fill all customer details!', 'error');
      return;
    }
    if (cart.length === 0) {
      showNotification('Cart is empty!', 'error');
      return;
    }
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (order) => {
    showNotification('Order placed successfully!', 'success');
    setCart([]);
    setCustomer({ name: '', phone: '', address: '' });
    setPaymentMethod('COD');
    setPaymentModalOpen(false);
    // Add order to orders list
    setOrders(prev => [order, ...prev]);
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setTrackingOpen(true);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.filter(item => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const handlePaymentFailure = () => {
    showNotification('Order failed! Please try again.', 'error');
  };

  const getOrderData = () => ({
    customerName: customer.name,
    customerPhone: customer.phone,
    customerAddress: customer.address,
    items: cart.map(item => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit
    })),
    total,
    paymentMethod
  });

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
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
            Fresh Meat Delivery
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Order fresh, quality meat delivered to your doorstep
          </Typography>
        </Box>
      </Fade>

      {/* Search and Filter Section */}
      <Slide direction="up" in={true} timeout={1200}>
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
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
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.8)',
                    opacity: 1
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Tabs 
                value={selectedCategory} 
                onChange={(e, newValue) => setSelectedCategory(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.8)',
                    '&.Mui-selected': { color: 'white' }
                  },
                  '& .MuiTabs-indicator': { backgroundColor: 'white' }
                }}
              >
                <Tab label="All" value="all" />
                {categories.map(cat => (
                  <Tab key={cat._id} label={cat.name} value={cat._id} />
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    },
                    '& .MuiSelect-icon': { color: 'white' }
                  }}
                >
                  <option value="name" style={{ color: 'black' }}>Sort by Name</option>
                  <option value="price-low" style={{ color: 'black' }}>Price: Low to High</option>
                  <option value="price-high" style={{ color: 'black' }}>Price: High to Low</option>
                </TextField>
                
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          {/* Advanced Filters */}
          {showFilters && (
            <Fade in={showFilters} timeout={300}>
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </Typography>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.3)',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    ₹0
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    ₹1000
                  </Typography>
                </Box>
              </Box>
            </Fade>
          )}
        </Paper>
      </Slide>

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Wishlist Button */}
        <Tooltip title={`Wishlist (${wishlist.length} items)`}>
          <Badge badgeContent={wishlist.length} color="secondary">
            <Button
              variant="contained"
              onClick={() => setShowWishlist(!showWishlist)}
              sx={{
                borderRadius: '50%',
                width: 60,
                height: 60,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)'
                }
              }}
            >
              <FavoriteIcon />
            </Button>
          </Badge>
        </Tooltip>

        {/* Cart Button */}
        <Tooltip title={`Cart (${cart.length} items)`}>
          <Badge badgeContent={cart.length} color="error">
            <Button
              variant="contained"
              onClick={() => setCartOpen(!cartOpen)}
              sx={{
                borderRadius: '50%',
                width: 60,
                height: 60,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 4px 20px rgba(254, 107, 139, 0.4)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 25px rgba(254, 107, 139, 0.6)'
                }
              }}
            >
              <ShoppingCartIcon />
            </Button>
          </Badge>
        </Tooltip>
      </Box>

      <Grid container spacing={4}>
        {/* Products Section */}
        <Grid item xs={12} lg={cartOpen ? 8 : 12}>
          <Grow in={true} timeout={1500}>
            <Grid container spacing={3}>
              {filteredProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard 
                    product={product} 
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={isInWishlist(product._id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grow>
          
          {filteredProducts.length === 0 && (
            <Fade in={true} timeout={1000}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found matching your search.
                </Typography>
              </Box>
            </Fade>
          )}
        </Grid>
        {/* Cart Section */}
        {cartOpen && (
          <Slide direction="left" in={cartOpen} timeout={300}>
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3, borderRadius: 3, height: 'fit-content', position: 'sticky', top: 20 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Your Cart ({cart.length} items)
                  </Typography>
                </Box>
                
                {cart.length === 0 ? (
                  <Fade in={true} timeout={500}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Your cart is empty
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add some products to get started!
                      </Typography>
                    </Box>
                  </Fade>
                ) : (
                  <Fade in={true} timeout={500}>
                    <Box>
                      {cart.map((item, index) => (
                        <Slide direction="up" in={true} timeout={300 + index * 100}>
                          <Card key={item._id} sx={{ mb: 2, borderRadius: 2 }}>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    ₹{item.price} per {item.unit}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                                    sx={{ backgroundColor: 'grey.100' }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  
                                  <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                                    {item.quantity}
                                  </Typography>
                                  
                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    sx={{ backgroundColor: 'primary.light', color: 'white' }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                  
                                  <IconButton
                                    size="small"
                                    onClick={() => removeFromCart(item._id)}
                                    sx={{ backgroundColor: 'error.light', color: 'white' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              
                              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                                ₹{item.price * item.quantity}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Slide>
                      ))}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          Total: ₹{total}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Delivery Details
                      </Typography>
                      
                      <TextField
                        label="Full Name"
                        fullWidth
                        value={customer.name}
                        onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Phone Number"
                        fullWidth
                        value={customer.phone}
                        onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Delivery Address"
                        fullWidth
                        multiline
                        rows={3}
                        value={customer.address}
                        onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))}
                        sx={{ mb: 3 }}
                      />
                      
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleOrder}
                        startIcon={<PaymentIcon />}
                        sx={{
                          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Proceed to Payment
                      </Button>
                    </Box>
                  </Fade>
                )}
              </Paper>
            </Grid>
          </Slide>
        )}
      </Grid>

      {/* Wishlist Section */}
      {showWishlist && (
        <Slide direction="up" in={showWishlist} timeout={1800}>
          <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Your Wishlist ({wishlist.length} items)
            </Typography>
            {wishlist.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <FavoriteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Your wishlist is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add some products to your wishlist!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {wishlist.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Slide direction="up" in={true} timeout={500 + index * 200}>
                      <Card sx={{ 
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {product.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => toggleWishlist(product)}
                              sx={{ color: 'error.main' }}
                            >
                              <FavoriteIcon />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {product.description}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                            ₹{product.price} per {product.unit}
                          </Typography>
                          
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => addToCart(product)}
                            startIcon={<AddIcon />}
                            sx={{
                              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)'
                              }
                            }}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Slide>
      )}

      {/* Order History Section */}
      {orders.length > 0 && (
        <Slide direction="up" in={true} timeout={1800}>
          <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Your Orders
            </Typography>
            <Grid container spacing={2}>
              {orders.map((order, index) => (
                <Grid item xs={12} md={6} lg={4} key={order._id || index}>
                  <Slide direction="up" in={true} timeout={500 + index * 200}>
                    <Card sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Order #{order._id?.slice(-8) || 'N/A'}
                          </Typography>
                          <Chip 
                            label={order.status || 'Pending'} 
                            color={order.status === 'delivered' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Customer:</strong> {order.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Total:</strong> ₹{order.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Items:</strong> {order.items?.length || 0} items
                        </Typography>
                        
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleTrackOrder(order)}
                            sx={{ flex: 1 }}
                          >
                            Track Order
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Slide>
      )}

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderData={getOrderData()}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />

      <OrderTracking
        open={trackingOpen}
        onClose={() => setTrackingOpen(false)}
        order={trackingOrder}
      />
    </Container>
  );
};

export default CustomerPage;