import React, { useEffect, useState } from "react";
import { Product } from "./product"
import "./shopping.css"

export const Shopping = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/api/product/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(error => console.error('Fetch error:', error));
    }, []);    

    return (
        <div className='shopping'>
            <div className="shopTitle">
                <h1> AWS Grocery Web Application </h1>
            </div>
            <div className="products"> 
                {products.map((product) => { 
                    console.log(product.id);
                    return <Product key={product.id} data={product}/>
                })}
            </div>
        </div>
    );
}
