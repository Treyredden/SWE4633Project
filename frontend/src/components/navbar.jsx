import { ShoppingCartSimple } from "phosphor-react";
import React from "react";
import { Link } from 'react-router-dom';
import "./navbar.css";

export const Navbar = () => {
    return (
    <div className="navbar">
        <div className="links">
            <Link to="/"> Shop </Link>
            <Link to="/cart">
                <ShoppingCartSimple size={30} />
            </Link>
        </div>
    </div>
    );
};