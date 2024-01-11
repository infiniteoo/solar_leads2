import React from "react";

const LeadForm = () => {
  return (
    <div id="popup" class="popup">
      <h2 style="margin-bottom: 10px">Contact Form</h2>
      <form id="contactForm">
        <label for="name">Your Name:</label>
        <input type="text" id="name" name="name" required />

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" required />

        <label for="address">Address:</label>
        <input type="text" id="address" name="address" required />

        <label for="provider">Current Utility Provider:</label>
        <input type="text" id="provider" name="provider" required />

        <label for="averagebill">Average Monthly Bill:</label>
        <input type="text" id="averagebill" name="averagebill" required />

        <label for="county">County:</label>
        <input type="text" id="county" name="county" readonly />
        <button type="button" onclick="submitForm()">
          Submit
        </button>
      </form>

      <div id="successMessage" style="display: none">
        We will contact you shortly.
      </div>
    </div>
  );
};

export default LeadForm;
