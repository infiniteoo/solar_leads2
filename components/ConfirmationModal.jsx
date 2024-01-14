// ConfirmationModal.js
import React from "react";

const ConfirmationModal = ({ isOpen, onClose, isSuccess, message }) => {
  return (
    <div className={`modal ${isOpen ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className={`modal-body ${isSuccess ? "success" : "error"}`}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
