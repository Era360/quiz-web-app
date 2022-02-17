import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import css from "./addquestions.module.css"
import { analy, db } from '../firebase';
import { collection, doc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore';
import Spinner from './utils/spinner';
import { setCurrentScreen } from 'firebase/analytics';
import { EnvelopeFill } from 'react-bootstrap-icons';

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
            // Checking if there is no category to upload
            if (quests["category"] === undefined) {
                throw new Error("No questions to upload!");
            }
            // Counting exists questions so as to append a new question with new id 
            let countt = 0;
            const querySnap = await getDocs(collection(db, `questions/${quests["difficulty"]}/${quests["category"]}`));
            querySnap.forEach((doc) => {
                countt += 1;
            })
            curr = (countt + 1).toString();
            const dbRef = doc(db, `questions/${quests["difficulty"]}/${quests["category"]}`, curr);
            await setDoc(dbRef, {
                "correct": quests["correct_answer"],
                "options": quests["options"],
                "question": quests["question"]
            });

            // adding amount of questions in a certain category
            const dbRefDif = doc(db, `questions/${quests["difficulty"]}`);
            let count = {}
            count[quests["category"]] = increment(1);
            await setDoc(dbRefDif, {
                // categories: arrayUnion(quests["category"])
                count
            }, { merge: true })

            // adding contribution marks to a contributer
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
    const Categories = () => {
        let lists = ["General knowledge", "science & nature",
            "computers", "mathematics", "history",
            "politics", "sports", "animals"]

        const picking = (cat) => {
            if (cat === "science & nature") {
                setNewquestion({
                    ...newquestion,
                    "category": "science",
                })
            } else {
                setNewquestion({
                    ...newquestion,
                    "category": cat,
                })
            }
            setcomp(comp + 1);
        }

        return <>
            <div className=' text-center mt-3'>
                <div className='h4'>Please choose on existing categories.</div>
                <p>or</p>
                <div className='h6'>contact us for addition of categories</div>
                <address>
                    <div>
                        <EnvelopeFill size={20} />
                        <a
                            href="mailto:mkumboelia@gmail.com"
                            style={{ padding: "0 10px", textDecoration: "none" }}
                        >
                            Add category
                        </a>
                    </div>
                </address>
            </div>
            <div className='categories'>
                {
                    lists.map((item, index) => (
                        <div className='category' key={index} onClick={() => picking(lists[index])}>{item}</div>
                    ))
                }
            </div>
        </>
    }
    const Questions = () => {
        const [quiz, setQuiz] = useState();
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(false);

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
                setError(err.message);
            }
        }

        return <>
            {
                error ? <div className='alert alert-warning text-center' role="alert">
                    {error}
                    <button className='btn mx-3 border-dark' onClick={() => navigate("/addquestions")}>Start again</button>
                </div>
                    :
                    (
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
                                    <div className='categories'>
                                        {quiz.length === 0
                                            ? <div className='h6 text-center' style={{ color: "red" }}>No questions in this category</div>
                                            : quiz.map((item) => (
                                                <div className='category' key={item["id"]} >{item["question"]}</div>
                                            ))
                                        }
                                    </div>
                                </>
                                    :
                                    <div>
                                        <div className='h2 text-center my-3'>Not sure if the question exists in this category?</div>
                                        <div className='text-center'>
                                            <span><button className='btn text-white border-dark' onClick={() => { setLoading(true); getQuiz() }}>Yes</button></span>
                                            <span><button className='btn text-white border-dark' onClick={() => setcomp(comp + 1)}>No</button></span>
                                        </div>
                                    </div>
                            )
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
                        1: <Categories />,
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
                                                <span><button onClick={() => setcomp(0)} className='btn border-dark'>Upload a question</button></span>
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