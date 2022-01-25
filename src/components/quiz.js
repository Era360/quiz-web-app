import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getCurrentuser } from '../utils/utils';


function Quiz() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(getCurrentuser);

    const goLogin = () => {
        navigate("/login");
    };

    const goOut = async () => {
        try {
            await signOut(auth);
            navigate("/")
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        setCurrentUser(getCurrentuser);
    }, [])

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
                    {console.log(currentUser)}
                    {currentUser !== null ? (<img className='avatar' src={currentUser.photoURL} alt={currentUser.displayName} />)
                        :
                        (<Person size={30} color="white" />)
                    }
                </button>
            </div>
        </nav>
        <div>The Quiz</div>
        <button className='btn btn-alert' onClick={goOut}>Sign out</button>
    </div>;
}

export default Quiz;
