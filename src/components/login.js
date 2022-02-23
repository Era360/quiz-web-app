import React, { useEffect, useState } from 'react';
import css from "./login.module.css";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Envelope, EyeFill, EyeSlashFill, Google, Key } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../assets/images';
import { analy, auth, provider } from '../firebase';
import Spinner from './utils/spinner';
import { logEvent } from 'firebase/analytics';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        logEvent(analy, 'screen_view', {
            firebase_screen: "Login_screen",
            firebase_screen_class: "Login"
        });
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            setLoading(true)
            const email = data.get("email");
            const pass = data.get("password");
            await signInWithEmailAndPassword(auth, email, pass);
            navigate("/");
        } catch (error) {
            if (error.message.includes("user-not-found")) {
                setError("Unknown user!")
            } else {
                setError(error.message);
            }
        }
        setLoading(false);
    };

    const withGoogle = async () => {
        try {
            setLoading(true)
            provider.setCustomParameters({ prompt: "select_account" })
            await signInWithPopup(auth, provider)
            navigate("/");
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
        {
            loading
                ?
                <Spinner />
                :
                <div className={css.wrapper}>
                    <div className={css.name}>
                        Era Quiz
                    </div>
                    <div className={css.logo}>
                        <img src={logo} alt="era logo" />
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
                    <div className="text-center">
                        {/* <Link to="/quiz">Forget password?</Link> or  */}
                        <Link to="/signup">Sign up</Link>
                        <div className='h2'><Link to="/quiz">Continue as Guest</Link></div>
                    </div>
                </div>
        }
    </>;
}

export default Login;
