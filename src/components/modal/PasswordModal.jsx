import React, { useState } from 'react';
import Modal from 'react-modal';

const PasswordModal = ({ isOpen, onClose, onPasswordSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '1') {
      onPasswordSubmit();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Password Modal">
      <h2>Enter Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </Modal>
  );
};

export default PasswordModal;
