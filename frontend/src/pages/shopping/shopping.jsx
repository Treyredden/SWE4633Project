import React from "react";
import { PRODUCTS } from "../../products"
import { Product } from "./product"
import "./shopping.css"

export const Shopping = () => {
    return <div className='shopping'>
        <div className="shopTitle">
            <h1> AWS Grocery Web Application </h1>
        </div>
        <div className="products"> 
        {" "}
        {PRODUCTS.map((product) => ( 
        <Product data={product}/>
        ))}

        </div>
    </div>
}