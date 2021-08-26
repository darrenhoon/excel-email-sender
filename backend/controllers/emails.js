const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

exports.requestPayment = (req, res, next) => {
  //console.log("All rows are here: ");
  //console.log(req.body);

  //let dataReceived = JSON.parse(req.body);

  for (let i = 0; i < req.body.length; i++) {
    if (i === 0) {
      continue;
    }

    let data = req.body[i];

    if (data.length === 0) {
      continue;
    }

    if (data[10] === "yes") {
      continue;
    } else {
      console.log("This has not been approved yet:");
      console.log(data);
      requestPaymentEmail(data);
    }
  }

  res.status(201).json({
    message: "payment request emails sent successfully!",
    studentData: req.body,
  });
};

exports.sendConfirmation = (req, res, next) => {
  //console.log("All rows are here: ");
  //console.log(req.body);

  for (let i = 0; i < req.body.length; i++) {
    if (i === 0) {
      continue;
    }

    let data = req.body[i];

    if (data.length === 0) {
      continue;
    }

    if (data[10] === "yes" && data[11] !== 'yes') {
      console.log("This has not been approved yet:");
      console.log(data);
      sendConfirmationEmail(data);
    } else {
      continue;
    }
  }

  res.status(201).json({
    message: "ticket confirmation emails sent successfully!",
    studentData: req.body,
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
    ticketNumber: excelRow[8],
    fullName: excelRow[1],
    tableNumber: excelRow[7],
    venue: excelRow[9],
  };
  const htmlToSend = template(replacements);

  var Transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //originally port 465
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

    /*
    attachments: [
      {
        filename: "freshmen-guide.pdf",
        path: path.join(
          __dirname,
          "..",
          "views",
          "freshmen-guide.pdf"
        ),
        contentType: 'application/pdf',
      },
    ],
    */
  };

  Transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log("Could not send Confirmation email!");
      console.log(error);
      throw new Error("Could not send Confirmation email!");
    } else {
      console.log("Confirmation email sent! Sent to: " + excelRow[3]);
    }
  });
};

const requestPaymentEmail = (excelRow) => {
  var mailOptions;
  let sender = "SoC Social Night 2021 Payment";

  let templatePath = path.join(
    __dirname,
    "..",
    "views",
    "payment-template.html"
  );
  const templateSource = fs.readFileSync(templatePath, "utf-8").toString();

  const template = handlebars.compile(templateSource);
  const replacements = {
    ticketNumber: excelRow[8],
    fullName: excelRow[1],
    tableNumber: excelRow[7],
    venue: excelRow[9],
    paymentLink: "https://nusfastpay.nus.edu.sg/SOCSOCIALNIGHTTicket",
    merchLink: "https://nusfastpay.nus.edu.sg/SOCSOCIALNIGHTMerch",
  };
  const htmlToSend = template(replacements);

  var Transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //originally port 465
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
    subject: "SoC Social Night 2021 Ticket Payment",
    html: htmlToSend,
    /*
    attachments: [

      {
        filename: "concert-background.jpg",
        path: path.join(
          __dirname,
          "..",
          "views",
          "concert-background.jpg"
        ),
        cid: "concertBackground",
      },
    ],
    */
  };
  Transport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log("Could not send Payment email!");
      console.log(error);
      throw new Error("Could not send Payment email!");
    } else {
      console.log("Payment email sent! sent to: " + excelRow[3]);
    }
  });
};
