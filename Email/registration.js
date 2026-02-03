module.exports = function registration(firstName, lastName) {
  return `
    <html>
      <body>
          <h2>Welcome to FarmFlow, ${firstName} ${lastName}!</h2>
        <p>We're glad to have you onboard. Start buying and selling fresh produce now.</p>
        <p>Visit our marketplace anytime. Happy farming! 🌱</p>
        <br/>
        <p>Best regards,<br/>FarmFlow Team</p>
      </body>
    </html>
  `;
};
