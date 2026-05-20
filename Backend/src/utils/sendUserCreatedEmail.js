import nodemailer from "nodemailer";

export const sendUserCreatedEmail = async (email, ticket) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Helpdesk" <${process.env.EMAIL}>`,
      to: email, // Dynamic user email
      subject: "🎫 Your Support Ticket Has Been Created",
      html: `
        <h3>Ticket Created Successfully</h3>
        <p><b>Title:</b> ${ticket.title}</p>
        <p><b>Description:</b> ${ticket.description}</p>
        <p><b>Priority:</b> ${ticket.priority}</p>
        <p><b>Status:</b> ${ticket.status}</p>
        <p><b>Ticket ID:</b> ${ticket._id}</p>
        <br />
        <p>Our technicians will look into this shortly. You can track the status on your dashboard.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ User creation email sent successfully");
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};
