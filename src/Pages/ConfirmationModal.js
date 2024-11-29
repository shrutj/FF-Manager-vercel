import React from 'react';
import './Styles/ConfirmationModal.css'

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h2>Confirmation</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={onConfirm} className="confirm-btn">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
