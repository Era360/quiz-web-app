import React from 'react';
import { Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';


function Quiz() {
    const navigate = useNavigate();

    const goLogin = () => {
        navigate("/login");
    };


    return <div>
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Era Quiz
                </Link>
                {/* <img className="avatar" src={usericon} alt="" /> */}
                <button
                    className="btn"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Login to your account"
                    onClick={goLogin}
                >
                    <Person size={30} color="white" />
                </button>
            </div>
        </nav>
        <div>The Quiz</div>
    </div>;
}

export default Quiz;
