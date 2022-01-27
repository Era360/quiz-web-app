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

    return <div className='body'>
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Era Quiz
                </Link>
                <div className='d-flex align-items-center'>
                    <button
                        className="btn"
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="Login to your account"
                        onClick={goLogin}
                    >
                        {/* {console.log(currentUser)} */}
                        {currentUser && currentUser.photoURL ? (<img className='avatar' src={currentUser.photoURL} alt={currentUser.displayName} />)
                            :
                            (<Person size={30} color="white" />)
                        }
                    </button>
                    {currentUser && currentUser.displayName ? <div>{currentUser.displayName}</div> : <div className='text-white'>Guest</div>}
                </div>
            </div>
        </nav>
        <div className='fs-3 text-white text-center p-4'>Welcome
            {currentUser && currentUser.displayName ? ` ${currentUser.displayName}` : "  Guest"}
        </div>
        <div className='main'>
            {!data ? <Spinner /> : <Questions info={data} />}
        </div>
        <div className="footer">
            {
                currentUser ? (
                    <div>
                        <button className='btn btn-warning' onClick={goOut}>Sign out</button>
                        <div className='h4'>Welcome and come again</div>
                    </div>
                )
                    :
                    <div>Welcome and come again</div>
            }
        </div>

    </div>;
}

export default Quiz;
