import React, { useEffect, useState } from "react";
import { Product } from "./product";
import "./shopping.css";
import { useLocation } from 'react-router-dom';
import AWS from 'aws-sdk';

export const Shopping = () => {
    const [products, setProducts] = useState([]);
    const [userID, setUserID] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const location = useLocation();

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
                RedirectUri: 'https://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/shopping',
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

    const signOut = () => {
         const cognito = new AWS.CognitoIdentityServiceProvider({
             region: 'us-east-2',
         });

         const params = {
             AccessToken: accessToken,
         };

         cognito.globalSignOut(params, function(err, data) {
             if (err) {
                console.error(err);
             } else {
                 // Clear the user session data
                 setUserID(null);
                 setAccessToken(null);
                 // Redirect to login page or home page after successful sign-out
                 navigate('/');
             }
         });
    };

    return (
        <div className='shopping'>
            <div className="shopTitle">
                <h1> AWS Grocery Web Application </h1>
            </div>
            <div className="products">
                {products.map((product) => {
                    return <Product key={product.id} data={product} userID={userID} />
                })}
            </div>
        </div>
    );
};

