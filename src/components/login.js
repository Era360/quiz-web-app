import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { Envelope, EyeFill, EyeSlashFill, Google, Key } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { era } from '../assets/images';
import { auth, provider } from '../firebase';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            setLoading(true)
            const email = data.get("email");
            const pass = data.get("password");
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            const errorCode = error;
            console.log(errorCode)
        }
        setLoading(false);
    };

    const withGoogle = async () => {
        try {
            setLoading(true)
            await signInWithPopup(auth, provider)
            navigate("/quiz");
        } catch (error) {
            const errorCode = error;
            console.log(errorCode);
        }
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
            <div className='text-center h5 mt-2'>Log in with</div>
            <div className='d-flex justify-content-evenly mt-1' >
                {/* <button type="button" className='btn'>
                    <Facebook size={20} color='#008dd3' />
                </button> */}
                <button type='button' className='btn' onClick={withGoogle}>
                    <Google size={20} color='#e6382c' />
                </button>
            </div>
            <div className='text-center fs-4 mt-2'>or</div>
            <form onSubmit={handleSubmit} className="p-3 mt-1">
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-user"> <Envelope /> </span>
                    <input type="email" name="email" id="userName" placeholder="Email" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"> <Key /> </span>
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
                <button type="submit" className="btnn mt-3" disabled={loading}>Login</button>
            </form>
            <div className="text-center fs-6">
                <Link to="/quiz">Forget password?</Link> or <Link to="/signup">Sign up</Link>
            </div>
        </div>
    </>;
}

export default Login;
