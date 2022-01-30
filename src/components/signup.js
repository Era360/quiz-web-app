import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import css from "./login.module.css";
import { Envelope, EyeFill, EyeSlashFill, Google, Key, Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../assets/images';
import { auth, provider } from '../firebase';

function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const withGoogle = async () => {
        try {
            setLoading(true)
            await signInWithPopup(auth, provider)
            navigate("/quiz");
        } catch (error) {
            const errorCode = error;
            setError(errorCode);
        }
        setLoading(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            setLoading(true)
            const username = data.get("user");
            const email = data.get("email");
            const pass = data.get("password");
            await createUserWithEmailAndPassword(auth, email, pass);
            const user = auth.currentUser;
            await updateProfile(user, { displayName: username })
            navigate("/quiz");
        } catch (error) {
            const errorCode = error.code;
            setError(errorCode);
        }
        setLoading(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return <>
        <div className={css.wrapper}>
            <div className={css.name + " text-center mt-4"}>
                Era Quiz
            </div>
            <div className={css.logo}>
                <img src={logo} alt="" />
            </div>
            <div className='text-center h5 mt-2'>Sign up with</div>
            <div className='d-flex justify-content-evenly' >
                <button type='button' className='btn' onClick={withGoogle}>
                    <Google size={20} color='#e6382c' />
                </button>
            </div>
            <div className='text-center fs-6'>or use your email for registration</div>
            {error ? <div role="alert" className='alert alert-danger'>{error}</div> : null}
            <form onSubmit={handleSubmit} className="p-3 ">
                <div className={css.form_field + " d-flex align-items-center"}>
                    <span> <Person /> </span>
                    <input type="text" name="user" id="userName" placeholder="User name" />
                </div>
                <div className={css.form_field + " d-flex align-items-center"}>
                    <span className="fas "> <Envelope /> </span>
                    <input type="email" name="email" id="email" placeholder="Email" />
                </div>
                <div className={css.form_field + " d-flex align-items-center"}>
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
                <button type="submit" className={css.btnn + " mt-2"} disabled={loading}>Sign up</button>
            </form>
            <div className="text-center fs-6">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    </>;
}

export default SignUp;
