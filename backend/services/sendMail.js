import sendMail from '../utils/mail.js';

export const passwordReset = async (email, resetLink) => {
    const text =
        `We received a request to reset your password.\n\n` +
        `Click the link below to reset it:\n${resetLink}\n\n` +
        `This link expires in 15 minutes.\n\n` +
        `If you didn't request this, please ignore this email.`;

    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>

            <p>We received a request to reset your password.</p>

            <p>Click the button below to reset your password:</p>

            <a href="${resetLink}"
               style="background-color: #007bff;
                      color: white;
                      padding: 12px 20px;
                      text-decoration: none;
                      border-radius: 5px;">
                Reset Password
            </a>

            <p>This link expires in 15 minutes.</p>

            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;

    try {
        await sendMail(
            email,
            'Password Reset Request',
            text,
            html
        );
    } catch (error) {
        console.error('Password reset email error:', error.message);
        throw error;
    }
};
