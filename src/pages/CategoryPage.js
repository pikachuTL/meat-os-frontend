import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://meat-os-backend-production.up.railway.app/api/category';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Fetch categories
  useEffect(() => {
    axios.get(API).then(res => setCategories(res.data));
  }, [refresh]);

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    if (image) form.append('image', image);

    await axios.post(API, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setName('');
    setImage(null);
    setRefresh(r => !r);
  };

  // Delete category
  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    setRefresh(r => !r);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Category Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ marginRight: 8, padding: 6 }}
        />
        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map(cat => (
          <li key={cat._id} style={{ marginBottom: 10 }}>
            <b>{cat.name}</b>
            {cat.image && (
              <img
                src={`http://localhost:5000/${cat.image.replace(/\\/g, "/")}`}
                alt={cat.name}
                style={{ width: 60, height: 40, objectFit: 'cover', marginLeft: 10 }}
              />
            )}
            <button onClick={() => handleDelete(cat._id)} style={{ marginLeft: 16 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
