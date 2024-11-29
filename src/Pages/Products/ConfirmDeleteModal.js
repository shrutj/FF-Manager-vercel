import React from 'react';
import Modal from 'react-modal';
import '../Styles/Products/ConfirmDeleteModal.css'; // Adjust this path as necessary

const ConfirmDeleteModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-overlay" overlayClassName="overlay">
    <div className='modal-content'>
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this item?</p>
      <button onClick={onConfirm} className="confirm-button">Yes, Delete</button>
      <button onClick={onRequestClose} className="cancel-button">Cancel</button>
    </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
