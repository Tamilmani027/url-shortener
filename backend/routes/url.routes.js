import express from 'express'
import { activateAccount, forgotPassword, login, register, resetPassword } from '../controllers/url.controllers.js';
import { verifyActivationToken, verifyResetToken } from '../middleware/url.middleware.js';

const route=express.Router();


route.post('/register',register);
route.post('/activate/:token',verifyActivationToken, activateAccount);
route.post('/login',login);
route.post('/forgot-password',forgotPassword);
route.post('/reset-password/:token',verifyResetToken, resetPassword);



export default route
