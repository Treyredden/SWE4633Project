import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './main.css';
import { v4 as uuidv4 } from 'uuid';

//const API_URL = 'http://localhost:8000/api';
const API_URL = 'http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cart/';

let userId = "";
let cartId = 0;

export const Cart = () => {
    const [items, setItems] = useState([]);
    const [uuid, setUuid] = useState('');

    useEffect(() => {
	// Fetch or create userID
        let uuid = localStorage.getItem('uuid');
        if (!uuid) {
            uuid = uuidv4(); // Generate a new UUID
            localStorage.setItem('uuid', uuid);
        }
        setUuid(uuid);
        
        //getUserID
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
                console.log("User exists");
                let UID = filteredItems[0].user_id;
                userId = UID;

            
        //getCartID 
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
                        console.log("Finding Carts")
                        console.log(filteredCarts);
                        cartId = (filteredCarts[0].cart_id);
                        console.log("Cart ID is set");
                        console.log(cartId);
                    


        //get the cartitems
        fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cartitem/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log("DATAAAAAAAAA");
                    console.log(data);
                    console.log(cartId);
                    const filteredCarts = data.filter(item => item.cart === cartId);
                        
                    let productId = [];

                    filteredCarts.forEach(cart => {
                        if (cart.product) {
                            productId.push(cart.product);
                        }
                    });

                    console.log("PRODUCTS ID");
                    console.log(productId);
            
            //get the list of actual products
            fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/product/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Products");
                    console.log(data);
                    console.log(cartId);
                    const filteredProducts = data.filter(item => productId.includes(item.product_id));

                    const resultWithDuplicates = productId.flatMap(id =>
                        filteredProducts.filter(item => item.product_id === id)
                      );

                    console.log("resultWithDuplicates");
                    console.log(resultWithDuplicates);
                    setItems(resultWithDuplicates);
                    
                })
                })

            })
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    
        
    }, []);

    const renderItems = () => {
        return items.map((item) => {
            return (
                <div className="item" key={item.product_id}> 
                    <div className="product-container">
                        <img src={item.image_url} alt={item.product_name} className="product-image" />
                        <div>
                            <p>{item.product_name}</p>
                            <p>Price: ${item.price}</p> {/* Use product_price instead of price */}
                        </div>
                        <button type="button" onClick={() => removeItem(item.product_id)}>Remove</button> 
                    </div>
                </div>
            );
        });
    };
    

    const removeItem = (pId) => {
        /*console.log('Removing item with id:', product_id);
        axios.delete(`${API_URL}/cartitem/${product_id}/`)
            .then(res => {
                setItems(prevItems => prevItems.filter((item) => item.product_id !== product_id));
                calculateTotalPrice();
            })
            .catch(err => {
                console.error(err);
            });*/

            fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cartitem/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {

                    const filteredCartItems = data.filter(item => item.product === pId);
                    const finalFilteredCartItems = filteredCartItems.filter(item => item.cart === cartId);
                    console.log("Products for removal");
                    console.log(finalFilteredCartItems);

                    const cartItemIdToRemove = finalFilteredCartItems[0].cart_item_id;

                    fetch(`http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cartitem/${cartItemIdToRemove}/`, {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json',
            },
        })
                    .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                         }
                            return response.json();
            })
                .then(data => {
                    console.log('Delete successful:', data);
                    window.location.reload();
            })
                .catch(error => {
                    console.error('Error during delete:', error);
                    window.location.reload();
            });

                })
            
    };


    return (
        <div style={{width: '100%'}}>
            <div className="container">
                <div className="left-section">
                    <div id="orderList">{renderItems()}</div>
                </div>
                <div className="right-section">
                    <div className="personal-info">
                        <h2>Billing Information</h2>
                        <input type="text" placeholder="Address" />
                        <input type="text" placeholder="Card Number" />
                        <input type="text" placeholder="Expiration Date" />
                        <input type="text" placeholder="CVC" />
                    </div>
                    <button>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
