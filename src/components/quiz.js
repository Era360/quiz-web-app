import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getCurrentuser } from '../utils/utils';
import Questions from './questions';
import Spinner from './spinner';


function Quiz() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(getCurrentuser);
    const [data, setData] = useState(null);

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
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    useEffect(() => {
        setCurrentUser(getCurrentuser);
        fetchquestions();

        async function fetchquestions() {
            const res = await fetch("https://opentdb.com/api.php?amount=5");
            const data = await res.json();
            setData(data.results.map(item => (
                {
                    question: item.question,
                    options: shuffle([...item.incorrect_answers, item.correct_answer]),
                    answer: item.correct_answer
                }
            )));
        }

    }, [])
    // if (data !== null) {
    //     console.log(data.results);
    // }

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
                    {/* {console.log(currentUser)} */}
                    {currentUser !== null ? (<img className='avatar' src={currentUser.photoURL} alt={currentUser.displayName} />)
                        :
                        (<Person size={30} color="white" />)
                    }
                </button>
            </div>
        </nav>
        <div className='body'>
            {!data ? <Spinner /> : <Questions info={data} />}
            <button className='btn btn-warning' onClick={goOut}>Sign out</button>
        </div>
    </div>;
}

export default Quiz;
