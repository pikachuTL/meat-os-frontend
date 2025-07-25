import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  Grid,
  Fade,
  Slide,
  Avatar,
  Divider,
  LinearProgress,
  Alert,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  LocalShipping,
  Payment,
  Restaurant,
  Person,
  AccessTime,
  LocationOn,
  Phone,
  Directions,
  Close,
  Refresh,
  Timer,
  DeliveryDining
} from '@mui/icons-material';

const OrderTracking = ({ open, onClose, order }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deliveryPerson, setDeliveryPerson] = useState({
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    vehicle: 'Bike - HR26 AB 1234',
    rating: 4.8,
    photo: 'https://via.placeholder.com/50'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      label: 'Order Placed',
      description: 'Your order has been successfully placed',
      icon: <CheckCircle />,
      completed: true,
      time: order?.orderDate
    },
    {
      label: 'Confirmed',
      description: 'Order confirmed and payment processed',
      icon: <Payment />,
      completed: order?.status !== 'pending',
      time: order?.orderDate ? new Date(new Date(order.orderDate).getTime() + 2 * 60 * 1000) : null
    },
    {
      label: 'Preparing',
      description: 'Your order is being prepared in our kitchen',
      icon: <Restaurant />,
      completed: ['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order?.status),
      time: order?.orderDate ? new Date(new Date(order.orderDate).getTime() + 5 * 60 * 1000) : null
    },
    {
      label: 'Out for Delivery',
      description: 'Your order is on its way to you',
      icon: <LocalShipping />,
      completed: ['ready', 'out_for_delivery', 'delivered'].includes(order?.status),
      time: order?.orderDate ? new Date(new Date(order.orderDate).getTime() + 15 * 60 * 1000) : null
    },
    {
      label: 'Delivered',
      description: 'Your order has been delivered successfully',
      icon: <Person />,
      completed: order?.status === 'delivered',
      time: order?.status === 'delivered' ? new Date() : null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'primary';
      case 'out_for_delivery': return 'secondary';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Delivery';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Order Placed';
    }
  };

  const getEstimatedDeliveryTime = () => {
    if (!order?.orderDate) return null;
    const orderTime = new Date(order.orderDate);
    const estimatedTime = new Date(orderTime.getTime() + 45 * 60 * 1000); // 45 minutes
    return estimatedTime;
  };

  const getTimeRemaining = () => {
    const estimatedTime = getEstimatedDeliveryTime();
    if (!estimatedTime) return null;
    
    const diff = estimatedTime - currentTime;
    if (diff <= 0) return 'Delivered';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOutForDelivery = ['ready', 'out_for_delivery', 'delivered'].includes(order?.status);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative'
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <Close />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Order Tracking
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Order #{order?._id?.slice(-8) || 'N/A'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Fade in={true} timeout={500}>
          <Box>
            {/* Order Status Header */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {getStatusText(order?.status)}
                </Typography>
                <Chip 
                  label={getStatusText(order?.status)} 
                  color="primary"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
              
              {/* Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Order Progress
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {Math.round(getProgressPercentage())}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getProgressPercentage()} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white'
                    }
                  }}
                />
              </Box>

              {/* Estimated Delivery */}
              {getEstimatedDeliveryTime() && order?.status !== 'delivered' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Estimated Delivery: {formatTime(getEstimatedDeliveryTime())}
                  </Typography>
                  {getTimeRemaining() && getTimeRemaining() !== 'Delivered' && (
                    <Chip 
                      label={getTimeRemaining()} 
                      size="small"
                      sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  )}
                </Box>
              )}
            </Paper>

            {/* Delivery Person Info */}
            {isOutForDelivery && (
              <Slide direction="up" in={true} timeout={600}>
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '2px solid #4CAF50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <DeliveryDining color="success" />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      Your Order is on the Way!
                    </Typography>
                  </Box>
                  
                  <Card sx={{ backgroundColor: '#f8f9fa' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar src={deliveryPerson.photo} sx={{ width: 50, height: 50 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {deliveryPerson.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {deliveryPerson.vehicle}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              Rating: {deliveryPerson.rating} ⭐
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Phone />}
                          size="small"
                          sx={{ flex: 1 }}
                        >
                          Call
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Directions />}
                          size="small"
                          sx={{ flex: 1 }}
                        >
                          Track
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Paper>
              </Slide>
            )}

            {/* Order Summary */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Customer:</strong> {order?.customerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Phone:</strong> {order?.customerPhone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> {order?.customerAddress}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Total Amount:</strong> ₹{order?.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Payment Method:</strong> {order?.paymentMethod}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Order Date:</strong> {order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Order Items */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Items
              </Typography>
              {order?.items?.map((item, index) => (
                <Slide direction="up" in={true} timeout={300 + index * 100} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none'
                  }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} x ₹{item.price} per {item.unit}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ₹{item.quantity * item.price}
                    </Typography>
                  </Box>
                </Slide>
              ))}
            </Paper>

            {/* Tracking Timeline */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Order Progress
                </Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              <Stepper orientation="vertical" sx={{ mt: 2 }}>
                {steps.map((step, index) => (
                  <Step key={step.label} active={step.completed} completed={step.completed}>
                    <StepLabel
                      StepIconComponent={() => 
                        step.completed ? (
                          <CheckCircle sx={{ color: 'success.main' }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ color: 'grey.400' }} />
                        )
                      }
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontWeight: step.completed ? 'bold' : 'normal'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          {step.label}
                        </Typography>
                        {step.time && (
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(step.time)}
                          </Typography>
                        )}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            {/* Help Section */}
            <Paper sx={{ p: 3, mt: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                If you have any questions about your order, please contact our customer support.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" size="small">
                  Contact Support
                </Button>
                <Button variant="outlined" size="small">
                  Report Issue
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderTracking; 