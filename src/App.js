import React, { useState } from 'react';
import AdminLogin from './pages/AdminLogin';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';
import CustomerPage from './pages/CustomerPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [view, setView] = useState('customer'); // 'admin' or 'customer'
  const [adminTab, setAdminTab] = useState('category'); // 'category', 'product', 'order'

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setView('customer');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, margin: 16 }}>
        <button onClick={() => setView('customer')}>Customer Panel</button>
        <button onClick={() => setView('admin')}>Admin Panel</button>
        {isLoggedIn && view === 'admin' && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
      {view === 'admin' ? (
        isLoggedIn ? (
          <div>
            <h2 style={{ textAlign: 'center' }}>Admin Panel</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <button onClick={() => setAdminTab('category')}>Category</button>
              <button onClick={() => setAdminTab('product')}>Product</button>
              <button onClick={() => setAdminTab('order')}>Orders</button>
            </div>
            {adminTab === 'category' && <CategoryPage />}
            {adminTab === 'product' && <ProductPage />}
            {adminTab === 'order' && <OrderPage />}
          </div>
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )
      ) : (
        <CustomerPage />
      )}
    </div>
  );
}

export default App;