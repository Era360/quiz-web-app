import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { CloudSlash, EmojiFrown, Envelope, Person, Twitter } from 'react-bootstrap-icons';
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
    const [q_limit, setQ_limit] = useState(null);
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
        setQ_limit(null);
        setChangecat(!changecat);

    }
    const repeat_same = (param) => {
        setData(null);
        setParameter({
            amount: param.amount,
            cat_id: param.cat_id,
            dif: param.dif,
        });
        setQ_limit(null)
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

    const checkpoints = (param) => {
        setQ_limit(param);
    };

    useEffect(() => {
        setCurrentUser(getCurrentuser);
        // console.log(session);
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

    }, [parameter, session])

    const Checker = () => {
        if (!data && parameter) return <Spinner />
        if (changecat) return <Category setcat={(pa) => changecatthing(pa)} />
        if (quitting) return <Quit />;
        if (q_limit !== null) return <div className='text-center text-white'>
            <div className='h1 mb-4'>{q_limit === 0 ? "Oops, you got none of the questions. Not bad you can try again."
                :
                `Congrats, you got ${q_limit} out of ${parameter.amount} questions.`}</div>
            <div className='my-3'>
                <div className='my-3'><button className='btn btn-success' onClick={() => repeat_same(parameter)}>repeat with same choices</button></div>
                <button className='btn btn-success mx-4' onClick={repeat}>repeat with different choices</button>
            </div>
            <button className='btn btn-danger fs-5' onClick={() => setQuitting(!quitting)}>Quit</button>
        </div>
        return <Questions info={data} sendPts={checkpoints} />

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
