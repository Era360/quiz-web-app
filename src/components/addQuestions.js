import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import css from "./addquestions.module.css"
import { db } from '../firebase';
import { collection, doc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore';

function AddQueastions({ getUser }) {
    const [comp, setcomp] = useState(0);
    const [newquestion, setNewquestion] = useState({});
    const [currentUser, setCurrentUser] = useState();
    // const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (getUser) setCurrentUser(getUser);
    }, [getUser])

    const addQuest = async (quests) => {
        const { uid } = currentUser;

        let curr = "";
        try {
            let count = 0;
            const userRef = doc(db, `users/${uid}`);
            await updateDoc(userRef, {
                contributes: increment(1)
            })
            const querySnap = await getDocs(collection(db, `questions/${quests['category']}/${quests["difficulty"]}`));
            querySnap.forEach((doc) => {
                count += 1;
            })
            curr = (count + 1).toString();
        } catch (error) {
            console.log(error);
        }
        try {
            const userRef = doc(db, `questions/${quests['category']}/${quests["difficulty"]}`, curr);
            await setDoc(userRef, {
                "correct": quests["correct_answer"],
                "options": quests["options"],
                "question": quests["question"]
            });
        } catch (err) {
            console.log(err)
        }
    }


    const Categories = () => {
        let categories = ["science", "history", "mathematics", "music", "animals"];

        const picking = (cat) => {
            setNewquestion({
                ...newquestion,
                "category": cat,
            })
            setcomp(comp + 1);
        }
        const handleSubmit = (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            // console.log(typeof data.get("new cat"));
            // try {
            //     let num;
            //     num = parseInt(data.get("new cat"));
            //     console.log(num);
            //     if (typeof num == "number") {
            //         setError("Please enter an invalid category name")
            //     }
            // } catch (err) {
            //     console.log(err);
            // }
            setNewquestion({
                ...newquestion,
                "category": data.get("new cat"),
            })
            setcomp(comp + 1);

        }

        return <>
            {/* {error && <div className='alert alert-warning' role="alert" >{error}</div>} */}
            <form onSubmit={handleSubmit}>
                <input id="new" required className={css.input} name="new cat" type="text" placeholder='add new category' />
                <span><button className={css.btnn} type="submit">+</button></span>
            </form>
            <div className='categories'>
                {
                    categories.map((item, index) => (
                        <div className='category' key={index} onClick={() => picking(categories[index])}>{item}</div>
                    ))
                }
            </div>
        </>
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
            <div className='categories'>
                {
                    difs.map((item, index) => (
                        <div className='category' key={index} onClick={() => picked(difs[index])}>{item}</div>
                    ))
                }

            </div>
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
                    <textarea placeholder='Write a question here' name='question'></textarea>
                    <span><button className='btn text-white' type="submit">Submit</button></span>
                </form>
            </div>
            {/* <button onClick={() => setcomp(comp + 1)}>Next</button> */}
            {/* <button onClick={() => setcomp(comp - 1)}>Back</button> */}
        </>
    }
    const Options = () => {
        const [opt, setOpt] = useState([]);
        const [correct, setCorrect] = useState("");
        const [options, setOptions] = useState([]);

        const handleSubmit = (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            // opt.push(data.get("cat"));
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
            {opt.length >= 3 && <div className='text-center my-4'><button onClick={submit} className='btn btn-success'>Submit</button></div>}
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
                        0: <Categories />,
                        1: <Diff />,
                        2: <Question />,
                        3: <Options />,
                        4: <div className='text-center text-white my-5'>
                            <button
                                className='btn btn-success'
                                onClick={() => {
                                    addQuest(newquestion);
                                    setcomp(comp + 1);
                                }}>
                                Submit
                            </button>
                        </div>,
                        5: <div className='text-center text-white my-5'>
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