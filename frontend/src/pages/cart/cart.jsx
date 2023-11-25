import React from 'react';
import './main.css';
import { Link } from 'react-router-dom';

export const Cart = () => {
    let items = [
        // Sample items
        { id: 1, name: 'Bread', price: 3.99, quantity: 1, imageUrl: '../../assets/bread-5.png', selected: false },
        { id: 2, name: 'Milk', price: 4.99, quantity: 1, imageUrl: '../../assets/milk.png', selected: false }
    ];

    const renderItems = () => {
        return items.map((item) => {
            return (
                <div className="item" key={item.id}>
                    <div className="product-container">
                        <input type="checkbox" checked={item.selected} onChange={() => toggleSelection(item.id)} />
                        <img src={item.imageUrl} alt={item.name} className="product-image" />
                        <div>
                            <p>{item.name}</p>
                            <p>Price: ${item.price}</p>
                            <div>
                                <button type="button" onClick={() => decreaseQuantity(item.id)}>-</button>
                                <span>{item.quantity}</span>
                                <button type="button" onClick={() => increaseQuantity(item.id)}>+</button>
                            </div>
                        </div>
                        <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                </div>
            );
        });
    };

    const toggleSelection = (id) => {
        items = items.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
        );
        renderItems();
        calculateTotalPrice();
    };

    const removeItem = (id) => {
        items = items.filter((item) => item.id !== id);
        renderItems();
        calculateTotalPrice();
    };

    const increaseQuantity = (id) => {
        items = items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        renderItems();
        calculateTotalPrice();
    };

    const decreaseQuantity = (id) => {
        items = items.map((item) =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        renderItems();
        calculateTotalPrice();
    };

    const calculateTotalPrice = () => {
        // To be implemented
        console.log("calculateTotalPrice function will be implemented later.");
    };

    const proceedToCheckout = () => {
        // To be implemented
        console.log("proceedToCheckout function will be implemented later.");
    };

    const globalSearch = () => {
        // To be implemented
        console.log("globalSearch function will be implemented later.");
    };

    return (
        <div>
            <div className="navbar">
                <Link to="/shopping" className="active">
                    Shop
                </Link>
                <a href="#">Cart</a>
            </div>
            <div className="container">
                <div className="left-section">
                    <input type="text" id="globalSearchBar" onKeyUp={globalSearch} placeholder="Search for items..." />
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
                        <p4> Total Price: $ 0</p4>
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
