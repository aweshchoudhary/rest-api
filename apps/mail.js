const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const accessToken = oauth2Client.getAccessToken();

const mail = (email, loggedUser) => {
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAUTH2",
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const options = {
    from: process.env.EMAIL,
    to: email,
    subject: "Please Confirm Your Email From Awesh!!",
    html: `
            <h1>Email Confirmation</h1>
            <h2>Hello ${loggedUser.fullName} </h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href="http://localhost/api/user/verify/${loggedUser.confirmationCode}"> Click here</a>
            `,
  };

  smtpTransport.sendMail(options, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
};

module.exports = mail;
