import React from 'react';
import { useNavigate } from "react-router-dom"
import css from "./welcome.module.css"

function Welcome() {
    const navigate = useNavigate();

    return <div className={css.container}>
        <div className='text-center h3'>Welcome to Era Quiz</div>
        <div className='text-center my-3'>Press the button below to Login so as you can experience the questions of your interest</div>
        <div className='text-center'>
            <button className={css.btnnn} onClick={() => navigate("/login")}>Login</button>
        </div>
        <div className='text-center my-4'>or</div>
        <div className='text-center my-4'>Press the button below to start as guest</div>
        <div className='text-center'>
            <button className={css.btnnn} onClick={() => navigate("/quiz")}>Start</button>
        </div>
    </div>;
}

export default Welcome;
