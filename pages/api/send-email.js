import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mailgun from "mailgun-js";

dotenv.config();

const mg = mailgun({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN,
});

const handler = async (req, res) => {
  console.log("mg", mg);
  if (req.method === "POST") {
    console.log("req.body", req.body);
    /* try {
      const { county, name, email, phone, address, provider, averagebill } =
        req.body;

      // Create the email message
      const mailOptions = {
        from: "davidgoldsolar@yahoo.com",
        to: "davidgoldsolar@yahoo.com",
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

      const data = {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
      };

      mg.messages().send(data, (error, body) => {
        if (error) {
          console.error("Error sending email:", error);
          res
            .status(500)
            .json({ success: false, error: "Error sending email" });
        } else {
          console.log("Response:", body);
          res
            .status(200)
            .json({ success: true, message: "Email sent successfully" });
        }
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: "Error sending email" });
    } */
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
};

export default handler;
