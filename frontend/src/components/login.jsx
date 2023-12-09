import { useEffect } from 'react';

export const Login = () => {

    useEffect(() => {
	window.location.href = 'https://swe4633group9cog.auth.us-east-2.amazoncognito.com/login?client_id=6f4gcambofs9ikqe5mvrllhttm&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fec2-18-221-168-153.us-east-2.compute.amazonaws.com%2Fshopping';
    }, []);

    return null;
};

export default Login;

