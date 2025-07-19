import React from 'react';
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
  Slide
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  LocalShipping,
  Payment,
  Restaurant,
  Person
} from '@mui/icons-material';

const OrderTracking = ({ open, onClose, order }) => {
  const steps = [
    {
      label: 'Order Placed',
      description: 'Your order has been successfully placed',
      icon: <CheckCircle />,
      completed: true
    },
    {
      label: 'Payment Confirmed',
      description: order?.paymentMethod === 'COD' ? 'Cash on Delivery - Pay when you receive' : 'Payment processed successfully',
      icon: <Payment />,
      completed: order?.paymentStatus === 'completed' || order?.paymentMethod === 'COD'
    },
    {
      label: 'Preparing',
      description: 'Your order is being prepared in our kitchen',
      icon: <Restaurant />,
      completed: order?.status === 'preparing' || order?.status === 'ready' || order?.status === 'delivered'
    },
    {
      label: 'Out for Delivery',
      description: 'Your order is on its way to you',
      icon: <LocalShipping />,
      completed: order?.status === 'ready' || order?.status === 'delivered'
    },
    {
      label: 'Delivered',
      description: 'Your order has been delivered successfully',
      icon: <Person />,
      completed: order?.status === 'delivered'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'primary';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

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
        textAlign: 'center'
      }}>
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
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={getStatusText(order?.status)} 
                      color={getStatusColor(order?.status)}
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Order Items */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Items
              </Typography>
              {order?.items?.map((item, index) => (
                <Slide direction="up" in={true} timeout={300 + index * 100}>
                  <Box key={index} sx={{ 
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Progress
              </Typography>
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
                      {step.label}
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