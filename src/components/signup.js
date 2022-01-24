import React from 'react';
import { Envelope, Facebook, Google, Key, Person } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { era } from '../assets/images';

function SignUp() {
    return <>
        <div className="wrapper">
            <div className="text-center mt-4 name">
                Era Quiz
            </div>
            <div className="logo">
                <img src={era} alt="" />
            </div>
            <div className='text-center h5 mt-2'>Sign up with</div>
            <div className='d-flex flex-direction-row justify-content-evenly' >
                <button type="button" className='btn'>
                    <Facebook size={20} color='#008dd3' />
                </button>
                <button type='button' className='btn '>
                    <Google size={20} color='#e6382c' />
                </button>
            </div>
            <div className='text-center fs-6'>or use your email for registration</div>
            <form className="p-3 ">
                <div className="form-field d-flex align-items-center">
                    <span className="fas "> <Person /> </span>
                    <input type="text" name="user" id="userName" placeholder="User name" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas "> <Envelope /> </span>
                    <input type="email" name="email" id="email" placeholder="Email" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas "> <Key /> </span>
                    <input type="password" name="password" id="pwd" placeholder="Password" />
                </div>
                <button className="btnn mt-2">Sign up</button>
            </form>
            <div className="text-center fs-6">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    </>;
}

export default SignUp;
