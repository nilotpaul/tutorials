const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { sendEmail, sendEmailViaApi } = require("./lib/email");

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const app = express();

// middlewares
app.use(
  cors({
    origin: ["http://localhost:5000"],
  })
);
app.use(express.json());

app.use("/api/email", async (req, res) => {
  const body = req.body;

  const email = body.email;

  if (!email) {
    return res.send("no email provided");
  }

  try {
    const { success } = await sendEmail({
      email,
      subject: "Test email",
      message: "This email is sent using nodemailer.",
    });

    if (!success) {
      return res.status(500).send("failed to send the email");
    }

    return res.send("email sent");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.post("/api/brevo", async (req, res) => {
  const body = req.body;

  const email = body.email;

  if (!email) {
    return res.send("no email provided");
  }

  try {
    const { success } = await sendEmailViaApi({
      to: email,
      subject: "Test email",
      message: "This email is sent using nodemailer.",
    });

    if (!success) {
      return res.status(500).send("failed to send the email");
    }

    return res.send("email sent");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
