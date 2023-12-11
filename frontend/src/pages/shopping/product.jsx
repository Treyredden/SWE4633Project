import React from "react";

export const Product = (props) => {
    const {product_id, product_name: productName, price, image_url: productImage} = props.data;
    const cartId = props.cartId;
    const userId = props.userId;
    //fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cart/?cart_id=4', {
    const addToCart = () => {
        console.log("PROPS");
        console.log(props);
        console.log('product_id');
        console.log(product_id);
        console.log('CART ID');
        console.log(cartId);
        fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/cartitem/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: product_id,
                user_id: userId,
                cart: cartId,
                quantity: 1,
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert('Item added to cart:', data);
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

