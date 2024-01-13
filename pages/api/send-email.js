const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const dotenv = require("dotenv");
import emailjs from "@emailjs/browser";

dotenv.config();

/* const mg = mailgun.client({ username: "api", key: process.env.MG_KEY }); */

const handler = async (req, res) => {
  console.log("mg", mg);
  if (req.method === "POST") {
    console.log("req.body", req.body);
    try {
      const { county, name, email, phone, address, provider, averagebill } =
        req.body;

      // Create the email message
      const mailOptions = {
        from: "davidgoldsolar@outlook.com",
        to: "davidgoldsolar@outlook.com",
        subject: "New Form Submission",
        text: `
          County: ${county}
          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          Address: ${address}
          Provider: ${provider}
          Average Monthly Bill: ${averagebill}
        `,
      };

      emailjs
        .send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          {
            from_name: `${name}`,
            to_name: "David Gold",
            from_email: mailOptions.from,
            to_email: mailOptions.to,
            message: mailOptions.text,
            subject: mailOptions.subject,
          },
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
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
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: "Error sending email" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
};

export default handler;
