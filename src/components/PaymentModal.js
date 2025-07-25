import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const PaymentModal = ({ open, onClose, orderData, onPaymentSuccess, onPaymentFailure }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TODO: Implement Razorpay payment when ready
  // const handleRazorpayPayment = async () => {
  //   // Razorpay payment implementation will be added later
  // };

  const handleCODPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate order data
      if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
        throw new Error('Please complete your profile and add delivery address');
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const response = await axios.post(
        'https://meat-os-backend-production.up.railway.app/api/order',
        {
          ...orderData,
          paymentMethod: 'COD'
        }
      );

      onPaymentSuccess(response.data.order);
      onClose();
    } catch (error) {
      console.error('COD order error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
      setError(errorMessage);
      onPaymentFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" align="center">
          Choose Payment Method
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            ₹{orderData.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Amount
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleCODPayment}
            disabled={loading}
            sx={{ 
              py: 2,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Cash on Delivery (COD)'
            )}
          </Button>

          <Button
            variant="outlined"
            size="large"
            disabled={true}
            sx={{ py: 2 }}
          >
            Pay Online (Coming Soon)
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          Online payment options coming soon!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal; 