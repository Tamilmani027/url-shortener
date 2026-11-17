const sendMail = async (to, subject, text, html) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Auth System', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      textContent: text,
      ...(html ? { htmlContent: html } : {}),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to send email (${response.status}): ${details}`);
  }
};

export default sendMail;
