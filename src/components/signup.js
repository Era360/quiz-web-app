import { signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { Envelope, EyeFill, EyeSlashFill, Google, Key, Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { era } from '../assets/images';
import { auth, provider } from '../firebase';

function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const withGoogle = async () => {
        try {
            setLoading(true)
            await signInWithPopup(auth, provider)
            navigate("/quiz");
        } catch (error) {
            const errorCode = error;
            console.log(errorCode);
        }
        setLoading(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return <>
        <div className="wrapper">
            <div className="text-center mt-4 name">
                Era Quiz
            </div>
            <div className="logo">
                <img src={era} alt="" />
            </div>
            <div className='text-center h5 mt-2'>Sign up with</div>
            <div className='d-flex justify-content-evenly' >
                {/* <button type="button" className='btn'>
                    <Facebook size={20} color='#008dd3' />
                </button> */}
                <button type='button' className='btn' onClick={withGoogle}>
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
                    <input type={showPassword ? "text" : "password"} name="password" id="pwd" placeholder="Password" />
                    <button
                        type="button"
                        className="btn"
                        onClick={handleClickShowPassword}
                    >
                        {showPassword ? (
                            <EyeSlashFill />
                        ) : (
                            <EyeFill />
                        )}
                    </button>
                </div>
                <button type="submit" className="btnn mt-2" disabled={loading}>Sign up</button>
            </form>
            <div className="text-center fs-6">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    </>;
}

export default SignUp;
