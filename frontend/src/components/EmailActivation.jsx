import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmailActivation = () => {

    const { token } = useParams();

    const [message, setMessage] = useState('Activating your account...');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {

        if (!token) {
            setMessage(
                "Please check your email and click the activation link to activate your account."
            );
            setLoading(false);
            setSuccess(false);
            return;
        }

        const activateAccount = async () => {

            try {
                const response = await axios.post(
                    `/activate/${encodeURIComponent(token)}`
                );

                setMessage(response.data.message);
                setSuccess(true);

            } catch (error) {

                setMessage(
                    error.response?.data?.message ||
                    "Account activation failed."
                );

                setSuccess(false);

            } finally {
                setLoading(false);
            }
        };

        activateAccount();

    }, [token]);

    return (
        <div>
            <h2>Email Activation</h2>

            <p>{message}</p>

            {!loading && success && (
                <Link to="/login">
                    Go to Login
                </Link>
            )}

            {!loading && !success && token && (
                <Link to="/register">
                    Register Again
                </Link>
            )}

            {!loading && !token && (
                <Link to="/login">
                    Go to Login
                </Link>
            )}

        </div>
    );
};

export default EmailActivation;