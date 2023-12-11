import React, { useState } from 'react';

export const Login = () => {

    const handleSubmit = (e) => {
        window.location.href = 'http://ec2-18-221-168-153.us-east-2.compute.amazonaws.com/shopping';
      };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            required
          />
        </label>
        <br />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
