const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendEmail = async ({ email, subject, message }) => {
  const htmlContent = `
  <html>
    <body>
      <h1>Hello!</h1>
      <p>${message}</p>
    </body>
  </html>
`;

  const info = await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject,
    html: htmlContent,
  });

  if (info.rejected.length !== 0) {
    return { success: false };
  }

  return { success: true };
};

const sendEmailViaApi = async ({ to, subject, message }) => {
  const htmlContent = `
    <html>
      <body>
        <h1>Hello!</h1>
        <p>${message}</p>
      </body>
    </html>
  `;

  const headers = {
    "Content-Type": "application/json",
    "api-key": process.env.BREVO_API_KEY,
  };

  const body = {
    sender: {
      name: "Nilotpaul Nandi",
      email: process.env.ADMIN_EMAIL,
    },
    to: [
      {
        email: to,
      },
    ],
    subject,
    htmlContent,
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    headers,
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.status !== 201) {
    return { success: false };
  }

  return { success: true };
};

module.exports = {
  sendEmail,
  sendEmailViaApi,
};
