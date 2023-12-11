import React, { useEffect, useState } from "react";
import { Product } from "./product";
import "./shopping.css";
import { useLocation } from 'react-router-dom';
import AWS from 'aws-sdk';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

let userId = "";
let cartId = 0;

export const Shopping = () => {
    const [products, setProducts] = useState([]);
    const [user_Id, setUserId] = useState('');
    const [uuid, setUuid] = useState('');
    const [cart_Id, setCartId] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {


	// Fetch or create userID
    let uuid = localStorage.getItem('uuid');
    if (!uuid) {
        uuid = uuidv4(); // Generate a new UUID
        localStorage.setItem('uuid', uuid);
    }
    setUuid(uuid);
    
    console.log("UUID::::::");
    console.log(uuid);
    
    fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/user/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const filteredItems = data.filter(item => item.uuid === uuid)
        console.log('TESTING');
        console.log(filteredItems);
        if(filteredItems[0]){
            console.log("User exists");
            let UID = filteredItems[0].user_id;
            userId = UID;
        } else {
            console.log("User does not exist");
    
            fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uuid: uuid,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('User added:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    
            fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/user/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                const filteredItems = data.filter(item => item.uuid === uuid)  
                console.log("User exists");
                let UID = filteredItems[0].user_id;
                userId = UID;
            })
            .catch((error) => {
                console.error('Error:', error);
            })
        }
    })
        //getCartID or make one
        fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cart/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {

                console.log("USER ID")
                console.log(userId);
                const filteredCarts = data.filter(item => item.user === userId);
                if(filteredCarts[0]){
                    console.log("CONSOLE LOG SELECTED CARTS")
                    console.log(filteredCarts);
                    cartId = (filteredCarts[0].cart_id);
                    console.log("Cart ID is set");
                } else {
                    console.log("CART ID does not exist for this user");
    
                    fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cart/', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                },
                    body: JSON.stringify({
                    user: userId,
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Cart added:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

                
                }
                
            })
            .catch((error) => {
                console.error('Error:', error);
            })

            fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cart/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {

                console.log("USER ID")
                console.log(userId);
                const filteredCarts = data.filter(item => item.user === userId);
                    console.log("CONSOLE LOG SELECTED CARTS")
                    console.log(filteredCarts);
                    cartId = (filteredCarts[0].cart_id);
                    console.log("Cart ID is set");
                
            })
        
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


            //setUserId(userId);
            //setCartId(cartId);
    }, [location]);

    return (
        <div className='shopping'>
            <div className="shopTitle">
                <h1> AWS Grocery Web Application </h1>
            </div>
            <div className="products">
                {products.map((product) => {
                    return <Product key={product.id} data={product} userId={userId} cartId={cartId} />
                })}
            </div>
        </div>
    );
};

