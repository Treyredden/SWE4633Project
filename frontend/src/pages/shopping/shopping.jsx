import React, { useEffect, useState } from "react";
import { Product } from "./product";
import "./shopping.css";
import { useLocation } from 'react-router-dom';
import AWS from 'aws-sdk';
import { useNavigate } from 'react-router-dom';

export const Shopping = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Function to decode ID token
        const decodeIdToken = (idToken) => {
            const payload = idToken.split('.')[1];
            const decodedJson = Buffer.from(payload, 'base64').toString();
            const decoded = JSON.parse(decodedJson);
            return decoded;
        };

        // Extract code from URL and get user ID
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            const cognito = new AWS.CognitoIdentityServiceProvider({
                region: 'us-east-2',
            });

            const params = {
                ClientId: 'f4gcambofs9ikqe5mvrllhttm',
                Code: code,
                RedirectUri: 'http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/shopping',
                GrantType: 'authorization_code',
            };

            cognito.initiateAuth(params, function(err, data) {
                if (err) {
                    console.error(err);
                } else {
                    const idToken = data.AuthenticationResult.IdToken;
                    const accessToken = data.AuthenticationResult.AccessToken;
		    const userInfo = decodeIdToken(idToken);
                    setUserID(userInfo.sub);
		    setAccessToken(accessToken);
                }
            });
        }

        // Fetch products
        fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/product/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(error => console.error('Fetch error:', error));
    }, [location]);

    return (
        <div className='shopping'>
            <div className="shopTitle">
                <h1> AWS Grocery Web Application </h1>
            </div>
            <div className="products">
                {products.map((product) => {
                    return <Product key={product.id} data={product} />
                })}
            </div>
        </div>
    );
};

