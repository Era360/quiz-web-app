import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { CloudSlash, EmojiFrown, Envelope, Person, Twitter } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { analy, auth } from '../../firebase';
import Category from './categories';
import Questions from './questions';
import Spinner from '../utils/spinner';
import { logEvent, setCurrentScreen } from 'firebase/analytics';

function Quiz({ getUser }) {
    setCurrentScreen(analy, "Quiz_page");
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(getUser);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [changecat, setChangecat] = useState(true);
    const [parameter, setParameter] = useState(null);
    const [session, setSession] = useState();
    const [quitting, setQuitting] = useState(false);

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
        setParameter({
            amount: param.amount,
            cat_id: param.cat_id,
            dif: param.dif,
        });
        setChangecat(!changecat);
    };
    const repeat = () => {
        setData(null);
        setParameter(null);
        setChangecat(!changecat);
    }

    const repeat_same = (param) => {
        setData(null);
        setParameter({
            amount: param.amount,
            cat_id: param.cat_id,
            dif: param.dif,
        });
    };

    const Quit = () => {
        return <div className='text-white text-center'>
            <div className='h1 mb-4'>Thanks for playing</div>
            <div className="h4">Kindly give me a feedback about the quiz on:</div>
            <address>
                <div className="mb-2">
                    <Twitter size={20} />
                    <a
                        href="https://twitter.com/eliah_mkumbo"
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: "0 10px", textDecoration: "none" }}
                    >
                        @eliah_mkumbo
                    </a>
                </div>
                <div>
                    <Envelope size={20} />
                    <a
                        href="mailto:mkumboelia@gmail.com"
                        style={{ padding: "0 10px", textDecoration: "none" }}
                    >
                        mkumboelia@gmail.com
                    </a>
                </div>
            </address>
            <button className='btn btn-danger fs-5' onClick={() => navigate("/")}>Not now</button>
        </div>

    };

    // const checkpoints = (param) => {
    //     setQ_limit(param);
    // };

    useEffect(() => {
        if (getUser) setCurrentUser(getUser);
        logEvent(analy, 'screen_view', {
            firebase_screen: "Quiz_screen",
            firebase_screen_class: "Quiz"
        });
        fetchquestions();

        async function fetchquestions() {
            if (!session) {
                const sessionn = await fetch("https://opentdb.com/api_token.php?command=request");
                const token = await sessionn.json()
                setSession(token.token);
            }
            if (parameter) {
                try {
                    const res = await fetch(`https://opentdb.com/api.php?amount=${parameter.amount}&category=${parameter.cat_id}&difficulty=${parameter.dif}&token=${session}`);
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

    }, [parameter, session, getUser])

    const Checker = () => {
        if (changecat) return <Category currentUser={currentUser} setcat={(pa) => changecatthing(pa)} />
        if (quitting) return <Quit />;
        // if (q_limit !== null) return <Answers data={data} repeat={repeat} repeat_same={repeat_same} q_limit={q_limit} parameter={parameter} quitting={() => setQuitting(!quitting)} />
        return <Questions info={data}
            repeat={repeat}
            repeat_same={repeat_same} parameter={parameter}
            quitting={() => setQuitting(!quitting)}
        />

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
                        disabled={currentUser ? true : false}
                        onClick={goLogin}
                    >
                        {currentUser?.photoURL ? (<img className='avatar' src={currentUser.photoURL} alt={currentUser.displayName} />)
                            :
                            (<Person size={30} color='white' />)
                        }
                    </button>
                    {currentUser && currentUser.displayName ? <div
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title="Sign Out at the bottom of page"
                    >
                        {currentUser.displayName}</div> : <div>Guest</div>}
                </div>
            </div>
        </nav>
        {
            navigator.onLine ?
                (
                    <>
                        {
                            error
                                ? <div className='main'>
                                    <div role="alert" className='alert alert-danger'><CloudSlash size={30} />
                                        {error}
                                    </div>
                                    <div className='text-center'><EmojiFrown size={100} /></div>
                                </div>
                                :
                                <div className='main'>
                                    <div className='fs-3 text-white text-center p-4'>Welcome
                                        {currentUser && currentUser.displayName ? ` ${currentUser.displayName}` : "  Guest"}
                                    </div>
                                    <div>
                                        {!data && parameter ? <Spinner /> : <Checker />}
                                    </div>
                                </div>
                        }

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
                    </>

                )
                :
                <div className='sub_main'>
                    <div className='offline'>
                        <div className='off'></div>
                        <h2>You are Offline</h2>
                    </div>
                    <div className='text-center'>
                        <button className='btn btn-warning' onClick={() => window.location.reload()}>Retry</button>
                    </div>
                </div>
        }

    </div>;
}

export default Quiz;
