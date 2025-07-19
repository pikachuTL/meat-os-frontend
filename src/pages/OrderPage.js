import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoadingSpinner from '../components/LoadingSpinner';

const API = 'https://meat-os-backend-production.up.railway.app/api/order';

const OrderPage = ({ showNotification }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API);
        setOrders(res.data);
      } catch (error) {
        showNotification('Error loading orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showNotification]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/${id}/status`, { paymentStatus: status });
      setOrders(orders.map(order => 
        order._id === id ? { ...order, paymentStatus: status } : order
      ));
      showNotification('Order status updated successfully!', 'success');
    } catch (error) {
      showNotification('Error updating order status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'info';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'paid': return 'Paid';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Order Management
      </Typography>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ py: 4 }}>
              No orders yet. Orders will appear here when customers place them.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order, index) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Order Header */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={getStatusText(order.paymentStatus)} 
                            color={getStatusColor(order.paymentStatus)}
                            size="small"
                          />
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={order.paymentStatus}
                              onChange={e => updateStatus(order._id, e.target.value)}
                              sx={{ height: 32 }}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="delivered">Delivered</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Customer Info */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          {order.customerName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                        <Typography variant="body2">
                          {order.customerPhone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1, color: 'primary.main', fontSize: 16, mt: 0.2 }} />
                        <Typography variant="body2">
                          {order.customerAddress}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Order Details */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {new Date(order.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {order.paymentMethod}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ₹{order.total}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Order Items ({order.items.length})
                      </Typography>
                      <List dense>
                        {order.items.map((item, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    {item.name}
                                  </Typography>
                                  <Typography variant="body2" color="primary" fontWeight="bold">
                                    ₹{item.price * item.quantity}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.quantity} x {item.unit} @ ₹{item.price}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrderPage;