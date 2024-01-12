"use client";
import React from "react";

const LeadForm = () => {
  const submitForm = () => {
    // Add your form submission logic here
  };

  return (
    <div id="popup" className="popup">
      <h2 className="mb-10">Contact Form</h2>
      <form id="contactForm">
        <label htmlFor="name">Your Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" required />

        <label htmlFor="address">Address:</label>
        <input type="text" id="address" name="address" required />

        <label htmlFor="provider">Current Utility Provider:</label>
        <input type="text" id="provider" name="provider" required />

        <label htmlFor="averagebill">Average Monthly Bill:</label>
        <input type="text" id="averagebill" name="averagebill" required />

        <label htmlFor="county">County:</label>
        <input type="text" id="county" name="county" readOnly />
        <button type="button" onClick={submitForm}>
          Submit
        </button>
      </form>

      <div id="successMessage" style={{ display: "none" }}>
        We will contact you shortly.
      </div>
    </div>
  );
};

export default LeadForm;
