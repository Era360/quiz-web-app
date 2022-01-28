import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { CloudSlash, EmojiFrown, Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getCurrentuser } from '../utils/utils';
import Category from './categories';
import Questions from './questions';
import Spinner from './spinner';


function Quiz() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(getCurrentuser);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [changecat, setChangecat] = useState(true);
    const [parameter, setParameter] = useState(null);

    const goLogin = () => {
        navigate("/login");
    };

    const goOut = async () => {
        try {
            await signOut(auth);
            navigate("/")
        } catch (err) {
            setError(err.code);
        }
    };
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    const changecatthing = (param) => {
        // console.log(param);
        setParameter({
            amount: param.amount,
            cat_id: param.cat_id,
            dif: param.dif,
        });
        setChangecat(!changecat);
    };
    // console.log(data);



    useEffect(() => {
        setCurrentUser(getCurrentuser);
        fetchquestions();

        async function fetchquestions() {
            if (parameter) {
                try {
                    const res = await fetch(`https://opentdb.com/api.php?amount=${parameter.amount}&category=${parameter.cat_id}&difficulty=${parameter.dif}`);
                    const data = await res.json();

                    setData(data.results.map(item => (
                        {
                            question: item.question,
                            options: shuffle([...item.incorrect_answers, item.correct_answer]),
                            answer: item.correct_answer
                        }
                    )));
                } catch (error) {
                    setError(" We failed to get the questions please try to refresh your page");
                }
            }
        }

    }, [parameter])

    const Checker = () => {
        if (!data && parameter) return <Spinner />


        if (changecat) return <Category setcat={(pa) => changecatthing(pa)} />

        return <Questions info={data} />

    };


    return <div className='body'>
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Era Quiz
                </Link>
                <div className='d-flex align-items-center text-white'>
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
                            (<Person size={30} color='white' />)
                        }
                    </button>
                    {currentUser && currentUser.displayName ? <div>{currentUser.displayName}</div> : <div>Guest</div>}
                </div>
            </div>
        </nav>
        {
            error
                ?
                <div role="alert" className='alert alert-danger'><CloudSlash size={30} />{error}</div>
                :
                <div className='fs-3 text-white text-center p-4'>Welcome
                    {currentUser && currentUser.displayName ? ` ${currentUser.displayName}` : "  Guest"}
                </div>
        }
        <div className='main'>
            {error ? <div className='text-center'><EmojiFrown size={100} /></div> : <Checker />}
            {/* {!data ? <Spinner /> : <Questions info={data} />} */}
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
