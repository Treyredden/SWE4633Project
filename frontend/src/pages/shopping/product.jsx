import React from "react";

export const Product = (props) => {
    const { id, product_name: productName, price, image_url: productImage } = props.data;
    const userId = props.userId;

    const addToCart = () => {
        fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: id,
                user_id: userId,
                quantity: 1,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Item added to cart:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="product">
            <img src={productImage} alt={productName} />
            <div className="description">
                <p><b>{productName}</b></p>
                <p>${price}</p>
            </div>
            <button className="addToCartBttn" onClick={addToCart}>Add To Cart</button>
        </div>
    );
};

