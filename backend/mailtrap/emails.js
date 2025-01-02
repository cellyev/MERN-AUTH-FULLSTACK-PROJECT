const { mailtrapClient, sender } = require("./mailtrapConfig");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./emailTemplates");

exports.sendVerificationCode = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verification Code",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
  } catch (e) {
    console.error("Error sending verification code: ", e.message);
    throw new Error(`Error sending verification code: ${e.message}`);
  }
};

exports.sendWelcomeEmail = async (email, firstName) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "65904433-8cec-4897-b797-9d96cf23683f",
      template_variables: {
        company_info_name: "VALTECHNO",
        name: firstName,
        company_info_address: "Griya Medoho Asri",
        company_info_city: "Semarang",
        company_info_zip_code: "50198",
        company_info_country: "Indonesia",
      },
    });
  } catch (e) {
    console.error("Error sending welcome email: ", e.message);
    throw new Error(`Error sending welcome email: ${e.message}`);
  }
};

exports.sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      to: recipient,
      from: sender,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (e) {
    console.error("Error sending password reset email: ", e.message);
    throw new Error(`Error sending password reset email: ${e.message}`);
  }
};

exports.sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      to: recipient,
      from: sender,
      subject: "Password Reset Successful!",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Error sending password reset email: ", error.message);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};
