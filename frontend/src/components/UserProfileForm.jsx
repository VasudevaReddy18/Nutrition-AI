import React, { useState } from 'react';

const initialState = {
  age: '',
  gender: '',
  health_goals: '',
  allergies: '',
  preferences: '',
};

const UserProfileForm = ({ userId, onSave, loading }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) return;
    onSave({
      user_id: userId,
      age: Number(form.age),
      gender: form.gender,
      health_goals: form.health_goals.split(',').map(s => s.trim()).filter(Boolean),
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      preferences: form.preferences.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #e0e0e0', padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>User Profile</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Age:<br />
          <input type="number" name="age" value={form.age} onChange={handleChange} required min={1} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Gender:<br />
          <select name="gender" value={form.gender} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Health Goals (comma separated):<br />
          <input type="text" name="health_goals" value={form.health_goals} onChange={handleChange} placeholder="e.g. weight loss, muscle gain" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Allergies (comma separated):<br />
          <input type="text" name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. peanuts, gluten" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Preferences (comma separated):<br />
          <input type="text" name="preferences" value={form.preferences} onChange={handleChange} placeholder="e.g. vegetarian, low carb" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </label>
      </div>
      <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16 }}>
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};

export default UserProfileForm; 