import React, { useState } from "react";
import dotenv from "dotenv";
import emailjs from "@emailjs/browser";

dotenv.config();
// Component for the LeadForm
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const mailOptions = {
        from: "davidgoldsolar@outlook.com",
        to: "davidgoldsolar@outlook.com",
        subject: "New Form Submission",
        text: `
          County: ${county}
          Name: ${formData.name}
          Email: ${formData.email}
          Phone: ${formData.phone}
          Address: ${formData.address}
          Provider: ${formData.provider}
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
            console.log(
              "Thank you. I will get back to you as soon as possible."
            );
          },
          (error) => {
            console.error(error);

            console.log("Ahh, something went wrong. Please try again.");
          }
        );

      /* // Make an API request to the /api/send-email endpoint
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          county: county || "", // Add county to the form data
        }),
      });

      if (response.ok) {
        // Successful response
        const result = await response.json();
        console.log(result.message);
        // You can handle success accordingly, e.g., show a success message
      } else {
        // Error response
        const errorData = await response.json();
        console.error("Error submitting form:", errorData.error);
        // Handle the error, e.g., show an error message
      } */
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle unexpected errors, e.g., show a generic error message
    }
  };

  return (
    <div className="form popup">
      <h2 className="mb-10">Contact Form</h2>
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
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      {/* Add any additional elements or messages as needed */}
    </div>
  );
};

export default LeadForm;
