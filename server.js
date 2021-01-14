const Express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

// INSTANCE CREATION
const app = Express();

// PARSE FORM DATA
app.use(bodyParser.json());

// CORS SETTINGS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//make the contact page the the first page on the app
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

// NODEMAILER SETTINGS

// Step 1: Set gmail credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Step 2: Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Step 3: Setup a route to receive email data from client then send it out
app.post("/send", (req, res) => {
  // Get mail data from client
  const mail = {
    from: req.body.email,
    to: process.env.EMAIL,
    subject: "Porfolio" + "-" + req.body.name,
    text: `Email address: ${req.body.email} \n ${req.body.message}`,
  };

  // Use sendMail
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Something went wrong.");
    } else {
      res
        .status(200)
        .json({ message: "Email successfully sent to recipient!" });
    }
  });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
