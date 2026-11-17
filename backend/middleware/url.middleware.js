import jwt from 'jsonwebtoken';

export const verifyActivationToken = (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(401).json({
                message: "Activation token is required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.type !== 'activate') {
            return res.status(401).json({
                message: "Invalid activation token"
            });
        }

        req.userId = decoded.id;

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Activation link has expired"
            });
        }

        return res.status(401).json({
            message: "Invalid activation token"
        });
    }
};

export const verifyResetToken = (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(401).json({
                message: "Reset token is required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.type !== 'reset') {
            return res.status(401).json({
                message: "Invalid reset token"
            });
        }

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
