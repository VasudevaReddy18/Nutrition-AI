import React, { useState, useEffect, useRef } from 'react';

const AVATARS = {
  user: '🧑',
  assistant: '🤖',
};

const ChatUI = ({ onSend, messages, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', border: '1px solid #e0e0e0', borderRadius: 12, padding: 20, background: '#fafbfc', boxShadow: '0 2px 8px #e0e0e0' }}>
      <div style={{ minHeight: 240, marginBottom: 16, overflowY: 'auto', maxHeight: 350, background: '#fff', borderRadius: 8, padding: 12 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', margin: '12px 0' }}>
            <div style={{ fontSize: 28, margin: msg.role === 'user' ? '0 0 0 10px' : '0 10px 0 0' }}>{AVATARS[msg.role]}</div>
            <div>
              <div style={{ background: msg.role === 'user' ? '#e3f2fd' : '#e8f5e9', color: '#222', padding: '10px 14px', borderRadius: 10, minWidth: 60, maxWidth: 320, wordBreak: 'break-word', boxShadow: '0 1px 3px #eee' }}>
                {msg.content}
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {loading && <div style={{ color: '#888', margin: '8px 0' }}>🤖 AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }}
        />
        <button onClick={handleSend} disabled={!input.trim() || loading} style={{ padding: '10px 20px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, boxShadow: '0 1px 3px #e0e0e0' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI; 