import User from "../models/url.models.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendMail from '../utils/mail.js';
import { passwordReset } from "../services/sendMail.js";
import { nanoid } from 'nanoid';
import ShortUrl from '../models/shortUrl.model.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const activationToken = jwt.sign(
      { id: user._id, type: 'activate' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const activationLink =
      `${process.env.CLIENT_URL}/emailActivation/${activationToken}`;

    try {
      await sendMail(
        email,
        'Activate your account',
        `Hi ${name}, please activate your account using this link: ${activationLink}\n\nThis link expires in 24 hours.`,
        `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Activate your account</h2>
            <p>Hi ${name}, please activate your account by clicking the button below.</p>
            <a href="${activationLink}"
               style="background-color: #007bff;
                      color: white;
                      padding: 12px 20px;
                      text-decoration: none;
                      border-radius: 5px;
                      display: inline-block;">
              Activate Account
            </a>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        `
      );
    } catch (mailError) {
      console.error('Activation email failed:', mailError.message);
    }

    res.status(201).json({
      message: 'User registered successfully',
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const activateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.activated) {
      return res.status(200).json({
        success: true,
        message: 'Account is already activated'
      });
    }

    user.activated = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Account activated successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.activated!=true){
      return res.status(401).json({
        success:false,
        message:'Please activate the account through the mail'
      })

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
            { id: user._id, type: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token:token
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken = jwt.sign(
            { id: user._id, type: 'reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const resetLink =
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await passwordReset(email, resetLink);

        return res.status(200).json({
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const resetPassword = async (req, res) => {

    try {

        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const createShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required"
            });
        }

        let shortCode;
        let existingUrl = true;

        while (existingUrl) {
            shortCode = nanoid(8);
            existingUrl = await ShortUrl.findOne({ shortCode });
        }

        const shortUrlDoc = await ShortUrl.create({
            originalUrl,
            shortCode,
            user: req.userId
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        return res.status(201).json({
            message: "Short URL created successfully",
            data: {
                id: shortUrlDoc._id,
                originalUrl: shortUrlDoc.originalUrl,
                shortCode: shortUrlDoc.shortCode,
                shortUrl: `${baseUrl}/${shortUrlDoc.shortCode}`,
                clicks: shortUrlDoc.clicks
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const urlDoc = await ShortUrl.findOne({ shortCode });

        if (!urlDoc) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        urlDoc.clicks += 1;
        await urlDoc.save();

        return res.redirect(urlDoc.originalUrl);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


