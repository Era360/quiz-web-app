import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import css from "./addquestions.module.css"
import { analy, db } from '../firebase';
import { arrayUnion, collection, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore';
import Spinner from './utils/spinner';
import { setCurrentScreen } from 'firebase/analytics';

function AddQueastions({ getUser }) {
    setCurrentScreen(analy, "addQuestions_page");
    const [comp, setcomp] = useState(0);
    const [newquestion, setNewquestion] = useState({});
    const [currentUser, setCurrentUser] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (getUser) setCurrentUser(getUser);
    }, [getUser])

    const addQuest = async (quests) => {
        const { uid } = currentUser;
        let curr = "";
        try {
            if (quests["category"] === undefined) {
                throw new Error("No questions to upload!");
            }
            let count = 0;
            const querySnap = await getDocs(collection(db, `questions/${quests["difficulty"]}/${quests["category"]}`));
            querySnap.forEach((doc) => {
                count += 1;
            })
            curr = (count + 1).toString();
            const dbRef = doc(db, `questions/${quests["difficulty"]}/${quests["category"]}`, curr);
            await setDoc(dbRef, {
                "correct": quests["correct_answer"],
                "options": quests["options"],
                "question": quests["question"]
            });
            const dbRefDif = doc(db, `questions/${quests["difficulty"]}`);
            await updateDoc(dbRefDif, {
                categories: arrayUnion(quests["category"])
            })
            const userRef = doc(db, `users/${uid}`);
            await updateDoc(userRef, {
                contributes: increment(1)
            })
            setError("");
        } catch (err) {
            setError(err.message);
        }
    }

    const Diff = () => {
        let difs = ["easy", "medium", "hard"];

        const picked = (item) => {
            setNewquestion({
                ...newquestion,
                "difficulty": item
            }
            )
            setcomp(comp + 1);
        }

        return <>
            <div className='h2 text-center my-3'>How difficult is the question?</div>
            <div className='categories'>
                {
                    difs.map((item, index) => (
                        <div className='category' key={index} onClick={() => picked(difs[index])}>{item}</div>
                    ))
                }

            </div>
        </>
    }
    const Categories = ({ quests }) => {
        const [data, setData] = useState();
        const [error, setError] = useState();

        useEffect(() => {
            const getData = async () => {
                try {
                    const querySnap = await getDoc(doc(db, "questions", quests["difficulty"]));
                    if (querySnap.exists()) {
                        setData(querySnap.data()["categories"])
                    }
                } catch (err) {
                    if (err.message.includes("offline")) {
                        setError("You are offline, connect to the network to proceed!")
                    } else {
                        setError(err.message);
                    }
                }
            }

            getData()

        }, [quests])

        const picking = (cat) => {
            setNewquestion({
                ...newquestion,
                "category": cat,
            })
            setcomp(comp + 1);
        }
        const handleSubmit = (e) => {
            e.preventDefault();
            const dataa = new FormData(e.target);
            setNewquestion({
                ...newquestion,
                "category": dataa.get("new cat").toLowerCase(),
            })
            setcomp(comp + 1);

        }

        if (error) {
            return <div className='alert alert-warning text-center'>
                {error}
                <span><button className='btn border-dark' onClick={() => navigate("/")}>Okay</button></span>
            </div>
        } else if (!data) {
            return <Spinner />
        }


        return <>
            {
                error ? <div className='alert alert-warning'>{error}</div>
                    :
                    <>
                        <div className='h2 text-center my-4'>Add a category</div>
                        <form onSubmit={handleSubmit}>
                            <input id="new" required className={css.input} name="new cat" type="text" placeholder='add new category' />
                            <span><button className={css.btnn} type="submit">+</button></span>
                        </form>
                        <div className='categories'>
                            {
                                data.map((item, index) => (
                                    <div className='category' key={index} onClick={() => picking(data[index])}>{item}</div>
                                ))
                            }
                        </div>
                    </>
            }
        </>
    }
    const Questions = () => {
        const [quiz, setQuiz] = useState();
        const [loading, setLoading] = useState(false);

        const getQuiz = async () => {
            try {
                const quests = await getDocs(collection(db, `questions/${newquestion["difficulty"]}/${newquestion["category"]}`));
                let quizes = []
                quests.forEach((doc) => {
                    quizes.push({ id: doc.id, ...doc.data() })
                })
                setQuiz(quizes);
                setLoading(false);
            } catch (err) {
                console.log(err.message);
            }
        }

        return <>
            {
                loading ?
                    <Spinner />
                    :
                    (
                        quiz ? <>
                            <div className='text-center mt-5'>
                                <button className='btn text-white btn-success mx-4' onClick={() => setcomp(comp + 1)}>Proceed</button>
                                <button
                                    className='btn text-white btn-danger'
                                    onClick={() => {
                                        setNewquestion({});
                                        setcomp(0);
                                    }}>
                                    another category
                                </button>
                            </div>
                            <div className='h5 text-center mt-3'>List of questions in this category</div>
                            {loading ? <Spinner /> :
                                <div className='categories'>
                                    {
                                        quiz.map((item) => (
                                            <div className='category' key={item["id"]} >{item["question"]}</div>
                                        ))
                                    }
                                </div>
                            }
                        </>
                            :
                            <div>
                                <div className='h2 text-center my-3'>Not sure if the question exists in this category?</div>
                                <div className='text-center'>
                                    <span><button className='btn text-white border-dark' onClick={() => { getQuiz(); setLoading(true) }}>Yes</button></span>
                                    <span><button className='btn text-white border-dark' onClick={() => setcomp(comp + 1)}>No</button></span>
                                </div>
                            </div>
                    )
            }
        </>
    }
    const Question = () => {

        const handleSubmit = (e) => {
            e.preventDefault();
            const data = new FormData(e.target);

            setNewquestion({
                ...newquestion,
                "question": data.get("question"),
            })
            setcomp(comp + 1);
        }
        return <>
            <div className='my-3'>
                <form onSubmit={handleSubmit}>
                    <textarea placeholder='Write a question here' name='question' className={css.textarea}></textarea>
                    <span><button className='btn text-white' type="submit">Submit</button></span>
                </form>
            </div>
        </>
    }
    const Options = () => {
        const [opt, setOpt] = useState([]);
        const [correct, setCorrect] = useState("");
        const [options, setOptions] = useState([]);

        const handleSubmit = (e) => {
            e.preventDefault();
            let form = e.target;
            const data = new FormData(form);
            form.reset()
            if (options.length === 1) {
                setCorrect(options[0]);
                setOptions(
                    options.concat(data.get("cat"))
                );
            } else if (options.length === 3) {
                setOptions(options.shift());
            }
            setOpt(
                opt.concat(data.get("cat"))
            );
            setOptions(
                options.concat(data.get("cat"))
            );
        }

        const submit = () => {
            setNewquestion({
                ...newquestion,
                "correct_answer": correct,
                "options": options,
            })
            setcomp(comp + 1);
        }

        return <>
            <div className='categories'>
                {
                    opt != null ? opt.map((opt, index) => (
                        <div className='category' key={index}>{opt}</div>
                    )) : null
                }
            </div>
            {
                opt.length === 0 ?
                    <form onSubmit={handleSubmit}>
                        <input placeholder='Add the correct answer' type="text" name='cat' />
                        <span><button className='btn text-white' type="submit">add</button></span>
                    </form>
                    :
                    opt.length <= 3 &&
                    <form onSubmit={handleSubmit}>
                        <input placeholder='add another category' type="text" name='cat' />
                        <span><button className='btn text-white' type="submit">add</button></span>
                    </form>
            }
            {opt.length >= 4 && <div className='text-center my-4'><button onClick={submit} className='btn btn-success'>Submit</button></div>}
        </>
    }

    return (
        <div className='body text-white'>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        Era Quiz
                    </Link>
                </div>
            </nav>

            <div className='main'>
                {currentUser ?

                    {
                        0: <Diff />,
                        1: <Categories quests={newquestion} />,
                        2: <Questions />,
                        3: <Question />,
                        4: <Options />,
                        5: <div className='text-center text-white my-5'>
                            <button
                                className='btn btn-success'
                                onClick={() => {
                                    addQuest(newquestion);
                                    setcomp(comp + 1);
                                }}>
                                Submit
                            </button>
                        </div>,
                        6: <div className='text-center text-white my-5'>
                            {
                                error ?
                                    <div>
                                        <div className='alert alert-warning mx-3 p-4' role="alert">
                                            {error}
                                            {error === "No questions to upload!" ?
                                                <span><button onClick={() => navigate("/")} className='btn border-dark'>Go back</button></span>
                                                :
                                                <span><button onClick={() => addQuest(newquestion)} className='btn border-dark'>Try again</button></span>
                                            }
                                        </div>

                                    </div>
                                    :
                                    <>
                                        <div className='h2'>Thank you for helping us we really appreciate!</div>
                                        <div className='p '>You can also add some more questions if you don't mind</div>
                                        <span><button
                                            className='btn btn-success'
                                            onClick={() => {
                                                setcomp(0)
                                            }}>
                                            Add more
                                        </button></span>
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => {
                                                navigate("/");
                                            }}>
                                            Quit
                                        </button>
                                    </>
                            }
                        </div>
                    }[comp]
                    :
                    <div className='alert alert-warning text-center' role="alert">
                        Make sure you are logged in first to contribute. for security purposes!
                        <button className='btn mx-3 border-dark' onClick={() => navigate("/login")}>Login</button>
                    </div>
                }

            </div>
        </div>
    )
}

export default AddQueastions