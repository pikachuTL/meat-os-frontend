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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  Drawer,
  AppBar,
  Toolbar,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PaymentModal from '../components/PaymentModal';
import OrderTracking from '../components/OrderTracking';
import CategoryHero from '../components/CategoryHero';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryIcon from '@mui/icons-material/History';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import RefreshIcon from '@mui/icons-material/Refresh';
import RepeatIcon from '@mui/icons-material/Repeat';
import useMediaQuery from '@mui/material/useMediaQuery';

const API_BASE = "https://meat-os-backend-production.up.railway.app/api";
const CATEGORY_API = 'https://meat-os-backend-production.up.railway.app/api/category';

const CustomerPage = ({ showNotification, isAdminView = false }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ 
    name: '', 
    phone: '', 
    email: '',
    addresses: [],
    isVerified: false,
    profileComplete: false
  });
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
  
  // New features
  const [profileOpen, setProfileOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'home', address: '', label: '' });
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [orderSteps] = useState([
    'Order Placed',
    'Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered'
  ]);
  const [showCategoryHero, setShowCategoryHero] = useState(true);
  // Customer authentication states
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInPhone, setSignInPhone] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInName, setSignInName] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Show sign-in modal if not signed in
  // useEffect(() => {
  //   if (!customer?.isVerified || !customer?.phone) {
  //     setSignInOpen(true);
  //   }
  // }, [customer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE}/product`),
          axios.get(CATEGORY_API)
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        
        // Load customer data from localStorage
        const savedCustomer = localStorage.getItem('customerData');
        if (savedCustomer) {
          const parsedCustomer = JSON.parse(savedCustomer);
          setCustomer(parsedCustomer);
          setSelectedAddress(parsedCustomer.addresses.length > 0 ? 0 : -1);
        }
        
        // Load orders from localStorage
        const savedOrders = localStorage.getItem('customerOrders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save customer data to localStorage
  useEffect(() => {
    if (customer.name || customer.phone) {
      localStorage.setItem('customerData', JSON.stringify(customer));
    }
  }, [customer]);

  // Save orders to localStorage
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('customerOrders', JSON.stringify(orders));
    }
  }, [orders]);

  // On sign in, pre-fill profile dialog with customer data
  useEffect(() => {
    if (customer && customer.phone && customer.isVerified) {
      // Optionally open profile dialog automatically after sign in
      // setProfileOpen(true);
    }
  }, [customer]);

  // Fetch customer orders for reorder/history
  const fetchCustomerOrders = async () => {
    if (!customer.phone) return;
    try {
      const res = await axios.get(`https://meat-os-backend-production.up.railway.app/api/order/customer/${customer.phone}`);
      setOrders(res.data);
    } catch (err) {
      showNotification('Failed to fetch order history', 'error');
    }
  };

  // When reorder/history dialog opens, fetch orders
  useEffect(() => {
    if (orderHistoryOpen) {
      fetchCustomerOrders();
    }
    // eslint-disable-next-line
  }, [orderHistoryOpen, customer.phone]);

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
    setCartOpen(true); // Open cart popover/modal immediately
  };

  const updateQuantity = (id, qty) => {
    if (qty === 0) {
      removeFromCart(id);
      return;
    }
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
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

  const handleOrder = () => {
    try {
      if (cart.length === 0) {
        showNotification('Cart is empty!', 'error');
        return;
      }

      // Check if customer profile is complete
      if (!customer.name || !customer.phone) {
        showNotification('Please complete your profile first!', 'error');
        setProfileOpen(true);
        return;
      }

      // Check if customer is verified
      if (!customer.isVerified) {
        showNotification('Please verify your phone number first!', 'error');
        setOtpDialogOpen(true);
        return;
      }

      // Check if address is selected
      if (customer.addresses.length === 0) {
        showNotification('Please add a delivery address!', 'error');
        setAddressDialogOpen(true);
        return;
      }

      // Validate order data
      getOrderData(); // This will throw error if validation fails
      
      setPaymentModalOpen(true);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handlePaymentSuccess = (order) => {
    const orderWithTracking = {
      ...order,
      status: 'Order Placed',
      orderDate: new Date().toISOString(),
      trackingSteps: orderSteps,
      currentStep: 0,
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 minutes
    };
    
    showNotification('Order placed successfully!', 'success');
    setCart([]);
    setPaymentModalOpen(false);
    setOrders(prev => [orderWithTracking, ...prev]);
  };

  // handleTrackOrder: fetch latest order data from backend and show in modal
  const handleTrackOrder = async (order) => {
    try {
      const res = await axios.get(`https://meat-os-backend-production.up.railway.app/api/order/${order._id}`);
      setTrackingOrder(res.data);
    setTrackingOpen(true);
    } catch (err) {
      showNotification('Failed to fetch order details', 'error');
    }
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        const updated = prev.filter(item => item._id !== product._id);
        showNotification('Removed from wishlist!', 'info');
        return updated;
      } else {
        const updated = [...prev, product];
        showNotification('Added to wishlist!', 'success');
        return updated;
      }
    });
    setShowWishlist(true); // Open wishlist popover/modal immediately
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const handlePaymentFailure = () => {
    showNotification('Order failed! Please try again.', 'error');
  };

  const getOrderData = () => {
    // Validate required fields
    if (!customer.name || !customer.phone) {
      throw new Error('Customer name and phone are required');
    }
    
    if (customer.addresses.length === 0) {
      throw new Error('Delivery address is required');
    }
    
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    return {
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.addresses[selectedAddress]?.address || customer.addresses[0]?.address,
      items: cart.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit
      })),
      total,
      paymentMethod
    };
  };

  // Safe order data function for rendering
  const getSafeOrderData = () => {
    try {
      return getOrderData();
    } catch (error) {
      return {
        customerName: customer.name || '',
        customerPhone: customer.phone || '',
        customerAddress: customer.addresses[selectedAddress]?.address || customer.addresses[0]?.address || '',
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit
        })),
        total,
        paymentMethod
      };
    }
  };

  // OTP Verification
  const sendOTP = async () => {
    if (!customer.phone || customer.phone.length !== 10) {
      showNotification('Please enter a valid 10-digit phone number!', 'error');
      return;
    }

    setOtpLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('tempOTP', generatedOTP);
      
      // Show OTP in console for testing
      console.log('🔐 Demo OTP:', generatedOTP);
      
      showNotification(`OTP sent to ${customer.phone}! Check console for demo OTP: ${generatedOTP}`, 'success');
      setOtpDialogOpen(true);
    } catch (error) {
      showNotification('Failed to send OTP!', 'error');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = () => {
    const savedOTP = localStorage.getItem('tempOTP');
    if (otp === savedOTP) {
      setCustomer(prev => ({ ...prev, isVerified: true }));
      setOtpDialogOpen(false);
      setOtp('');
      localStorage.removeItem('tempOTP');
      showNotification('Phone number verified successfully!', 'success');
    } else {
      showNotification('Invalid OTP! Please try again.', 'error');
    }
  };

  const autoFillOTP = () => {
    const savedOTP = localStorage.getItem('tempOTP');
    if (savedOTP) {
      setOtp(savedOTP);
      showNotification('OTP auto-filled!', 'info');
    }
  };

  // Address Management
  const addAddress = () => {
    if (!newAddress.address.trim()) {
      showNotification('Please enter address!', 'error');
      return;
    }

    const addressToAdd = {
      ...newAddress,
      id: Date.now(),
      label: newAddress.label || newAddress.type
    };

    setCustomer(prev => ({
      ...prev,
      addresses: [...prev.addresses, addressToAdd]
    }));

    setNewAddress({ type: 'home', address: '', label: '' });
    setAddressDialogOpen(false);
    showNotification('Address added successfully!', 'success');
  };

  const removeAddress = (index) => {
    setCustomer(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
    showNotification('Address removed!', 'info');
  };

  // Profile Management
  const saveProfile = () => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      showNotification('Please fill all required fields!', 'error');
      return;
    }

    setCustomer(prev => ({
      ...prev,
      profileComplete: true
    }));
    setProfileOpen(false);
    showNotification('Profile saved successfully!', 'success');
  };

  // Add saveProfileToBackend function
  const saveProfileToBackend = async () => {
    if (!customer.name || customer.name.trim().length === 0) {
      showNotification('Full name is required', 'error');
      return;
    }
    try {
      const res = await axios.post('https://meat-os-backend-production.up.railway.app/api/auth/customer/update-profile', {
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        addresses: customer.addresses
      });
      setCustomer(res.data.customer);
      showNotification('Profile updated successfully!', 'success');
      setProfileOpen(false);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  // Category Selection
  const handleCategorySelect = (categoryId) => {
    // Map hero card id to actual category _id
    const found = categories.find(cat => cat.name.toLowerCase().includes(categoryId));
    if (found) {
      setSelectedCategory(found._id);
      setShowCategoryHero(false);
      showNotification(`Showing ${found.name} products!`, 'info');
    } else {
      setSelectedCategory('all');
      setShowCategoryHero(false);
      showNotification('Showing all products!', 'info');
    }
  };

  const handleSendOTP = async () => {
    if (!signInPhone || signInPhone.length !== 10) {
      setSignInError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setSignInLoading(true);
    setSignInError('');
    
    try {
      const response = await axios.post('https://meat-os-backend-production.up.railway.app/api/auth/customer/login', {
        phone: signInPhone,
        email: signInEmail,
        name: signInName
      });
      
      if (response.data.customer) {
        setCustomer(response.data.customer);
        localStorage.setItem('customer', JSON.stringify(response.data.customer));
        setSignInOpen(false);
        setSignInPhone('');
        setSignInEmail('');
        setSignInName('');
        showNotification('Successfully signed in!', 'success');
      }
    } catch (err) {
      setSignInError(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    // This function is no longer needed as we're doing direct login
  };

  const handleSignOut = () => {
    setCustomer({ name: '', phone: '', email: '', addresses: [], isVerified: false, profileComplete: false });
    localStorage.removeItem('customerData');
    setSignInOpen(true);
  };

  // Profile Button: open sign-in modal if not signed in
  const handleProfileOpen = () => {
    if (!customer?.isVerified || !customer?.phone) {
      setSignInOpen(true);
    } else {
      setProfileOpen(true);
    }
  };

  // handleReorder: add order items to cart and open cart/payment
  const handleReorder = (order) => {
    setCart(order.items.map(item => ({
      ...item,
      _id: item.product, // ensure product id is set for cart logic
      quantity: item.quantity
    })));
    setShowWishlist(false);
    setOrderHistoryOpen(false);
    setCartOpen(true);
    showNotification('Order added to cart! You can edit quantity and proceed to payment.', 'info');
  };

  const isMobile = useMediaQuery('(max-width:600px)');
  const [highlightedProductId, setHighlightedProductId] = useState(null);

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Admin View Notice */}
      {isAdminView && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Admin View:</strong> You are viewing the customer interface as an admin.
        </Alert>
      )}

      {/* Category Hero Section */}
      {showCategoryHero && (
        <CategoryHero onCategorySelect={handleCategorySelect} />
      )}

      {/* Header Section */}
      {!showCategoryHero && (
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
      )}

      {/* Search and Filter Section */}
      {!showCategoryHero && (
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
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => {
                      const newSortBy = e.target.value;
                      setSortBy(newSortBy);
                      
                      // Show notification based on sort type
                      switch (newSortBy) {
                        case 'price-low':
                          showNotification('Products sorted by price: Low to High', 'info');
                          break;
                        case 'price-high':
                          showNotification('Products sorted by price: High to Low', 'info');
                          break;
                        case 'name':
                          showNotification('Products sorted by name', 'info');
                          break;
                        default:
                          break;
                      }
                    }}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                      '& .MuiSelect-icon': { color: 'white' }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 200
                        }
                      }
                    }}
                  >
                    <MenuItem value="name">📝 Sort by Name</MenuItem>
                    <MenuItem value="price-low">💰 Price: Low to High</MenuItem>
                    <MenuItem value="price-high">💰 Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
                
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
      )}

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        {showCategoryHero ? (
          // Only show Profile button on CategoryHero page
          <Tooltip title="Profile">
            <Button
              variant="contained"
              onClick={handleProfileOpen}
              sx={{
                borderRadius: '50%',
                width: 56,
                height: 56,
                minWidth: 0,
                background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 25px rgba(76, 175, 80, 0.6)'
                }
              }}
            >
              <PersonIcon />
            </Button>
          </Tooltip>
        ) : (
          <>
            {/* Back to Categories Button */}
            <Tooltip title="Back to Categories">
              <Button
                variant="contained"
                onClick={() => setShowCategoryHero(true)}
                sx={{
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  minWidth: 0,
                  background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)',
                  boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 25px rgba(156, 39, 176, 0.6)'
                  }
                }}
              >
                <RestaurantIcon />
              </Button>
            </Tooltip>
            {/* Profile Button */}
            <Tooltip title="Profile">
              <Button
                variant="contained"
                onClick={handleProfileOpen}
                sx={{
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  minWidth: 0,
                  background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 6px 25px rgba(76, 175, 80, 0.6)'
                  }
                }}
              >
                <PersonIcon />
              </Button>
            </Tooltip>
            {/* Reorder Button */}
            <Tooltip title={customer.phone ? `Reorder (${orders.length} orders)` : "Sign in to view order history"}>
              <Badge badgeContent={customer.phone ? orders.length : 0} color="secondary">
                <Button
                  variant="contained"
                  onClick={() => {
                    if (customer.phone) {
                      setOrderHistoryOpen(true);
                    } else {
                      showNotification('Please sign in to view your order history', 'info');
                      setSignInOpen(true);
                    }
                  }}
                  disabled={!customer.phone}
                  sx={{
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    minWidth: 0,
                    background: customer.phone 
                      ? 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)'
                      : 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)',
                    boxShadow: customer.phone 
                      ? '0 4px 20px rgba(33, 150, 243, 0.4)'
                      : '0 4px 20px rgba(158, 158, 158, 0.4)',
                    '&:hover': {
                      transform: customer.phone ? 'scale(1.1)' : 'none',
                      boxShadow: customer.phone 
                        ? '0 6px 25px rgba(33, 150, 243, 0.6)'
                        : '0 4px 20px rgba(158, 158, 158, 0.4)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)',
                      color: 'rgba(255,255,255,0.7)'
                    }
                  }}
                >
                  <RepeatIcon />
                </Button>
              </Badge>
            </Tooltip>
            {/* Wishlist Button */}
            <Tooltip title={`Wishlist (${wishlist.length} items)`}>
              <Badge badgeContent={wishlist.length} color="secondary">
                <Button
                  variant="contained"
                  onClick={() => setShowWishlist(!showWishlist)}
                  sx={{
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    minWidth: 0,
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
                    width: 56,
                    height: 56,
                    minWidth: 0,
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
          </>
        )}
      </Box>

      {!showCategoryHero && (
        <Grid container spacing={4}>
          {/* Products Section */}
          <Grid item xs={12} lg={cartOpen ? 8 : 12}>
            {/* Products Header */}
            <Fade in={true} timeout={1000}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FE6B8B, #FF8E53)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  {selectedCategory === 'all' ? 'All Products' : 
                   categories.find(cat => cat._id === selectedCategory)?.name + ' Products'}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {filteredProducts.length} products available
                </Typography>
                
                {/* Quick Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${categories.length} Categories`} 
                    color="primary" 
                    variant="outlined"
                    icon={<CategoryIcon />}
                  />
                  <Chip 
                    label={`${wishlist.length} Wishlist`} 
                    color="secondary" 
                    variant="outlined"
                    icon={<FavoriteIcon />}
                  />
                  <Chip 
                    label={`${cart.length} Cart`} 
                    color="error" 
                    variant="outlined"
                    icon={<ShoppingCartIcon />}
                  />
                </Box>
              </Box>
            </Fade>

            {/* Products Grid */}
            <Grow in={true} timeout={1500}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {filteredProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id} sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                    <Box sx={{ width: { xs: '100%', sm: 320, md: 320 }, maxWidth: '100%' }}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={addToCart}
                      onToggleWishlist={toggleWishlist}
                      isInWishlist={isInWishlist(product._id)}
                      highlighted={highlightedProductId === product._id}
                      id={'product-' + product._id}
                    />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grow>
            
            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <Fade in={true} timeout={1000}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem',
                      color: 'white'
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    No products found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Try adjusting your search or filters to find what you're looking for.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setPriceRange([0, 1000]);
                    }}
                    startIcon={<RefreshIcon />}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Fade>
            )}
          </Grid>

        {/* Cart Section */}
        {cartOpen && (
          isMobile ? (
            <Dialog open={cartOpen} onClose={() => setCartOpen(false)} fullWidth maxWidth="xs">
              <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCartIcon sx={{ color: 'primary.main' }} />
                Your Cart ({cart.length} items)
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0, maxHeight: '70vh', overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Your cart is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add some products to get started!
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 2 }}>
                    {cart.map((item, index) => (
                      <Card sx={{ mb: 2, borderRadius: 2 }} key={item._id}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {item.image && (
                              <Box sx={{ mr: 2 }}>
                                <img
                                  src={`https://meat-os-backend-production.up.railway.app/uploads/${item.image}`}
                                  alt={item.name}
                                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                                />
                              </Box>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ₹{item.price} per {item.unit}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton size="small" onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))} sx={{ backgroundColor: 'grey.100' }}>
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography sx={{ minWidth: 30, textAlign: 'center' }}>{item.quantity}</Typography>
                              <IconButton size="small" onClick={() => updateQuantity(item._id, item.quantity + 1)} sx={{ backgroundColor: 'primary.light', color: 'white' }}>
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => removeFromCart(item._id)} sx={{ backgroundColor: 'error.light', color: 'white' }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                            ₹{item.price * item.quantity}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Total: ₹{total}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCartOpen(false)} color="secondary">Close</Button>
                <Button
                  variant="contained"
                  onClick={handleOrder}
                  disabled={!customer.name || !customer.phone || !customer.isVerified || customer.addresses.length === 0 || cart.length === 0}
                >
                  Proceed to Payment
                </Button>
              </DialogActions>
            </Dialog>
          ) : (
            <Slide direction="left" in={cartOpen} timeout={300}>
              <Grid item xs={12} lg={4}>
                <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, height: 'fit-content', position: 'sticky', top: 20, width: { xs: '100%', lg: 'auto' }, boxShadow: { xs: 2, md: 3 } }}>
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
                          <Slide direction="up" in={true} timeout={300 + index * 100} key={item._id}>
                            <Card sx={{ mb: 2, borderRadius: 2 }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  {item.image && (
                                    <Box sx={{ mr: 2 }}>
                                      <img
                                        src={`https://meat-os-backend-production.up.railway.app/uploads/${item.image}`}
                                        alt={item.name}
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                                      />
                                    </Box>
                                  )}
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
                        
                        {/* Customer Profile Status */}
                        <Box sx={{ mb: 3 }}>
                          {!customer.name || !customer.phone ? (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                              Please complete your profile to continue
                            </Alert>
                          ) : !customer.isVerified ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                              Please verify your phone number
                            </Alert>
                          ) : customer.addresses.length === 0 ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                              Please add a delivery address
                            </Alert>
                          ) : (
                            <Alert severity="success" sx={{ mb: 2 }}>
                              Ready to order!
                            </Alert>
                          )}
                          
                          {/* Selected Address Display */}
                          {customer.addresses.length > 0 && selectedAddress >= 0 && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f8ff', borderRadius: 2, border: '1px solid #2196F3' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#2196F3' }}>
                                📍 Delivery Address:
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                {customer.addresses[selectedAddress].type === 'home' ? <HomeIcon color="primary" /> : 
                                 customer.addresses[selectedAddress].type === 'work' ? <WorkIcon color="primary" /> : 
                                 <LocationOnIcon color="primary" />}
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {customer.addresses[selectedAddress].label}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {customer.addresses[selectedAddress].address}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        
                        <Button
                          variant="contained"
                          fullWidth={!!(window.innerWidth < 600)}
                          size="large"
                          onClick={handleOrder}
                          startIcon={<PaymentIcon />}
                          disabled={!customer.name || !customer.phone || !customer.isVerified || customer.addresses.length === 0}
                          sx={{
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            py: 1.5,
                            borderRadius: 2,
                            mt: { xs: 2, md: 0 },
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
          )
        )}
        </Grid>
      )}

      {/* Wishlist Section */}
      {showWishlist && (
        isMobile ? (
          <Dialog open={showWishlist} onClose={() => setShowWishlist(false)} fullWidth maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteIcon sx={{ color: 'primary.main' }} />
              Your Wishlist ({wishlist.length} items)
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, maxHeight: '70vh', overflowY: 'auto' }}>
              {wishlist.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FavoriteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Your wishlist is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add some products to your wishlist!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  {wishlist.map((product, index) => (
                    <Card sx={{ mb: 2, borderRadius: 2, cursor: 'pointer', boxShadow: highlightedProductId === product._id ? 6 : 1, border: highlightedProductId === product._id ? '2px solid #FE6B8B' : 'none' }} key={product._id} onClick={() => {
  setShowWishlist(false);
  setHighlightedProductId(product._id);
  setTimeout(() => {
    const el = document.getElementById('product-' + product._id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
  setTimeout(() => setHighlightedProductId(null), 3000);
}}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {product.image && (
                            <Box sx={{ mr: 2 }}>
                              <img
                                src={`https://meat-os-backend-production.up.railway.app/uploads/${product.image}`}
                                alt={product.name}
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                              />
                            </Box>
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ₹{product.price} per {product.unit}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => toggleWishlist(product)} sx={{ backgroundColor: 'error.light', color: 'white' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: 'primary.main' }}>
                          {product.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowWishlist(false)} color="secondary">Close</Button>
            </DialogActions>
          </Dialog>
        ) : (
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
        )
      )}

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="sm" fullWidth sx={{ px: { xs: 1, md: 3 } }}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6">Customer Profile</Typography>
            <Box sx={{ flex: 1 }} />
            <Button onClick={handleSignOut} color="error" variant="outlined" size="small">Sign Out</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Full Name *"
              fullWidth
              value={customer.name}
              onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Phone Number *"
              fullWidth
              value={customer.phone}
              onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email (Optional)"
              fullWidth
              value={customer.email}
              onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {/* Phone Verification Status */}
            {customer.phone && (
              <Box sx={{ mb: 2 }}>
                {customer.isVerified ? (
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    Phone number verified
                  </Alert>
                ) : (
                  <Alert severity="warning" action={
                    <Button color="inherit" size="small" onClick={sendOTP} disabled={otpLoading}>
                      {otpLoading ? <CircularProgress size={16} /> : 'Verify'}
                    </Button>
                  }>
                    Phone number not verified
                  </Alert>
                )}
              </Box>
            )}

            {/* Addresses Section */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>Delivery Addresses</Typography>
            {customer.addresses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <LocationOnIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  No addresses saved yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first delivery address
                </Typography>
              </Box>
            ) : (
              customer.addresses.map((address, index) => (
                <Card 
                  key={address.id} 
                  sx={{ 
                    mb: 2, 
                    p: 2,
                    cursor: 'pointer',
                    border: selectedAddress === index ? '2px solid #2196F3' : '1px solid #e0e0e0',
                    backgroundColor: selectedAddress === index ? '#f0f8ff' : 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#2196F3',
                      backgroundColor: '#f0f8ff',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                    }
                  }}
                  onClick={() => {
                    setSelectedAddress(index);
                    showNotification(`Selected address: ${address.label}`, 'success');
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {address.type === 'home' ? <HomeIcon color="primary" /> : 
                         address.type === 'work' ? <WorkIcon color="primary" /> : 
                         <LocationOnIcon color="primary" />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {address.label}
                        </Typography>
                        {selectedAddress === index && (
                          <Chip 
                            label="Selected" 
                            color="primary" 
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {address.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={selectedAddress === index ? "contained" : "outlined"}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAddress(index);
                          showNotification(`Selected address: ${address.label}`, 'success');
                        }}
                        startIcon={<LocationOnIcon />}
                        sx={{ 
                          minWidth: 'auto',
                          px: 2,
                          backgroundColor: selectedAddress === index ? '#2196F3' : 'transparent'
                        }}
                      >
                        {selectedAddress === index ? 'Selected' : 'Select'}
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAddress(index);
                        }}
                        color="error"
                        sx={{ 
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.2)'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))
            )}
            
            <Button
              variant="outlined"
              startIcon={<AddLocationIcon />}
              onClick={() => setAddressDialogOpen(true)}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add New Address
            </Button>
            
            {/* Address Selection Summary */}
            {customer.addresses.length > 0 && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  📍 Address Selection Summary:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Addresses: {customer.addresses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selected Address: {selectedAddress >= 0 ? customer.addresses[selectedAddress]?.label : 'None'}
                </Typography>
                {selectedAddress >= 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    "{customer.addresses[selectedAddress].address}"
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileOpen(false)}>Cancel</Button>
          <Button onClick={saveProfileToBackend} variant="contained">Save Profile</Button>
        </DialogActions>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)} maxWidth="xs" fullWidth sx={{ px: { xs: 1, md: 3 } }}>
        <DialogTitle>Verify Phone Number</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the 6-digit OTP sent to {customer.phone}
            </Typography>
            
            {/* Demo OTP Display */}
            <Box sx={{ 
              p: 2, 
              mb: 2, 
              backgroundColor: '#f0f8ff', 
              borderRadius: 2, 
              border: '2px dashed #2196F3',
              textAlign: 'center'
            }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                🔐 Demo OTP
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: '#2196F3',
                fontFamily: 'monospace',
                letterSpacing: 2
              }}>
                {localStorage.getItem('tempOTP') || '------'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This is a demo OTP for testing purposes
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <TextField
                label="Enter OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 6 }}
                placeholder="Enter 6-digit OTP"
              />
              <Button
                variant="outlined"
                onClick={autoFillOTP}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Auto Fill
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
          <Button onClick={verifyOTP} variant="contained">Verify OTP</Button>
        </DialogActions>
      </Dialog>

      {/* Add Address Dialog */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="sm" fullWidth sx={{ px: { xs: 1, md: 3 } }}>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Address Type</InputLabel>
              <Select
                value={newAddress.type}
                label="Address Type"
                onChange={(e) => {
                  const newType = e.target.value;
                  setNewAddress(prev => {
                    const updated = { ...prev, type: newType };
                    return updated;
                  });
                  
                  // Show notification based on address type
                  switch (newType) {
                    case 'home':
                      showNotification('Address type set to Home', 'info');
                      break;
                    case 'work':
                      showNotification('Address type set to Work', 'info');
                      break;
                    case 'other':
                      showNotification('Address type set to Other', 'info');
                      break;
                    default:
                      break;
                  }
                }}
              >
                <MenuItem value="home">🏠 Home</MenuItem>
                <MenuItem value="work">🏢 Work</MenuItem>
                <MenuItem value="other">📍 Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Address Label (Optional)"
              fullWidth
              value={newAddress.label}
              onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
              placeholder={newAddress.type === 'home' ? 'Home' : newAddress.type === 'work' ? 'Work' : 'Other'}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Full Address *"
              fullWidth
              multiline
              rows={3}
              value={newAddress.address}
              onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button onClick={addAddress} variant="contained">Add Address</Button>
        </DialogActions>
      </Dialog>

      {/* Reorder Dialog */}
      <Dialog open={orderHistoryOpen} onClose={() => setOrderHistoryOpen(false)} maxWidth="md" fullWidth sx={{ px: { xs: 1, md: 3 } }}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RepeatIcon color="primary" />
            <Typography variant="h6">Reorder</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {orders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No orders yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start shopping to see your order history!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              {orders.map((order, index) => (
                <Card key={order._id || index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Order #{order._id?.slice(-8) || 'N/A'}
                      </Typography>
                      <Chip 
                        label={
                          order.orderStatus === 'delivered' || order.paymentStatus === 'delivered'
                            ? 'Delivered'
                            : order.status || 'Pending'
                        }
                        color={
                          order.orderStatus === 'delivered' || order.paymentStatus === 'delivered'
                            ? 'success'
                            : 'warning'
                        }
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
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
                        onClick={() => handleReorder(order)}
                        startIcon={<RepeatIcon />}
                      >
                        Reorder
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleTrackOrder(order)}
                        startIcon={<LocalShippingIcon />}
                      >
                        Track Order
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Sign In/Sign Up Modal */}
      <Dialog open={signInOpen} disableEscapeKeyDown fullWidth maxWidth="xs" sx={{ px: { xs: 1, md: 3 } }}>
        <DialogTitle>Sign In to Continue</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Phone Number *"
              value={signInPhone}
              onChange={(e) => setSignInPhone(e.target.value)}
              placeholder="Enter 10-digit phone number"
              required
              disabled={signInLoading}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 10 }}
            />
            
            <TextField
              fullWidth
              label="Email (Optional)"
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={signInLoading}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Full Name (Optional)"
              value={signInName}
              onChange={(e) => setSignInName(e.target.value)}
              placeholder="Enter your full name"
              disabled={signInLoading}
              sx={{ mb: 2 }}
            />
            
            {signInError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {signInError}
              </Alert>
            )}
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleSendOTP}
              disabled={signInLoading || !signInPhone || signInPhone.length !== 10}
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                color: 'white',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)'
                }
              }}
            >
              {signInLoading ? 'Signing In...' : 'Sign In / Sign Up'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderData={getSafeOrderData()}
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