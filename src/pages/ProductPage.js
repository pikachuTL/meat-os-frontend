import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/product';
const CATEGORY_API = 'http://localhost:5000/api/category';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'kg',
    description: '',
    available: true,
    image: null
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get(API).then(res => setProducts(res.data));
    axios.get(CATEGORY_API).then(res => setCategories(res.data));
  }, [refresh]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFile = e => {
    setForm(f => ({ ...f, image: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'image' && value) data.append(key, value);
      else if (key !== 'image') data.append(key, value);
    });

    if (editingProduct) {
      // Update
      await axios.put(`${API}/${editingProduct._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditingProduct(null);
    } else {
      // Create
      await axios.post(API, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    setForm({
      name: '',
      category: '',
      price: '',
      unit: 'kg',
      description: '',
      available: true,
      image: null
    });
    setRefresh(r => !r);
  };

  const handleEdit = prod => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      category: prod.category?._id || prod.category,
      price: prod.price,
      unit: prod.unit,
      description: prod.description,
      available: prod.available,
      image: null
    });
  };

  const handleDelete = async id => {
    await axios.delete(`${API}/${id}`);
    setRefresh(r => !r);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: '',
      price: '',
      unit: 'kg',
      description: '',
      available: true,
      image: null
    });
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Product Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 8, padding: 6 }}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={{ marginRight: 8, padding: 6 }}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          style={{ marginRight: 8, padding: 6, width: 80 }}
        />
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          style={{ marginRight: 8, padding: 6 }}
        >
          <option value="kg">kg</option>
          <option value="gram">gram</option>
          <option value="pcs">pcs</option>
        </select>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ marginRight: 8, padding: 6 }}
        />
        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          /> Available
        </label>
        <input
          type="file"
          name="image"
          onChange={handleFile}
          style={{ marginRight: 8 }}
        />
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
        {editingProduct && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>Cancel</button>
        )}
      </form>
      <ul>
        {products.map(prod => (
          <li key={prod._id} style={{ marginBottom: 10 }}>
            <b>{prod.name}</b> ({prod.unit}) - ₹{prod.price} | {prod.category?.name}
            {prod.image && (
              <img
                src={`http://localhost:5000/${prod.image.replace(/\\/g, "/")}`}
                alt={prod.name}
                style={{ width: 60, height: 40, objectFit: 'cover', marginLeft: 10 }}
              />
            )}
            <button onClick={() => handleEdit(prod)} style={{ marginLeft: 16 }}>Edit</button>
            <button onClick={() => handleDelete(prod._id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPage;
