import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { auth } from '../firebase';
import css from "./welcome.module.css"

function Welcome({ getUser }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState();
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        if (getUser) setCurrentUser(getUser);
        if (initializing) setInitializing(false);
    }, [getUser, initializing])


    const goOut = async () => {
        try {
            await signOut(auth);
            navigate("/");
            window.location.reload();
        } catch (err) {
            setError("failed to log out");
        }
    };

    if (initializing) return null;

    return <div className={css.container}>
        <div className='text-center h3'>Welcome to Era Quiz</div>
        {
            currentUser
                ?
                <div>
                    <div className='text-center my-4'>Press the button below to start</div>
                    <div className='text-center'>
                        <div className='h6 mb-2'>Still logged in as {currentUser.displayName}</div>
                        <button className={css.btnnn} onClick={() => navigate("/quiz")}>Start</button>
                    </div>
                    <div className='text-center'>
                        {error && <div className='alert alert-warning mt-3 p-1' role="alert">{error}</div>}
                        <button className='btn btn-warning mt-2' onClick={goOut}>Sign out</button>
                    </div>
                </div>
                :
                <div>
                    <div className='text-center my-3'>Press the button below to Login so as you can experience the questions of your interest</div>
                    <div className='text-center'>
                        <button className={css.btnnn} onClick={() => navigate("/login")}>Login</button>
                    </div>
                    <div className='text-center my-4'>or</div>
                    <div className='text-center my-4'>Press the button below to start as guest</div>
                    <div className='text-center'>
                        <button className={css.btnnn} onClick={() => navigate("/quiz")}>Start</button>
                    </div>
                </div>
        }
    </div>;
}

export default Welcome;
