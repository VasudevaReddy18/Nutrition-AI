import React, { useState } from 'react';
import ChatUI from './components/ChatUI';
import UserProfileForm from './components/UserProfileForm';
import { saveUserProfile, getMealPlan } from './api';

const initialMessages = [
  { role: 'assistant', content: 'Welcome! Please fill out your profile to get started.' }
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileSave = async (profileData) => {
    setLoading(true);
    try {
      await saveUserProfile(profileData);
      setProfile(profileData);
      setMessages([{ role: 'assistant', content: 'Profile saved! You can now chat with the assistant or type "meal plan" to get your plan.' }]);
    } catch (e) {
      setMessages([{ role: 'assistant', content: 'Error saving profile: ' + e.message }]);
    }
    setLoading(false);
  };

  const handleSend = async (input) => {
    setMessages(msgs => [...msgs, { role: 'user', content: input, timestamp: new Date().toISOString() }]);
    if (!profile) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Please fill out your profile first.' }]);
      return;
    }
    setLoading(true);
    try {
      if (input.toLowerCase().includes('meal plan')) {
        const res = await getMealPlan(profile.user_id);
        setMessages(msgs => [...msgs, { role: 'assistant', content: res.meal_plan + '\n' + res.explanation, timestamp: new Date().toISOString() }]);
      } else {
        setMessages(msgs => [...msgs, { role: 'assistant', content: 'Type "meal plan" to get a plan or ask a nutrition question.', timestamp: new Date().toISOString() }]);
      }
    } catch (e) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Error: ' + e.message, timestamp: new Date().toISOString() }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ maxWidth: 500, margin: '2rem auto', display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Enter user ID..."
          value={userId}
          onChange={e => setUserId(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          disabled={!!profile}
        />
      </div>
      {!profile && userId ? (
        <UserProfileForm userId={userId} onSave={handleProfileSave} loading={loading} />
      ) : (
        <ChatUI onSend={handleSend} messages={messages} loading={loading} />
      )}
    </div>
  );
}

export default App;
