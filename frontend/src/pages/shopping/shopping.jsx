import React, { useEffect, useState } from "react";
import { Product } from "./product";
import "./shopping.css";
import { useLocation } from 'react-router-dom';
import AWS from 'aws-sdk';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const Shopping = () => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
	// Fetch or create userID
	let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = uuidv4(); // Generate a new UUID
            localStorage.setItem('userId', userId);
        }
        setUserId(userId);
        
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
                    return <Product key={product.id} data={product} userId={userId} />
                })}
            </div>
        </div>
    );
};

