import React, { useState } from 'react';
import css from "./login.module.css";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Envelope, EyeFill, EyeSlashFill, Google, Key } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { era } from '../assets/images';
import { auth, provider } from '../firebase';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            setLoading(true)
            const email = data.get("email");
            const pass = data.get("password");
            await signInWithEmailAndPassword(auth, email, pass);
            navigate("/quiz");
        } catch (error) {
            const errorCode = error.code;
            setError(errorCode);
        }
        setLoading(false);
    };

    const withGoogle = async () => {
        try {
            setLoading(true)
            provider.setCustomParameters({ prompt: "select_account" })
            await signInWithPopup(auth, provider)
            navigate("/quiz");
        } catch (error) {
            const errorCode = error.code;
            setError(errorCode);
            console.log(errorCode);
        }
    };
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return <>
        <div className={css.wrapper}>
            <div className={css.name}>
                Era Quiz
            </div>
            <div className={css.logo}>
                <img src={era} alt="era logo" />
            </div>
            <div className='text-center h5 mt-2'>Log in with</div>
            <div className='d-flex justify-content-evenly mt-1' >
                <button type='button' className='btn' onClick={withGoogle}>
                    <Google size={20} color='#e6382c' />
                </button>
            </div>
            <div className='text-center fs-4 mt-2'>or</div>
            {error ? <div className='alert alert-danger' role="alert">{error}</div> : null}
            <form onSubmit={handleSubmit} className="p-3 mt-1">
                <div className={css.form_field + " d-flex align-items-center"} >
                    <span> <Envelope /> </span>
                    <input type="email" name="email" id="userName" placeholder="Email" />
                </div>
                <div className={css.form_field + " d-flex align-items-center"}>
                    <span> <Key /> </span>
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
                <button type="submit" className={css.btnn + " mt-3"} disabled={loading}>Login</button>
            </form>
            {error}
            <div className="text-center fs-6">
                <Link to="/quiz">Forget password?</Link> or <Link to="/signup">Sign up</Link>
            </div>
        </div>
    </>;
}

export default Login;
