import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import ConfirmationModal from "./ConfirmationModal";

const LeadForm = ({ county }) => {
  console.log(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    provider: "",
    averagebill: "",
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    isSuccess: false,
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, isSuccess: false, message: "" });
  };

  const handleSubmit = async () => {
    try {
      const mailOptions = {
        from: process.env.NEXT_PUBLIC_EMAIL_USER,
        to: process.env.NEXT_PUBLIC_EMAIL_USER,
        subject: "New Solar Lead Submission",
        text: `
          County: ${county}
          Name: ${formData.name}
          Email Address: ${formData.email}
          Phone Number: ${formData.phone}
          Physical Address: ${formData.address}
          Current Energy Provider: ${formData.provider}
          Average Monthly Bill: ${formData.averagebill}
        `,
      };

      emailjs
        .send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          {
            from_name: `${formData.name}`,
            to_name: "David Gold",
            from_email: mailOptions.from,
            to_email: mailOptions.to,
            message: mailOptions.text,
            subject: mailOptions.subject,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )
        .then(
          () => {
            setModalState({
              isOpen: true,
              isSuccess: true,
              message: "Thank you. I will get back to you as soon as possible.",
            });

            // Clear the form data and hide the contact form
            setFormData({
              name: "",
              email: "",
              phone: "",
              address: "",
              provider: "",
              averagebill: "",
            });

            setTimeout(() => {
              setModalState({ isOpen: false, isSuccess: false, message: "" });
            }, 3000);
          },
          (error) => {
            setModalState({
              isOpen: true,
              isSuccess: false,
              message: "Ahh, something went wrong. Please try again.",
            });
          }
        );
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalState({
        isOpen: true,
        isSuccess: false,
        message: "Error submitting form. Please try again.",
      });
    }
  };

  return (
    <div className="form popup">
      <h2 className="mb-10 text-5xl font-bold text-center">
        Get Your Personal Solar Quote
      </h2>
      <form>
        <label htmlFor="name">Your Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label htmlFor="provider">Current Utility Provider:</label>
        <input
          type="text"
          id="provider"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          required
        />

        <label htmlFor="averagebill">Average Monthly Bill:</label>
        <input
          type="text"
          id="averagebill"
          name="averagebill"
          value={formData.averagebill}
          onChange={handleChange}
          required
        />

        <label htmlFor="county">County:</label>
        <input
          type="text"
          id="county"
          name="county"
          value={county || ""}
          readOnly
        />
        <button type="button" onClick={handleSubmit} className="text-4xl">
          Submit
        </button>
      </form>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        isSuccess={modalState.isSuccess}
        message={modalState.message}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default LeadForm;
