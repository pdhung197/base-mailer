require("dotenv").config({ path: __dirname + "/.env" });
const cors = require("cors");
// console.log(creds)

let express = require("express");
let app = express();
let nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const path = require("path");
const router = express.Router();

// Static folder
app.use(
  cors({
    origin: [
      "*localhost:3003*",
      "*viethealthydn.com*",
      "*thaidoc.online*",
      "*76.76.21.9:443*",
    ],
  })
);
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // service: 'Gmail',
  auth: {
    user: process.env["MAIL"],
    pass: process.env["APP_PASS"],
  },
});

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.post("/mail", (req, res, next) => {
  var email = req.body.email;
  var message = req.body.message;
  var subject = req.body.subject;
  var name = req.body.name;
  var company = req.body.company;

  const mailOptions = {
    from: name,
    to: email,
    subject: subject,
    html: `${name} from ${company} <noreply@${name}.com> <br /><br /> ${message}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        status: "err",
      });
      console.log(err);
    } else {
      res.json({
        status: "success",
      });
      console.log("Email Sent" + data.response);
    }
  });
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages!");
  }
});

// serve PORT running here
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.info(`server has started on ${PORT}`));
