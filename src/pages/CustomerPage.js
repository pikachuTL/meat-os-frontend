import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Box, Grid, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API = 'https://meat-os-backend-production.up.railway.app/api/product';
const CATEGORY_API = 'https://meat-os-backend-production.up.railway.app/api/category';

const CustomerPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);

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

  const handleOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      alert('Please fill all customer details!');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    const orderData = {
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
    };
    try {
      await axios.post('http://localhost:5000/api/order', orderData);
      alert('Order placed successfully!');
      setCart([]);
      setCustomer({ name: '', phone: '', address: '' });
      setPaymentMethod('COD');
    } catch (err) {
      alert('Order failed! Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <Box sx={{ maxWidth: 1100, margin: '40px auto' }}>
      <Typography variant="h4" align="center" gutterBottom>Meat-OS Customer Panel</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {categories.map(cat => (
            <Box key={cat._id} mb={3}>
              <Typography variant="h6">{cat.name}</Typography>
              <Grid container spacing={2}>
                {products
                  .filter(p => p.category?._id === cat._id)
                  .map(prod => (
                    <Grid item xs={12} sm={6} md={4} key={prod._id}>
                      <ProductCard product={prod} onAddToCart={addToCart} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Cart</Typography>
              {cart.length === 0 && <Typography>No items in cart.</Typography>}
              {cart.map(item => (
                <Box key={item._id} display="flex" alignItems="center" mb={1}>
                  <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={e => updateQuantity(item._id, Number(e.target.value))}
                    sx={{ width: 60, mx: 1 }}
                  />
                  <Typography>₹{item.price * item.quantity}</Typography>
                  <Button color="error" onClick={() => removeFromCart(item._id)}>Remove</Button>
                </Box>
              ))}
              {cart.length > 0 && (
                <>
                  <Typography sx={{ my: 2 }}><b>Total: ₹{total}</b></Typography>
                  <TextField
                    label="Name"
                    fullWidth
                    value={customer.name}
                    onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    value={customer.phone}
                    onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Address"
                    fullWidth
                    value={customer.address}
                    onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  <FormLabel component="legend">Payment Method</FormLabel>
                  <RadioGroup
                    row
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery (COD)" />
                    <FormControlLabel value="UPI" control={<Radio />} label="UPI (Coming Soon)" />
                  </RadioGroup>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={handleOrder}
                  >
                    Place Order
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerPage;