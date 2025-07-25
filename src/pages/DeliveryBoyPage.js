import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Fade,
  Slide,
  Grow,
  IconButton,
  Badge
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  AccessTime,
  LocationOn,
  Phone,
  Directions,
  Person,
  Motorcycle,
  ShoppingBag,
  DeliveryDining,
  Assignment,
  Timeline,
  Star,
  AttachMoney,
  Refresh
} from '@mui/icons-material';

const API_BASE = 'https://meat-os-backend-production.up.railway.app/api';

const DeliveryBoyPage = ({ showNotification }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryBoy, setDeliveryBoy] = useState(null); // holds profile from backend
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: '',
    vehicleNumber: ''
  });
  const [profileStatus, setProfileStatus] = useState('none'); // none, pending, approved, rejected
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    todayDeliveries: 0,
    rating: 4.8
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  // On mount, check if profile exists in localStorage and fetch from backend
  useEffect(() => {
    const saved = localStorage.getItem('deliveryBoyProfileId');
    if (saved) {
      fetchProfile(saved);
    }
  }, []);

  // Poll for approval if pending
  useEffect(() => {
    let interval;
    if (profileStatus === 'pending' && deliveryBoy && deliveryBoy._id) {
      interval = setInterval(() => fetchProfile(deliveryBoy._id), 5000);
    }
    return () => interval && clearInterval(interval);
  }, [profileStatus, deliveryBoy]);

  const fetchProfile = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/deliveryboy/${id}`);
      setDeliveryBoy(res.data);
      setProfileStatus(res.data.status);
      if (res.data.status === 'approved') {
        fetchData(res.data._id);
      }
    } catch (err) {
      setDeliveryBoy(null);
      setProfileStatus('none');
    }
  };

  const fetchData = async (id) => {
    try {
      setLoading(true);
      const [availableRes, assignedRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/delivery/available-orders`),
        axios.get(`${API_BASE}/delivery/assigned-orders/${id}`),
        axios.get(`${API_BASE}/delivery/stats/${id}`)
      ]);
      setAvailableOrders(availableRes.data);
      setAssignedOrders(assignedRes.data);
      setStats(statsRes.data);
    } catch (error) {
      setAvailableOrders([]);
      setAssignedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.phone || !profileForm.vehicleType || !profileForm.vehicleNumber) {
      showNotification('Please fill all profile fields', 'error');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/delivery/register`, profileForm);
      setDeliveryBoy(res.data.deliveryBoy);
      setProfileStatus('pending');
      localStorage.setItem('deliveryBoyProfileId', res.data.deliveryBoy._id);
      showNotification('Profile submitted for approval!', 'info');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error submitting profile', 'error');
    }
  };

  if (profileStatus === 'none') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Delivery Boy Profile Creation
          </Typography>
          <Box component="form" onSubmit={handleProfileSubmit} sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography>Name</Typography>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography>Phone</Typography>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography>Email (optional)</Typography>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography>Vehicle Type</Typography>
              <input
                type="text"
                name="vehicleType"
                value={profileForm.vehicleType}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography>Vehicle Number</Typography>
              <input
                type="text"
                name="vehicleNumber"
                value={profileForm.vehicleNumber}
                onChange={handleProfileChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                required
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Profile
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (profileStatus === 'pending') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Waiting for Admin Approval
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your profile is under review. Please wait for admin approval.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        </Paper>
      </Container>
    );
  }

  if (profileStatus === 'rejected') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom color="error">
            Profile Rejected
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your profile was rejected by admin. Please contact support or try again.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Only show dashboard if approved
  if (profileStatus === 'approved' && deliveryBoy) {
    const assignOrder = async (orderId) => {
      try {
        const response = await axios.post(`${API_BASE}/delivery/assign-order`, {
          orderId,
          deliveryBoyId: deliveryBoy._id
        });
        
        showNotification('Order assigned successfully!', 'success');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error assigning order:', error);
        showNotification('Failed to assign order', 'error');
      }
    };

    const pickOrder = async (orderId) => {
      try {
        const response = await axios.post(`${API_BASE}/delivery/pick-order`, {
          orderId,
          deliveryBoyId: deliveryBoy._id
        });
        
        showNotification('Order picked successfully!', 'success');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error picking order:', error);
        showNotification('Failed to pick order', 'error');
      }
    };

    const outForDelivery = async (orderId) => {
      try {
        const response = await axios.post(`${API_BASE}/delivery/out-for-delivery`, {
          orderId,
          deliveryBoyId: deliveryBoy._id
        });
        
        showNotification('Order out for delivery!', 'success');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error updating delivery status:', error);
        showNotification('Failed to update status', 'error');
      }
    };

    const deliverOrder = async (orderId) => {
      try {
        const response = await axios.post(`${API_BASE}/delivery/deliver-order`, {
          orderId,
          deliveryBoyId: deliveryBoy._id
        });
        
        showNotification('Order delivered successfully!', 'success');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error delivering order:', error);
        showNotification('Failed to deliver order', 'error');
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'ready': return 'warning';
        case 'assigned': return 'info';
        case 'picked': return 'primary';
        case 'out_for_delivery': return 'secondary';
        case 'delivered': return 'success';
        default: return 'default';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'ready': return 'Ready for Pickup';
        case 'assigned': return 'Assigned to You';
        case 'picked': return 'Picked Up';
        case 'out_for_delivery': return 'Out for Delivery';
        case 'delivered': return 'Delivered';
        default: return status;
      }
    };

    const getActionButton = (order) => {
      switch (order.orderStatus) {
        case 'ready':
          return (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Assignment />}
              onClick={() => assignOrder(order._id)}
              fullWidth
            >
              Accept Order
            </Button>
          );
        case 'assigned':
          return (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShoppingBag />}
              onClick={() => pickOrder(order._id)}
              fullWidth
            >
              Pick Up Order
            </Button>
          );
        case 'picked':
          return (
            <Button
              variant="contained"
              color="info"
              startIcon={<LocalShipping />}
              onClick={() => outForDelivery(order._id)}
              fullWidth
            >
              Start Delivery
            </Button>
          );
        case 'out_for_delivery':
          return (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => deliverOrder(order._id)}
              fullWidth
            >
              Mark as Delivered
            </Button>
          );
        default:
          return null;
      }
    };

    if (loading) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      );
    }

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Delivery Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your deliveries efficiently
            </Typography>
          </Box>
        </Fade>

        {/* Delivery Boy Profile */}
        <Slide direction="up" in={true} timeout={1200}>
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Person sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {deliveryBoy.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {deliveryBoy.vehicleType} - {deliveryBoy.vehicleNumber}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                      <Typography variant="body2">{deliveryBoy.rating} Rating</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.totalDeliveries}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Deliveries
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        ₹{stats.totalEarnings}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Earnings
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.todayDeliveries}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Today's Deliveries
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {assignedOrders.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Active Orders
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Slide>

        {/* Tabs */}
        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ 
              '& .MuiTab-root': { 
                fontWeight: 'bold',
                fontSize: '1rem'
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge badgeContent={availableOrders.length} color="error">
                    <Assignment />
                  </Badge>
                  Available Orders
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge badgeContent={assignedOrders.length} color="primary">
                    <LocalShipping />
                  </Badge>
                  My Deliveries
                </Box>
              } 
            />
          </Tabs>
        </Paper>

        {/* Available Orders Tab */}
        {activeTab === 0 && (
          <Fade in={true} timeout={800}>
            <Box>
              {availableOrders.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No orders available for delivery at the moment.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {availableOrders.map((order, index) => (
                    <Grid item xs={12} md={6} key={order._id}>
                      <Slide direction="up" in={true} timeout={500 + index * 200}>
                        <Card sx={{ 
                          borderRadius: 3,
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
                                label={getStatusText(order.orderStatus)} 
                                color={getStatusColor(order.orderStatus)}
                                size="small"
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Customer:</strong> {order.customerName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Phone:</strong> {order.customerPhone}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Address:</strong> {order.customerAddress}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Amount:</strong> ₹{order.total}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Phone />}
                                sx={{ flex: 1 }}
                              >
                                Call Customer
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Directions />}
                                sx={{ flex: 1 }}
                              >
                                Get Directions
                              </Button>
                            </Box>
                            
                            {getActionButton(order)}
                          </CardContent>
                        </Card>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        )}

        {/* My Deliveries Tab */}
        {activeTab === 1 && (
          <Fade in={true} timeout={800}>
            <Box>
              {assignedOrders.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  You don't have any active deliveries.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {assignedOrders.map((order, index) => (
                    <Grid item xs={12} md={6} key={order._id}>
                      <Slide direction="up" in={true} timeout={500 + index * 200}>
                        <Card sx={{ 
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: getStatusColor(order.orderStatus) + '.main',
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
                                label={getStatusText(order.orderStatus)} 
                                color={getStatusColor(order.orderStatus)}
                                size="small"
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Customer:</strong> {order.customerName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Phone:</strong> {order.customerPhone}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Address:</strong> {order.customerAddress}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Amount:</strong> ₹{order.total}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Phone />}
                                sx={{ flex: 1 }}
                              >
                                Call Customer
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Directions />}
                                sx={{ flex: 1 }}
                              >
                                Get Directions
                              </Button>
                            </Box>
                            
                            {getActionButton(order)}
                          </CardContent>
                        </Card>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        )}

        {/* Refresh Button */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
          <Button
            variant="contained"
            onClick={fetchData}
            startIcon={<Refresh />}
            sx={{
              borderRadius: '50%',
              width: 60,
              height: 60,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 25px rgba(33, 150, 243, 0.6)'
              }
            }}
          />
        </Box>
      </Container>
    );
  }
};

export default DeliveryBoyPage; 