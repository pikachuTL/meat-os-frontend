import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/order';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(API).then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/${id}/status`, { paymentStatus: status });
    // Refresh orders
    const res = await axios.get(API);
    setOrders(res.data);
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto' }}>
      <h2>All Orders</h2>
      {orders.length === 0 && <div>No orders yet.</div>}
      {orders.map(order => (
        <div key={order._id} style={{ border: '1px solid #ccc', marginBottom: 20, padding: 16 }}>
          <b>Customer:</b> {order.customerName} <br />
          <b>Phone:</b> {order.customerPhone} <br />
          <b>Address:</b> {order.customerAddress} <br />
          <b>Order Time:</b> {new Date(order.createdAt).toLocaleString()} <br />
          <b>Total:</b> ₹{order.total} <br />
          <b>Payment:</b> {order.paymentMethod} <br />
          <b>Status:</b> 
          <select
            value={order.paymentStatus}
            onChange={e => updateStatus(order._id, e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
          </select>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.name} ({item.unit}) x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;