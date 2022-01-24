import React from 'react';
import { Envelope, Facebook, Google, Key } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { era } from '../assets/images';

function Login() {
    return <>
        <div className="wrapper">
            <div className="text-center mt-4 name">
                Era Quiz
            </div>
            <div className="logo">
                <img src={era} alt="" />
            </div>
            <div className='text-center h5 mt-2'>Log in with</div>
            <div className='d-flex flex-direction-row justify-content-evenly mt-1' >
                <button type="button" className='btn'>
                    <Facebook size={20} color='#008dd3' />
                </button>
                <button type='button' className='btn '>
                    <Google size={20} color='#e6382c' />
                </button>
            </div>
            <div className='text-center fs-4 mt-2'>or</div>
            <form className="p-3 mt-1">
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-user"> <Envelope /> </span>
                    <input type="email" name="email" id="userName" placeholder="Email" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"> <Key /> </span>
                    <input type="password" name="password" id="pwd" placeholder="Password" />
                </div>
                <button className="btnn mt-3">Login</button>
            </form>
            <div className="text-center fs-6">
                <Link to="/quiz">Forget password?</Link> or <Link to="/signup">Sign up</Link>
            </div>
        </div>
    </>;
}

export default Login;
