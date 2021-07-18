const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");


exports.requestPayment = (req, res, next) => {

};

exports.sendConfirmation = (req, res, next) => {

  console.log("All rows are here: ");
  console.log(req.body);

  for (let i = 0; i < req.body.length; i++) {
    if (i === 0) { continue; }

    let data = req.body[i];

    if (data[6]) {
      continue;
    } else {
      console.log("This has not been approved yet:");
      console.log(data);
      sendConfirmationEmail(data);
    }
  }

  res.status(201).json({
        message: "confirmation emails sent successfully! Pending admin approval",
      });
};








/*
 * Emails with HTML Templating.
 * They use gmail's smtp service.
 * Might need to move to sendgrid / mailgun in the future if volume is a lot larger
 */

const sendConfirmationEmail = (excelRow) => {
  var mailOptions;
  let sender = "SoC Social Night 2021 Confirmation";

  let templatePath = path.join(
    __dirname,
    "..",
    "views",
    "ticket-template.html"
  );
  const templateSource = fs.readFileSync(templatePath, "utf-8").toString();

  const template = handlebars.compile(templateSource);
  const replacements = {
    ticketNumber: excelRow[0],
    firstName: excelRow[1],
    lastName: excelRow[2],
    tableNumber: excelRow[4],
    venue: excelRow[5],
  };
  const htmlToSend = template(replacements);

  var Transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: "SoCSocialNight2021@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  mailOptions = {
    from: sender,
    to: excelRow[3],
    subject: "SoC Social Night 2021 Attendance Confirmation",
    html: htmlToSend,
    attachments: [
      {
        filename: "concert-background.jpg",
        path: path.join(
          __dirname,
          "..",
          "views",
          "concert-background.jpg"
        ),
        cid: "ConcertBackground",
      },
    ],

  };

  Transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(
        "Could not send Confirmation email!"
      );
      console.log(error);
      throw new Error("Could not send Confirmation email!");
    } else {
      console.log("Notification email sent!");
    }
  });
};
