import React from 'react';
import { useNavigate } from "react-router-dom"
import css from "./welcome.module.css"

function Welcome() {
    const navigate = useNavigate();

    const goQuiz = () => {
        navigate("/quiz")
    };

    return <div className={css.container}>
        <div className='text-center h3'>Welcome everyone to Era Quiz</div>
        <div className='text-center my-4'>Press the button below to start</div>
        <div className='text-center'>
            <button className='btnnn' onClick={goQuiz}>Start</button>
        </div>
    </div>;
}

export default Welcome;
