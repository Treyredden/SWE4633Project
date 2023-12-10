import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './main.css';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:8000/api';

export const Cart = () => {
    const [items, setItems] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
	// Fetch or create userID
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = uuidv4(); // Generate a new UUID
            localStorage.setItem('userId', userId);
        }
        setUserId(userId);

        // Fetch cart items from the server
        axios.get(`${API_URL}/carts/`)
            .then(res => {
                console.log('Fetched items:', res.data);
                setItems(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const renderItems = () => {
        return items.map((item) => {
            return (
                <div className="item" key={item.product_id}> 
                    <div className="product-container">
                        <input type="checkbox" checked={item.selected} onChange={() => toggleSelection(item.product_id)} /> \
                        <img src={item.imageUrl} alt={item.name} className="product-image" />
                        <div>
                            <p>{item.name}</p>
                            <p>Price: ${item.product_price}</p> {/* Use product_price instead of price */}
                            <div>
                                <button type="button" onClick={() => decreaseQuantity(item.product_id)}>-</button> 
                                <span>{item.quantity}</span>
                                <button type="button" onClick={() => increaseQuantity(item.product_id)}>+</button> 
                            </div>
                        </div>
                        <button type="button" onClick={() => removeItem(item.product_id)}>Remove</button> 
                    </div>
                </div>
            );
        });
    };
    
    const toggleSelection = (id) => {
        setItems(prevItems => prevItems.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
        calculateTotalPrice();
    };

    const removeItem = (id) => {
        console.log('Removing item with id:', id);
        axios.delete(`${API_URL}/carts/${id}/`)
            .then(res => {
                setItems(prevItems => prevItems.filter((item) => item.id !== id));
                calculateTotalPrice();
            })
            .catch(err => {
                console.error(err);
            });
    };

    const increaseQuantity = (id) => {
        setItems(prevItems => prevItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
        calculateTotalPrice();
    };

    const decreaseQuantity = (id) => {
        setItems(prevItems => prevItems.map((item) =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
        calculateTotalPrice();
    };

    const calculateTotalPrice = () => {
        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        console.log(`Total Price: $${totalPrice}`);
    };

    const proceedToCheckout = () => {
        // Send a request to backend to create an order with the items in the cart
        axios.post(`${API_URL}/orders/`, {
            items: items.map(item => ({ product: item.id, quantity: item.quantity }))
        })
        .then(res => {
            console.log('Order placed successfully');
            // Clear the cart
            setItems([]);
        })
        .catch(err => {
            console.error('Failed to place order: ', err);
        });
    };

    return (
        <div style={{width: '100%'}}>
            <div className="container">
                <div className="left-section">
                    <div id="orderList">{renderItems()}</div>
                </div>
                <div className="right-section">
                    <div className="personal-info">
                        <h2>Personal Information</h2>
                        <input type="text" placeholder="Name" />
                        <input type="email" placeholder="Email" />
                        <input type="text" placeholder="Phone Number" />
                        <input type="text" placeholder="Address" />
                        <input type="text" placeholder="Card Number" />
                        <input type="text" placeholder="Expiration Date" />
                        <input type="text" placeholder="CVC" />
                    </div>
                    <div id="totalPrice">
                        <p> Total Price: $ 0</p>
                        <br />
                        <br />
                    </div>
                    <button onClick={proceedToCheckout}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
